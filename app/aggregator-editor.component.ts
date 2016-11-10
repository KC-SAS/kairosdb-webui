import { Component, OnChanges, OnInit, Input, Output, SimpleChange, EventEmitter } from '@angular/core';
import { TypeaheadMatch } from 'ng2-bootstrap/ng2-bootstrap'
import { QueryService } from './query.service'
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';


@Component({
    selector: 'kairos-aggregator-editor',
    template: `
<div class="well">
    <div *ngIf="!showAggInfo" class="aggregator-info-icon text-uppercase">
        {{aggregatorFormat.metadata?.label || aggregatorFormat.structure?.name || 'Invalid'}} aggregator
        <i class="glyphicon glyphicon-info-sign" (click)="showAggInfo=true"></i>
    </div>
    <alert *ngIf="showAggInfo" class="aggregator-info-box" [type]="'info'" dismissible="true" (close)="showAggInfo=false">
        <i class="glyphicon glyphicon-info-sign"></i>
        Downsampling aggregator computes basic averages over the chosen time buckets
    </alert>
    <div class="input-group aggregator-property-group">
	    <span class="input-group-addon" id="prop" tooltip="The number of units for the aggregation buckets">sampling.value</span>
        <input aria-describedby="prop" [(ngModel)]="propModel" class="form-control"/>
    </div>    
    <div class="input-group">
	    <span class="input-group-addon" id="prop">sampling.unit</span>
        <input aria-describedby="prop" [(ngModel)]="propModel" class="form-control"/>
    </div>
</div>
  `,
    styles: [`
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
export class AggregatorEditorComponent implements OnChanges, OnInit {

    @Input()
    public aggregatorFormat: {};

    public constructor() {
        this.aggregatorFormat= {};
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    }

    ngOnInit() {
    }


}