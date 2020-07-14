import { Component, ViewChild, ElementRef } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { HttpClient } from '@angular/common/http';
import 'ag-grid-enterprise';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-ag-grid-group-demo',
  templateUrl: './ag-grid-group-demo.component.html',
})
export class AgGridGroupDemoComponent {
  @ViewChild('input1') input1: ElementRef;
  @ViewChild('agGrid') agGrid: AgGridAngular;
  gridApi: any;
  gridColumnApi: any;
  filterValue = '';
  filterModel;

  rowData: [];
  columnDefs = [
    {
      field: 'CompanyID',
      menuTabs: ['columnsMenuTab'],
      sortable: true,
    },
    {
      field: 'Name',
      minWidth: 200,
    },
    {
      field: 'Address',
      minWidth: 200,
      //rowGroup: true,
      enableRowGroup: true,
    },
    {
      field: 'EstablishmentDay',
      minWidth: 200,
    },
    {
      field: 'NumberofEmployee',
      minWidth: 200,
    },
  ];

  defaultColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    resizable: true,
  };

  getChildCount;
  rowModelType = 'serverSide';

  autoGroupColumnDef;
  localText;

  constructor(private http: HttpClient) {
    this.autoGroupColumnDef = {
      headerName: 'Address',
      minWidth: 200,
    };
    this.getChildCount = function (data) {
      return data == null ||
        data == undefined ||
        data.count == null ||
        data.count == undefined
        ? 0
        : data.count;
    };
    this.localText = {
      rowGroupColumnsEmptyMessage: 'Kéo thả cột vào đây!',
    };
  }


  onExportClick() {
    this.agGrid.api.forEachNode(function (node) {
      node.setExpanded(true);
    });
    setTimeout(() => {
      this.agGrid.api.exportDataAsExcel({
        processRowGroupCallback: rowGroupCallback,
      });
    }, 5000);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    var fakeServer = this.createServer();
    var datasource = this.createServerSideDatasource(fakeServer);
    params.api.setServerSideDatasource(datasource);
  }

  createServerSideDatasource(server: { getData: any }) {
    return {
      getRows: function (params) {
        console.log('[Datasource] - rows requested by grid: ', params);
        server.getData(params.request).subscribe(
          (response) => {
            if (response.companies != undefined) {
              console.log(response);
              params.successCallback(
                response.companies,
                response.numberOfRecords
              );
            } else {
              console.log(response);
              params.successCallback(response, response.length);
            }
          },
          () => {
            console.log('LOI!');
            params.failCallback();
          }
        );
      },
    };
  }

  createServer() {
    return {
      getData: (request: { groupKeys: string[]; rowGroupCols }) => {
        if (request.rowGroupCols.length > 0) {
          if (request.groupKeys.length == 0)
            return this.http
              .get('http://localhost:44388/api/AddressGroup', {
                params: {
                  groupKey: '',
                },
              })
              .pipe(
                map((response: any[]) => {
                  var responseAddress = [];
                  for (const data of response) {
                    responseAddress.push({
                      Address: data.address,
                      count: data.count,
                    });
                  }
                  return responseAddress;
                })
              );
          else
            return this.http.get('http://localhost:44388/api/AddressGroup', {
              params: {
                groupKey: request.groupKeys[0],
              },
            });
        } else
          return this.http.get('http://localhost:44388/api/Management', {
            params: {
              pageNumber: '1',
              rowPerPage: '15',
            },
          });
      },
    };
  }
}

function rowGroupCallback(params) {
  console.log(params);
  return params.node.key;
}
