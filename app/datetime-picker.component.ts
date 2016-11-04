import {Component, Input, Output, EventEmitter, OnChanges, SimpleChange} from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'kairos-datetimepicker',
    template: `
    	<kairos-datepicker [dateModel]="date"></kairos-datepicker>
		<kairos-timepicker [timeModel]="time"></kairos-timepicker>
  `,
    styles: [`
  `],
})
export class DateTimePickerComponent implements OnChanges{
    public date: String;
    public time: String;

    @Input()
    timestamp: number;
    @Output()
    timestampChange = new EventEmitter<number>();

    @Input()
    timezone: string;
    

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {

    }



}