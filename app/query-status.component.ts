import { Component, OnChanges, OnInit, Input, Output, SimpleChange, EventEmitter } from '@angular/core';
import { QueryStatus } from './model/query-status';
import * as _ from 'lodash';
import * as numeral from 'numeral';

@Component({
    selector: 'kairos-query-status',
    template: `
    <div *ngIf="model?.status==='progress'" class="progress progress-striped active" style="margin-right: 100px; margin-left: 100px;">
        <div class="progress-bar"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%; ">
        </div>
    </div>
    <alert *ngIf="model?.status==='success'" [type]="'success'">
        <div>Query Time: {{duration}}</div>
        <div>Sample Size: {{sampleSize}} </div>
        <div>Data Points: {{dataPoints}}</div>
    </alert>
    <alert *ngIf="model?.status==='error'" [type]="'danger'" dismissible="true" (close)="model.status=''">
        <div *ngIf="errorHeader"><b>{{errorHeader}}</b></div>
        <div>{{errorMessage}}</div>
    </alert>
  `,
    styles: [`

  `]
})
export class QueryStatusComponent implements OnChanges, OnInit {

    @Input()
    public model: QueryStatus;

    public duration: string;
    public sampleSize: string;
    public dataPoints: string;

    public errorHeader: string;
    public errorMessage: string;

    public constructor() {

    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        if (changes['model'] && this.model) {
            if (this.model.status === 'success') {
                this.duration = '';
                this.sampleSize = '';
                this.dataPoints = '';
                this.duration = this.formatDuration(this.model['duration']);
                this.computeStatistics();
            }
            else if (this.model.status === 'error') {
                this.errorHeader = '';
                this.errorMessage = '';
                this.formatErrorMessage();
            }
        }
    }

    ngOnInit() {
    }

    formatDuration(duration: number): string {
        if (duration) {
            return numeral(duration).format('0,0') + " ms";
        }
        else {
            return '';
        }
    }

    computeStatistics() {
        var dataPointCount = 0;
        var sampleSizeCount = 0;
        if (this.model.response && _.isArray(this.model.response)) {
            this.model.response.forEach(function (resultSet) {
                sampleSizeCount += resultSet['sample_size'];
                resultSet['results'].forEach(function (queryResult) {
                    dataPointCount += queryResult.values.length;
                });
            });
        }
        this.dataPoints = numeral(dataPointCount).format('0,0');
        this.sampleSize = numeral(sampleSizeCount).format('0,0');
    }

    formatErrorMessage() {
        if(!this.model.response) {
            this.errorMessage = 'Unkown error during query';
            return;
        }
        if(typeof this.model.response === 'string' || this.model.response instanceof String){
            this.errorMessage = <string> this.model.response;
        }
        else if(this.model.response['status']===0){
            this.errorMessage = 'No response from server';
        }
        else if(this.model.response['status']>=400){
            this.errorHeader = this.model.response['status'] + " " +this.model.response['statusText'];
            this.errorMessage = this.model.response['_body'];
        }
    }

}

