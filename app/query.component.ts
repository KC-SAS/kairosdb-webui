import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import { TypeaheadMatch } from 'ng2-bootstrap/ng2-bootstrap'

@Component({
  selector: 'query-builder',
  templateUrl: 'app/query.component.html',
  styles: [`
  .panel {
    margin: 5px 5px;
    max-width: 1000px
  }
  td {
    padding: 5px 5px;
  }
  tr {
    padding: 5px 5px;
  }


  .picker-col * {
    display: inline-block;
  }

  .picker-col div {
    margin: 0px;
    padding: 0px;
  }

  .timezone-col {
    width: 190px;
  }
  .label-col {
    width: 50px;
  }
  .select-col {
    width: 230px;
  }
  
  span {
    display: block;
    text-align: left;
  }

  table {
    width: 100%;
  }



  .form-control[disabled] {
    cursor: default;
  }

  `]
})
export class QueryComponent {
  public timeStartRadioModel: string = 'Absolute';
  public timeStopRadioModel: string = 'None';
  public items: Array<string>;
  public selected:string = '';

  public constructor() {
    this.items = moment.tz.names();
  }

  public typeaheadOnSelect(e: TypeaheadMatch): void {
    console.log('Selected value: ', e.value);
  }
}