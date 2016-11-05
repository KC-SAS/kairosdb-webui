import { Component } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'query-builder',
  template: `
    <div class="kairos-container">
        <kairos-timerange 
        [startRelative]="query.start_relative" (startRelativeChange)="assignOrDelete('start_relative',$event)"
        [startAbsolute]="query.start_absolute" (startAbsoluteChange)="assignOrDelete('start_absolute',$event)"
        [endRelative]="query.end_relative" (endRelativeChange)="assignOrDelete('end_relative',$event)"
        [endAbsolute]="query.end_absolute" (endAbsoluteChange)="assignOrDelete('end_absolute',$event)"
        [timezone]="query.time_zone" (timezoneChange)="assignOrDelete('time_zone',$event)"
        >
        </kairos-timerange>
        <div class="panel panel-primary">
            <div class="panel-heading">Json Query</div>
            <textarea (ngModelChange)="parse($event)" [ngModel]="query | json" class="form-control" rows="10"></textarea>
        </div>
    </div>
  `,
  styles: [`
    .kairos-container {
        margin: 5px 5px;
        max-width: 1000px;
    }
  `]
})
export class QueryComponent {
    query: any = {start_relative:{value:1,unit:'hours'}};

    assignOrDelete(field, value){
        if(value===undefined || value===null || value===''){
            _.unset(this.query,field);
        }
        else{
            _.set(this.query,field, value);
        }
    }

    parse(jsonQuery: string){
        try{
            this.query = JSON.parse(jsonQuery);
        }
        catch(e){/* I don't CARE !!! */}
    }

}