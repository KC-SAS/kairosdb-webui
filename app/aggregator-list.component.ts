import { Component, OnChanges, OnInit, Input, Output, SimpleChange, EventEmitter } from '@angular/core';
import { TypeaheadMatch } from 'ng2-bootstrap/ng2-bootstrap'
import { QueryService } from './query.service'
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';


@Component({
    selector: 'kairos-aggregator-list',
    template: `
<table>
<td class="aggregator-name-column">
    <div *ngFor="let aggregatorObject of aggregatorObjectList; let idx = index">
        <div class="input-group agregator-name">
            <select class="form-control aggregator-select" [(ngModel)]="aggregatorObject.name" >
                <option [value]="'sum'">Sum</option>
                <option [value]="'avg'">Avg</option>
			    <option [value]="'diff'">Diff</option>
			    <option [value]="'scale'">Scale</option>
      		    <option [value]="'first'">First</option>
			    <option [value]="'last'">Last</option>
			    <option [value]="'count'">Count</option>
            </select>
	        <button type="button" class="btn btn-default form-control aggregator-state" aria-label="..."><span class="glyphicon glyphicon-ok"></span></button>
        </div>
        <div *ngIf="idx<aggregatorObjectList.length-1" class="glyphicon glyphicon-arrow-down aggregator-arrow"></div>
    </div>
</td>
<td class="aggregator-display-area">
    <kairos-aggregator-editor></kairos-aggregator-editor>
</td>
</table>
  `,
    styles: [`
    table {
        width: 100%;
    }
    .aggregator-state {
        width: 40px;
    }
    .aggregator-select, .aggregator-arrow {
        width: 150px;
    }
    .aggregator-arrow {
        text-align: center;
        padding: 5px
    }
    .aggregator-name-column {
        width: 200px;
    }
    .aggregator-display-area {
        vertical-align: top;
    }
    .aggregator-property-group {
        padding-bottom: 15px;
    }
    .aggregator-info-box {
        font-size: small;
        text-align: center;
    }
    .aggregator-info-box .glyphicon {
        padding-right: 5px;
    }

    .aggregator-info-icon {
        width: 100%;
        padding-bottom: 15px;
        padding-top: 5px;
        margin-top: -5px;
        position: relative;
        font-size: small;
        color: #595555;
    }

    .aggregator-info-icon .glyphicon {
        position: absolute;
        right: 0px;
        
    }
  `]
})
export class AggregatorListComponent implements OnChanges, OnInit {
    public aggregatorObjectList: {}[];
    public aggregatorNameList: string[];
    public aggregatorDescriptions: {}[];

    public constructor(public queryService: QueryService) {
        this.aggregatorObjectList = [{name:'sum'}];
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    }

    ngOnInit() {
        this.queryService.getAggregators().then(description => {
            if(description['aggregators']){
                //this.aggregatorNameList = _.map<{},{}>(_.map<{},{}>(description['aggregators'],_.property('metadata'));
                //this.aggregatorDescriptions = description['aggregators'];
            }
        });
    }

    addNew() {
        this.aggregatorObjectList.push({name:'sum'});
    }


}

