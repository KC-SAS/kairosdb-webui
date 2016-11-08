import { Component, OnChanges, Input, Output, SimpleChange, EventEmitter } from '@angular/core';
import * as moment from 'moment-timezone';
import { TypeaheadMatch } from 'ng2-bootstrap/ng2-bootstrap'

@Component({
  selector: 'kairos-timerange',
  templateUrl: 'app/time/time-range.component.html',
  styles: [`
  td {
    padding-top: 5px;
    padding-bottom: 5px;
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
    width: 170px;
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
export class TimeRangeComponent implements OnChanges {
  public timeStartRadioModel: string = 'Absolute';
  public timeEndRadioModel: string = 'None';
  public items: Array<string>;
  public componentValid: boolean = true;

  @Input()
  public timezone: string;
  @Output()
  timezoneChange = new EventEmitter<string>();

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

    if (this.componentValid) {
      if (this.startRelative !== undefined) {
        this.timeStartRadioModel = "Relative";
      }
      else if (this.startAbsolute !== undefined) {
        this.timeStartRadioModel = "Absolute";
      }
      if (this.endRelative !== undefined) {
        this.timeEndRadioModel = "Relative";
      }
      else if (this.endAbsolute !== undefined) {
        this.timeEndRadioModel = "Absolute";
      }
      else{
        this.timeEndRadioModel = undefined;
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

  fixInvalid() {
    if (this.startRelative == undefined && this.startAbsolute == undefined) {
      this.startRelative = { value: 1, unit: 'hours' };
      this.startRelativeChange.emit(this.startRelative);
      this.timeStartRadioModel = "Relative";
    }
    if (this.startRelative !== undefined && this.startAbsolute !== undefined) {
      this.startRelative = undefined;
      this.startRelativeChange.emit(this.startRelative);
      this.timeStartRadioModel = "Absolute";
    }
    if (this.endRelative !== undefined && this.endAbsolute !== undefined) {
      this.endRelative = undefined;
      this.endRelativeChange.emit(this.endRelative);
      this.timeEndRadioModel = "Absolute";
    }
  }

  onRadioClick(startOrEnd: string) {
    let absolute = startOrEnd+'Absolute';
    let relative = startOrEnd+'Relative';
    let radioModel = this['time'+startOrEnd.charAt(0).toUpperCase()+startOrEnd.slice(1)+'RadioModel'];
    if (radioModel == 'Absolute') {
      this[absolute] = this.defaultDate();
      this[relative] = undefined;

    }
    else if (radioModel == 'Relative') {
      this[relative] = { value: 1, unit: 'hours' };
      this[absolute] = undefined;

    }
    else {
      this[relative] = undefined;
      this[absolute] = undefined;
    }
    this[relative+'Change'].emit(this[relative]);
    this[absolute+'Change'].emit(this[absolute]);

  }

  onTimezoneBlur(element: HTMLInputElement) {
    this.timezone = this.items.includes(element.value) ? element.value : '';
    element.value = this.timezone;
    this.timezoneChange.emit(this.timezone);
  }

}

