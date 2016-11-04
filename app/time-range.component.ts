import { Component, OnChanges, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import * as moment from 'moment-timezone';
import { TypeaheadMatch } from 'ng2-bootstrap/ng2-bootstrap'

@Component({
  selector: 'kairos-timerange',
  templateUrl: 'app/time-range.component.html',
  styles: [`
  td {
    padding: 5px 5px;
  }

  tr {
    padding: 5px 5px;
  }

  .picker-col * {
    display: inline-flex;
    padding-right: 5px;
  }

  .timezone-col {
    width: 190px;
  }

  .label-col {
    width: 50px;
  }

  .select-col {
    width: 160px;
  }
  
  span {
    display: block;
    text-align: left;
  }

  table {
    width: 100%;
  }
  `]
})
export class TimeRangeComponent implements OnChanges{
  public timeStartRadioModel: string = 'Absolute';
  public timeStopRadioModel: string = 'None';
  public items: Array<string>;
  public selected:string = '';

  @Input()
  startRelative: any;
  @Output()
  startRelativeChange = new EventEmitter<any>();

  @Input()
  startAbsolute: any;
  @Output()
  startAbsoluteChange = new EventEmitter<any>();

  @Input()
  endRelative: any;
  @Output()
  endRelativeChange = new EventEmitter<any>();

  @Input()
  endAbsolute: any;
  @Output()
  endAbsoluteChange = new EventEmitter<any>();

  public constructor() {
    this.items = moment.tz.names();
    //this.startRelative = {unit:'hours'};
  }

  public typeaheadOnSelect(e: TypeaheadMatch): void {
    console.log('Selected value: ', e.value);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['startRelative'] ){

    }
  }
}

