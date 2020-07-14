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
import { CustomPinnedRowRenderer } from '../ag-grid/custom-pinned.component';

@Component({
  selector: 'app-server-side-grid',
  templateUrl: './server-side-grid.component.html',
})
export class ServerSideGridComponent {
  @ViewChild('input1') input1: ElementRef;
  @ViewChild('agGrid') agGrid: AgGridAngular;
  gridApi: any;
  gridColumnApi: any;
  filterValue = '';
  rowPerPage = 100;
  filterModel;

  rowData: [];
  colSTT = {
    field: 'STT',
    menuTabs: ['columnsMenuTab'],
    sortable: true,
    hide: false,
  };
  colVehiclePlate = {
    field: 'VehiclePlate',
    minWidth: 200,
    hide: false,
  };
  colStartAddress = {
    field: 'StartAddress',
    minWidth: 200,
    hide: false,
  };
  colEndAddress = {
    field: 'EndAddress',
    minWidth: 200,
    hide: false,
  };
  colEndLatitude = {
    field: 'EndLatitude',
    minWidth: 200,
    hide: false,
  };
  EndLongitude = {
    field: 'EndLongitude',
    minWidth: 200,
    hide: false,
  };
  EndTimeGPS = {
    field: 'EndTimeGPS',
    minWidth: 200,
    hide: false,
  };
  StartLatitude = {
    field: 'StartLatitude',
    minWidth: 200,
    hide: false,
  };
  StartLongitude = {
    field: 'StartLongitude',
    minWidth: 200,
    hide: false,
  };
  StartTimeGPS = {
    field: 'StartTimeGPS',
    minWidth: 200,
    hide: false,
  };
  Note = {
    field: 'Note',
    minWidth: 200,
    hide: false,
  };
  MoneyReceiver = {
    field: 'MoneyReceiver',
    minWidth: 200,
    hide: false,
  };
  KmHasGuest = {
    field: 'KmHasGuest',
    minWidth: 200,
    hide: false,
  };

  defaultColDef = {
    flex: 1,
    minWidth: 100,
    menuTabs: ['columnsMenuTab'],
    resizable: true,
  };
  rowModelType = 'serverSide';
  columnDefs: any[];
  pinnedTopRowData;
  pinnedBottomRowData;
  frameworkComponents;
  getRowStyle

  constructor(private http: HttpClient) {
    this.columnDefs = [
      this.colSTT,
      this.colVehiclePlate,
      this.Note,
      this.StartTimeGPS,
      this.EndTimeGPS,
      this.MoneyReceiver,
      this.KmHasGuest,
    ];
    this.getRowStyle = function(params) {
      if (params.node.rowPinned) {
        return { 'font-weight': 'bold' };
      }
    };
    this.pinnedBottomRowData = createData();
    this.frameworkComponents = {
      customPinnedRowRenderer: CustomPinnedRowRenderer,
    };
  }

  onGridReady(params: {
    api: {
      sizeColumnsToFit: () => void;
      setServerSideDatasource: (arg0: {
        getRows: (params: any) => void;
      }) => void;
    };
    columnApi: any;
  }) {
    params.api.sizeColumnsToFit();
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
            params.successCallback(response.ListDevExTest, +response.TotalRows);
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
        return this.http.get(
          'http://pm-trinhtx2:2510/api/DevExTests/PhanTrang',
          {
            params: {
              Filter: this.filterValue,
              pageIndex: (
                request.endRow /
                (request.endRow - request.startRow)
              ).toString(),
              RowPerPage: this.rowPerPage.toString(),
            },
          }
        );
      },
    };
  }

  onFilterChange() {
    this.filterValue = this.input1.nativeElement.value;
    this.agGrid.api.onFilterChanged();
  }
}
function createData() {
  var result = [];
    result.push({
      STT: 'Total',
      MoneyReceiver: 'Total money'
    });
  return result;
}
