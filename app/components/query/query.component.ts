import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { QueryService } from '../../query.service';
import { QueryStatus } from '../../model/query-status';
import { Query } from '../../model/query';

@Component({
    moduleId: module.id,
    selector: 'query-builder',
    templateUrl: 'query.component.html',
    styleUrls: [ 'query.component.css' ]
})
export class QueryComponent implements OnInit{

    public queryResult: {}[];
    public statusModel: QueryStatus;

    public jsonEditorDisabled: boolean;

    public generatedQuery: Query;
    public parsedQuery: Query;
    public displayedQuery: string;

    public invalidJson: boolean;

    public constructor(private queryService: QueryService) {
        this.jsonEditorDisabled = true;
    }

    ngOnInit(){
        this.parse(`{
            "start_relative": { "value": 1, "unit": "hours" },
            "metrics": [{
                "name": ""
            }]
        }`);
    }

    assignOrDelete(field, value) {
        if (value === undefined || value === null || value === '') {
            _.unset(this.generatedQuery, field);
        }
        else {
            _.set(this.generatedQuery, field, value);
        }
        this.displayedQuery = this.toPrettyJson(this.generatedQuery);
    }

    parse(jsonQuery: string) {
        try {
            this.parsedQuery = JSON.parse(jsonQuery);
            this.generatedQuery = _.cloneDeep(this.parsedQuery);
            this.displayedQuery = this.toPrettyJson(this.generatedQuery);
        }
        catch (e) {
            // TODO display 'invalid json'
        }
    }

    executeQuery() {
        this.queryResult = undefined;
        let startTime = new Date();
        this.statusModel = {
            status: 'progress',
            response: undefined,
            duration: undefined,
        };
        this.queryService.executeQuery(this.displayedQuery).then(
            (results) => {
                this.queryResult = results;
                this.statusModel = {
                    status: 'success',
                    duration: new Date().getTime() - startTime.getTime(),
                    response: results
                }

            },
            (error) => {
                console.log("query failure in query.component");
                this.statusModel = {
                    status: 'error',
                    duration: new Date().getTime() - startTime.getTime(),
                    response: error
                }
            });
    }

    toPrettyJson(object){
        return JSON.stringify(this.generatedQuery, null, 2);
    }

}
