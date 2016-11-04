import { Component, OnChanges, Input, Output, SimpleChange, EventEmitter } from '@angular/core';
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
  public timezone:string = '';
  public componentValid: boolean=true;

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

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    let hasStart = this.startRelative !== undefined || this.startAbsolute !== undefined;
    let absRelConflictStart = this.startRelative !== undefined && this.startAbsolute !== undefined;
    let absRelConflictEnd = this.endRelative !== undefined && this.endAbsolute !== undefined;

    this.componentValid = hasStart && !absRelConflictStart && !absRelConflictEnd;

    if(this.componentValid){
      if(this.startRelative !== undefined){
        this.timeStartRadioModel = "Relative";
      }
      else if(this.startAbsolute !== undefined){
        this.timeStartRadioModel = "Absolute";
      }
    }
  }

  defaultDate() {
    let dateTimeObject;
    if (this.timezone)
      dateTimeObject = moment.tz(this.timezone);
    else
      dateTimeObject = moment();
    dateTimeObject.hour(0);
    dateTimeObject.minute(0);
    dateTimeObject.second(0);
    dateTimeObject.millisecond(0);
    return dateTimeObject.valueOf();
  }

  fixInvalid(){
    if(this.startRelative == undefined && this.startAbsolute == undefined){
      this.startRelative = {value:1,unit:'hours'};
      this.startRelativeChange.emit(this.startRelative);
      this.timeStartRadioModel = "Relative";
    }
    if(this.startRelative !== undefined && this.startAbsolute !== undefined){
      this.endRelative = undefined;
      this.endRelativeChange.emit(this.endRelative);
      this.timeStartRadioModel = "Absolute";
    }
  }

  onTimezoneBlur(element) {
    this.timezone = this.items.includes(element.value) ? element.value : '';
    element.value=this.timezone;
  }

}

