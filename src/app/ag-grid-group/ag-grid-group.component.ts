import { Component, ViewChild, ElementRef } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { HttpClient } from '@angular/common/http';
import 'ag-grid-enterprise';

@Component({
  selector: 'app-ag-grid-group',
  templateUrl: './ag-grid-group.component.html',
})
export class AgGridGroupComponent {
  @ViewChild('input1') input1: ElementRef;
  @ViewChild('agGrid') agGrid: AgGridAngular;
  gridApi: any;
  gridColumnApi: any;
  filterValue = '';
  rowPerPage = 10;
  filterModel;

  rowData: [];
  columnDefs = [
    {
      field: 'Address',
      minWidth: 200,
      rowGroup: true,
      hide: true,
    },
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
  rowModelType = 'serverSide';

  excelStyles = [
    {
      id: 'indent-1',
      alignment: { indent: 1 },
      dataType: 'string',
    },
  ];

  autoGroupColumnDef;

  constructor(private http: HttpClient) {
    
    this.autoGroupColumnDef = {
      cellClass: getIndentClass,
      headerName: 'Address',
      minWidth: 200,
      cellRendererParams: {
        suppressCount: false,
      },
      comparator: function (valueA, valueB) {
        if (valueA == null || valueB == null) return valueA - valueB;
        if (!valueA.substring || !valueB.substring) return valueA - valueB;
        if (valueA.length < 1 || valueB.length < 1) return valueA - valueB;
        return strcmp(
          valueA.substring(1, valueA.length),
          valueB.substring(1, valueB.length)
        );
      },
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
    }, 1000);
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
            console.log(response);
            params.successCallback(
              response.companies,
              +response.numberOfRecords
            );
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
      getData: (request: { startRow: any; endRow: any }) => {
        return this.http.get('http://localhost:44388/api/Management', {
          params: {
            pageNumber: (
              request.endRow /
              (request.endRow - request.startRow)
            ).toString(),
            rowPerPage: this.rowPerPage.toString(),
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
function getIndentClass(params) {
  var indent = 0;
  var node = params.node;
  while (node && node.parent) {
    indent++;
    node = node.parent;
  }
  return ['indent-' + indent];
}

function strcmp(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}
