import {Component, Input, Output, EventEmitter, OnChanges, SimpleChange} from '@angular/core';
import * as moment from 'moment-timezone';

@Component({
    selector: 'kairos-datetimepicker',
    template: `
    <div>
    	<kairos-datepicker [(dateModel)]="date" (dateModelChange)="updateTimestamp()"></kairos-datepicker>
		<kairos-timepicker [(timeModel)]="time" (timeModelChange)="updateTimestamp()"></kairos-timepicker>
    </div>
  `,
    styles: [`
    * {
        display: inline-flex;
        padding-right: 5px;
    }
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
        if(changes['timestamp']){
            let dateTimeObject;
            if(this.timezone)
                dateTimeObject =moment.tz(this.timestamp,this.timezone);
            else
                dateTimeObject =moment(this.timestamp);
            this.date = dateTimeObject.format("YYYY-MM-DD");
            this.time = dateTimeObject.format("hh:mm:ss.SSS");
        }
    }

    updateTimestamp(){
        let dateTimeObject;
        if (this.timezone)
            dateTimeObject = moment.tz(this.date + " " + this.time, this.timezone);
        else
            dateTimeObject = moment(this.date + " " + this.time);
        this.timestamp = dateTimeObject.valueOf();

    }



}