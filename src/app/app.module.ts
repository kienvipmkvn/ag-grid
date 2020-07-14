import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { AgGridComponent } from './ag-grid/ag-grid.component';
import { ServerSideGridComponent } from './server-side-grid/server-side-grid.component';
import { ServerSideCompanyComponent } from './server-side-company/server-side-company.component';
import { AgGridMasterDetailComponent } from './ag-grid-master-detail/ag-grid-master-detail.component';
import { AgGridGroupComponent } from './ag-grid-group/ag-grid-group.component';
import { CustomPinnedRowRenderer } from './ag-grid/custom-pinned.component';
import { AgGridGroupDemoComponent } from './ag-grid-group-demo/ag-grid-group-demo.component';

@NgModule({
  declarations: [
    AppComponent,
    AgGridComponent,
    ServerSideGridComponent,
    ServerSideCompanyComponent,
    AgGridMasterDetailComponent,
    AgGridGroupComponent,
    CustomPinnedRowRenderer,
    AgGridGroupDemoComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AgGridModule.withComponents([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
