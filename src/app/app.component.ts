import { Component } from '@angular/core';
import * as dt from '../assets/generatedata';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  componentSelected = 'column';
  onClick(component) {
    this.componentSelected = component;
  }
  data;
  // constructor(private http: HttpClient){}

  // onFileExport() {
  //   var st = new Date().getTime();
  //   let data1 = dt.generateData(200000);
  //   //this.data = JSON.stringify(data1);
  //   console.log(new Date().getTime() - st);
  //   this.http.put("https://generatedata-df54b.firebaseio.com/data.json", data1).subscribe();
  // }
}
