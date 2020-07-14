import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { HttpClient } from '@angular/common/http';
import * as dt from '../../assets/generatedata';
import 'ag-grid-enterprise';

@Component({
  selector: 'app-ag-grid-master-detail',
  templateUrl: './ag-grid-master-detail.component.html',
})
export class AgGridMasterDetailComponent {
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
      field: 'CompanyID',
      cellRenderer: 'agGroupCellRenderer',
    },
    {
      field: 'Name',
    },
    {
      field: 'Address',
    },
    {
      field: 'EstablishmentDay',
    },
    {
      field: 'NumberofEmployee',
    },
  ];

  defaultColDef = {
    flex: 1,
    minWidth: 200,
    resizable: true,
  };
  rowModelType = 'serverSide';
  detailCellRendererParams;
  excelStyles;
  defaultExportParams;

  constructor(private http: HttpClient) {
    
    this.detailCellRendererParams = {
      detailGridOptions: {
        columnDefs: [
          { field: 'ProductID' },
          { field: 'Name' },
          {
            field: 'Price',
          },
          {
            field: 'Color',
          },
        ],
        defaultColDef: { flex: 1, minWidth: 50, resizable: true },
      },
      autoHeight: true,
      getDetailRowData: function (params) {
        params.successCallback(params.data.ListProduct);
      },
    };

    this.defaultExportParams = {
      getCustomContentBelowRow: function (params) {
        return [
          [
            cell('', 'header'),
            cell('Product Id', 'header'),
            cell('Product Name', 'header'),
            cell('Price', 'header'),
            cell('Color', 'header'),
          ],
        ].concat(
          params.node.data.ListProduct.map(function (product) {
            return [
              cell('', 'body'),
              cell(product.ProductID, 'body'),
              cell(product.Name, 'body'),
              cell(product.Price, 'body'),
              cell(product.Color, 'body'),
            ];
          }),
          [[]]
        );
      },
      columnWidth: 120,
    };
    this.excelStyles = [
      {
        id: 'header',
        interior: {
          color: '#aaaaaa',
          pattern: 'Solid',
        },
      },
      {
        id: 'body',
        interior: {
          color: '#dddddd',
          pattern: 'Solid',
        },
      },
    ];
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    var fakeServer = this.createServer();
    var datasource = this.createServerSideDatasource(fakeServer);
    params.api.setServerSideDatasource(datasource);
  }

  onExportClick() {
    this.agGrid.api.exportDataAsExcel(this.defaultExportParams);
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
function cell(text, styleId) {
  return {
    styleId: styleId,
    data: {
      type: /^\d+$/.test(text) ? 'Number' : 'String',
      value: String(text),
    },
  };
}
