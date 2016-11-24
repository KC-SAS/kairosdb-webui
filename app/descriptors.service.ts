import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { QueryService } from './query.service';
import { AGGREGATORS } from './mocks/mock-aggregators'
import { GROUP_BYS } from './mocks/mock-groupbys'

let descriptorList = [{
    name: "group_by",
    label: "Group By",
    properties: GROUP_BYS
},
{
    name: "aggregators",
    label: "Aggregator",
    properties: AGGREGATORS
}];


@Injectable()
export class DescriptorService {

  constructor(private queryService: QueryService) { }

  getDescriptorList(): Promise<{}[]> {
      return Promise.resolve(descriptorList);
  }
}