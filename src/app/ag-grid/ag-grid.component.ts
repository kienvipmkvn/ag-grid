import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import * as dt from '../../assets/generatedata';
import 'ag-grid-enterprise';
import { CustomPinnedRowRenderer } from './custom-pinned.component';

@Component({
  selector: 'app-ag-grid',
  templateUrl: './ag-grid.component.html',
})
export class AgGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  startTime: number;
  defaultColDef = {
    flex: 1,
    minWidth: 150,
    resizable: true,
    sortable: true,
    filter: true,
  };
  autoGroupColumnDef = { minWidth: 200 };
  rowGroupPanelShow = 'always';
  columnDefs = [
    {
      headerName: 'First Name',
      field: 'firstname',
      checkboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    },
    {
      headerName: 'Last Name',
      field: 'lastname',
    },
    {
      headerName: 'Product Name',
      field: 'productname',
      enableRowGroup: true,
    },
    {
      headerName: 'Price',
      field: 'price',
    },
    {
      headerName: 'Quantity',
      field: 'quantity',
      filter: 'agNumberColumnFilter',
    },
  ];

  rowData: any;
  detailCellRendererParams;
  
  pinnedTopRowData;
  pinnedBottomRowData;
  frameworkComponents;
  getRowStyle

  ngOnInit() {
    this.startTime = new Date().getTime();
    this.rowData = dt.generateData(10000);
    
    this.getRowStyle = function(params) {
      if (params.node.rowPinned) {
        return { 'font-weight': 'bold' };
      }
    };
    this.pinnedBottomRowData = createData();
    this.frameworkComponents = {
      customPinnedRowRenderer: CustomPinnedRowRenderer,
    };
    this.detailCellRendererParams = {
      detailGridOptions: {
        columnDefs: [
          { field: 'firstname' },
          { field: 'lastname' },
          {
            field: 'productname',
          },
          {
            field: 'price',
            minWidth: 150,
          },
          {
            field: 'quantity',
            minWidth: 180,
          },
        ],
        defaultColDef: { flex: 1 },
      },
      getDetailRowData: function(params) {
        params.successCallback(dt.generateData(10));
      },
    };

  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
    
    var rows = createData();
    this.agGrid.api.setPinnedBottomRowData(rows);
  }

  onBtPrint() {
    this.agGrid.api.setDomLayout('print');
    print();
  }
}
function createData() {
  var result = [];
    result.push({
      firstname: 'Total',
      lastname: '',
      productname: '',
      price: 'Sum price',
      quantity:'Sum quantity'
    });
  return result;
}