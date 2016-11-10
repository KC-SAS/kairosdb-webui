    import { Injectable }    from '@angular/core';
    import { Headers, Http } from '@angular/http';
    import 'rxjs/add/operator/toPromise';
    import { AGGREGATORS } from './mock-aggregators'
 
    @Injectable()
    export class QueryService {
      private headers = new Headers({'Content-Type': 'application/json'});
      private metricNamesUrl = 'http://localhost:8080/api/v1/metricnames';  
      private tagsUrl = 'http://localhost:8080/api/v1/datapoints/query/tags';

      constructor(private http: Http) { }

      getMetricNames(): Promise<string[]> {
        return this.http.get(this.metricNamesUrl)
                   .toPromise()
                   .then(response => response.json().results || [] as string[])
                   .catch(this.handleError);
      }

      getTagNameValues(metricName: string): Promise<any> {
        return this.http.post(this.tagsUrl, JSON.stringify({cache_time:0, start_absolute:0, metrics:[{tags:{},name:metricName}]}), {headers:this.headers})
                   .toPromise()
                   .then(response => response.json().queries[0].results[0].tags || {} )
                   .catch(this.handleError);
      }

      getAggregators(): Promise<any> {
        return Promise.resolve(AGGREGATORS);
      }


      private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
      }
    }