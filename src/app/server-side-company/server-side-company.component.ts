import {
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  AfterContentInit,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'ag-grid-enterprise';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-server-side-company',
  templateUrl: './server-side-company.component.html',
})
export class ServerSideCompanyComponent {
  @ViewChild('input1') input1: ElementRef;
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('form') form: ElementRef;
  gridApi: any;
  gridColumnApi: any;
  filterValue = '';
  rowPerPage = 10;

  rowData: [];
  allColumns = [
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
    menuTabs: ['columnsMenuTab'],
    resizable: true,
  };
  rowModelType = 'serverSide';
  columnDefs: any[] = [];
  requiredCol: number[] = [0, 1];
  selectedCol: number[];

  constructor(private http: HttpClient) {
    if (localStorage.getItem('columnCompany') != null) {
      this.selectedCol = [...this.requiredCol];
      var columnDefs = JSON.parse(localStorage.getItem('columnCompany'));
      for (const col of columnDefs) {
        var index = this.allColumns.findIndex((value) => {
          return value.field === col.field;
        });
        if (!this.selectedCol.includes(index)) this.selectedCol.push(index);
      }
      for (const index of this.selectedCol) {
        this.columnDefs.push(this.allColumns[index]);
      }
    } else {
      this.columnDefs = this.allColumns;
    }
  }

  isSelected(index) {
    return this.selectedCol.includes(index);
  }

  isRequired(index) {
    return this.requiredCol.includes(index);
  }

  onBtApply() {
    var colDefs = [];
    var selectedCol = [];
    for (let i = 0; i < this.allColumns.length; i++) {
      if (this.form.nativeElement[i].checked === true) {
        selectedCol.push(i);
        colDefs.push(this.allColumns[i]);
      }
    }
    this.selectedCol = selectedCol;
    this.columnDefs = colDefs;
    localStorage.setItem('columnCompany', JSON.stringify(colDefs));
    localStorage.setItem(
      'columnState',
      JSON.stringify(this.agGrid.columnApi.getColumnState())
    );
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    var fakeServer = this.createServer();
    var datasource = this.createServerSideDatasource(fakeServer);
    params.api.setServerSideDatasource(datasource);
    if (localStorage.getItem('columnState') != null)
      this.agGrid.columnApi.setColumnState(
        JSON.parse(localStorage.getItem('columnState'))
      );
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
