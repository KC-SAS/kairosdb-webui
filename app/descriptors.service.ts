import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { QueryService } from './query.service';
import { AGGREGATORS } from './mocks/mock-aggregators';
import { GROUP_BYS } from './mocks/mock-groupbys';
import { PsDescriptor } from './model/ps';

let descriptorList = [
   {
      "name":"groupby",
      "label":"Group By",
      "properties":[
         {
            "name":"bin",
            "label":"Bin",
            "description":"Groups data points by bins or buckets.",
            "properties":[
               {
                  "name":"bins",
                  "label":"Bin Values",
                  "description":"List of bin values. For example, if the list of bins is 10, 20, 30, then values less than 10 are placed in the first group, values between 10-19 into the second group, and so forth.",
                  "optional":false,
                  "type":"array",
                  "options":[

                  ],
                  "defaultValue":"[]",
                  "validations":[
                     {
                        "expression":"value.length > 0",
                        "type":"js",
                        "message":"The list can't be empty."
                     }
                  ]
               }
            ]
         },
         {
            "name":"tag",
            "label":"Tag",
            "description":"Groups data points by tag names.",
            "properties":[
               {
                  "name":"tags",
                  "label":"Tags",
                  "description":"A list of tags to group by.",
                  "optional":false,
                  "type":"array",
                  "options":[

                  ],
                  "defaultValue":"[]",
                  "validations":[
                     {
                        "expression":"value.length > 0",
                        "type":"js",
                        "message":"Tags can't be empty."
                     }
                  ]
               }
            ]
         },
         {
            "name":"time",
            "label":"Time",
            "description":"Groups data points in time ranges.",
            "properties":[
               {
                  "name":"groupCount",
                  "label":"Count",
                  "description":"The number of groups. This would typically be 7 to group by day of week.",
                  "optional":false,
                  "type":"int",
                  "options":[

                  ],
                  "defaultValue":"0",
                  "validations":[
                     {
                        "expression":"value > 0",
                        "type":"js",
                        "message":"Count must be greater than 0."
                     }
                  ]
               },
               {
                  "name":"rangeSize",
                  "label":"Range Size",
                  "optional":false,
                  "type":"Object",
                  "properties":[
                     {
                        "name":"value",
                        "label":"Value",
                        "description":"The number of units for the aggregation buckets",
                        "optional":false,
                        "type":"long",
                        "options":[

                        ],
                        "defaultValue":"1",
                        "validations":[
                           {
                              "expression":"value > 0",
                              "type":"js",
                              "message":"Value must be greater than 0."
                           }
                        ]
                     },
                     {
                        "name":"unit",
                        "label":"Unit",
                        "description":"The time unit for the sampling rate",
                        "optional":false,
                        "type":"enum",
                        "options":[
                           "MILLISECONDS",
                           "SECONDS",
                           "MINUTES",
                           "HOURS",
                           "DAYS",
                           "WEEKS",
                           "MONTHS",
                           "YEARS"
                        ],
                        "defaultValue":"MILLISECONDS",
                        "validations":[

                        ]
                     }
                  ]
               }
            ]
         },
         {
            "name":"value",
            "label":"Value",
            "description":"Groups data points by value.",
            "properties":[
               {
                  "name":"rangeSize",
                  "label":"Target Size",
                  "description":"The range for each value. For example, if the range size is 10, then values between 0-9 are placed in the first group, values between 10-19 into the second group, and so forth.",
                  "optional":false,
                  "type":"int",
                  "options":[

                  ],
                  "defaultValue":"0",
                  "validations":[
                     {
                        "expression":"value >= 0",
                        "type":"js",
                        "message":"Target size must be greater or equal than 0."
                     }
                  ]
               }
            ]
         }
      ]
   },
   {
      "name":"aggregator",
      "label":"Aggregator",
      "properties":[
         {
            "name":"avg",
            "label":"AVG",
            "description":"Averages the data points together.",
            "properties":[
               {
                  "name":"align_sampling",
                  "label":"Align sampling",
                  "description":"When set to true the time for the aggregated data point for each range will fall\" +\n                \"on the start of the range instead of being the value for the first data point within that range. \" +\n                \"Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                  "optional":false,
                  "type":"boolean",
                  "options":[

                  ],
                  "defaultValue":"true",
                  "validations":[

                  ]
               },
               {
                  "name":"align_start_time",
                  "label":"Align start time",
                  "description":"Setting this to true will cause the aggregation range to be aligned based on the sampling size. \" +\n                \"For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. \" +\n                \"The effect of setting this to true is that your data will take the same shape when graphed as you refresh the data. \" +\n                \"Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                  "optional":false,
                  "type":"boolean",
                  "options":[

                  ],
                  "defaultValue":"false",
                  "validations":[

                  ]
               },
               {
                  "name":"sampling",
                  "label":"Sampling",
                  "optional":false,
                  "type":"Object",
                  "properties":[
                     {
                        "name":"value",
                        "label":"Value",
                        "description":"The number of units for the aggregation buckets",
                        "optional":false,
                        "type":"long",
                        "options":[

                        ],
                        "defaultValue":"1",
                        "validations":[
                           {
                              "expression":"value > 0",
                              "type":"js",
                              "message":"Value must be greater than 0."
                           }
                        ]
                     },
                     {
                        "name":"unit",
                        "label":"Unit",
                        "description":"The time unit for the sampling rate",
                        "optional":false,
                        "type":"enum",
                        "options":[
                           "MILLISECONDS",
                           "SECONDS",
                           "MINUTES",
                           "HOURS",
                           "DAYS",
                           "WEEKS",
                           "MONTHS",
                           "YEARS"
                        ],
                        "defaultValue":"MILLISECONDS",
                        "validations":[

                        ]
                     }
                  ]
               }
            ]
         },
         {
            "name":"count",
            "label":"Count",
            "description":"Counts the number of data points.",
            "properties":[
               {
                  "name":"align_sampling",
                  "label":"Align sampling",
                  "description":"When set to true the time for the aggregated data point for each range will fall\" +\n                \"on the start of the range instead of being the value for the first data point within that range. \" +\n                \"Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                  "optional":false,
                  "type":"boolean",
                  "options":[

                  ],
                  "defaultValue":"true",
                  "validations":[

                  ]
               },
               {
                  "name":"align_start_time",
                  "label":"Align start time",
                  "description":"Setting this to true will cause the aggregation range to be aligned based on the sampling size. \" +\n                \"For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. \" +\n                \"The effect of setting this to true is that your data will take the same shape when graphed as you refresh the data. \" +\n                \"Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                  "optional":false,
                  "type":"boolean",
                  "options":[

                  ],
                  "defaultValue":"false",
                  "validations":[

                  ]
               },
               {
                  "name":"sampling",
                  "label":"Sampling",
                  "optional":false,
                  "type":"Object",
                  "properties":[
                     {
                        "name":"value",
                        "label":"Value",
                        "description":"The number of units for the aggregation buckets",
                        "optional":false,
                        "type":"long",
                        "options":[

                        ],
                        "defaultValue":"1",
                        "validations":[
                           {
                              "expression":"value > 0",
                              "type":"js",
                              "message":"Value must be greater than 0."
                           }
                        ]
                     },
                     {
                        "name":"unit",
                        "label":"Unit",
                        "description":"The time unit for the sampling rate",
                        "optional":false,
                        "type":"enum",
                        "options":[
                           "MILLISECONDS",
                           "SECONDS",
                           "MINUTES",
                           "HOURS",
                           "DAYS",
                           "WEEKS",
                           "MONTHS",
                           "YEARS"
                        ],
                        "defaultValue":"MILLISECONDS",
                        "validations":[

                        ]
                     }
                  ]
               }
            ]
         },
         {
            "name":"dev",
            "label":"Dev",
            "description":"Calculates the standard deviation of the time series.",
            "properties":[
               {
                  "name":"align_sampling",
                  "label":"Align sampling",
                  "description":"When set to true the time for the aggregated data point for each range will fall\" +\n                \"on the start of the range instead of being the value for the first data point within that range. \" +\n                \"Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                  "optional":false,
                  "type":"boolean",
                  "options":[

                  ],
                  "defaultValue":"true",
                  "validations":[

                  ]
               },
               {
                  "name":"align_start_time",
                  "label":"Align start time",
                  "description":"Setting this to true will cause the aggregation range to be aligned based on the sampling size. \" +\n                \"For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. \" +\n                \"The effect of setting this to true is that your data will take the same shape when graphed as you refresh the data. \" +\n                \"Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                  "optional":false,
                  "type":"boolean",
                  "options":[

                  ],
                  "defaultValue":"false",
                  "validations":[

                  ]
               },
               {
                  "name":"sampling",
                  "label":"Sampling",
                  "optional":false,
                  "type":"Object",
                  "properties":[
                     {
                        "name":"value",
                        "label":"Value",
                        "description":"The number of units for the aggregation buckets",
                        "optional":false,
                        "type":"long",
                        "options":[

                        ],
                        "defaultValue":"1",
                        "validations":[
                           {
                              "expression":"value > 0",
                              "type":"js",
                              "message":"Value must be greater than 0."
                           }
                        ]
                     },
                     {
                        "name":"unit",
                        "label":"Unit",
                        "description":"The time unit for the sampling rate",
                        "optional":false,
                        "type":"enum",
                        "options":[
                           "MILLISECONDS",
                           "SECONDS",
                           "MINUTES",
                           "HOURS",
                           "DAYS",
                           "WEEKS",
                           "MONTHS",
                           "YEARS"
                        ],
                        "defaultValue":"MILLISECONDS",
                        "validations":[

                        ]
                     }
                  ]
               }
            ]
         },
         {
            "name":"diff",
            "label":"Diff",
            "description":"Computes the difference between successive data points.",
            "properties":[

            ]
         },
         {
            "name":"div",
            "label":"Div",
            "description":"Divides each data point by a divisor.",
            "properties":[
               {
                  "name":"divisor",
                  "label":"divisor",
                  "description":"The value each data point is divided by.",
                  "optional":false,
                  "type":"double",
                  "options":[

                  ],
                  "defaultValue":"1",
                  "validations":[
                     {
                        "expression":"value > 0",
                        "type":"js",
                        "message":"Divisor must be greater than 0."
                     }
                  ]
               }
            ]
         },
         {
            "name":"filter",
            "label":"Filter",
            "description":"Filters datapoints according to filter operation with a null data point.",
            "properties":[
               {
                  "name":"filterop",
                  "label":"Filter operation",
                  "description":"The operation performed for each data point.",
                  "optional":false,
                  "type":"enum",
                  "options":[
                     "LTE",
                     "LT",
                     "GTE",
                     "GT",
                     "EQUAL"
                  ],
                  "defaultValue":"equal",
                  "validations":[

                  ]
               },
               {
                  "name":"threshold",
                  "label":"Threshold",
                  "description":"The value the operation is performed on. If the operation is lt, then a null data point is returned if the data point is less than the threshold.",
                  "optional":false,
                  "type":"double",
                  "options":[

                  ],
                  "defaultValue":"0.0",
                  "validations":[

                  ]
               }
            ]
         },
         {
            "name":"first",
            "label":"First",
            "description":"Returns the first value data point for the time range.",
            "properties":[
               {
                  "name":"align_sampling",
                  "label":"Align sampling",
                  "description":"When set to true the time for the aggregated data point for each range will fall\" +\n                \"on the start of the range instead of being the value for the first data point within that range. \" +\n                \"Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                  "optional":false,
                  "type":"boolean",
                  "options":[

                  ],
                  "defaultValue":"true",
                  "validations":[

                  ]
               },
               {
                  "name":"align_start_time",
                  "label":"Align start time",
                  "description":"Setting this to true will cause the aggregation range to be aligned based on the sampling size. \" +\n                \"For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. \" +\n                \"The effect of setting this to true is that your data will take the same shape when graphed as you refresh the data. \" +\n                \"Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                  "optional":false,
                  "type":"boolean",
                  "options":[

                  ],
                  "defaultValue":"false",
                  "validations":[

                  ]
               },
               {
                  "name":"sampling",
                  "label":"Sampling",
                  "optional":false,
                  "type":"Object",
                  "properties":[
                     {
                        "name":"value",
                        "label":"Value",
                        "description":"The number of units for the aggregation buckets",
                        "optional":false,
                        "type":"long",
                        "options":[

                        ],
                        "defaultValue":"1",
                        "validations":[
                           {
                              "expression":"value > 0",
                              "type":"js",
                              "message":"Value must be greater than 0."
                           }
                        ]
                     },
                     {
                        "name":"unit",
                        "label":"Unit",
                        "description":"The time unit for the sampling rate",
                        "optional":false,
                        "type":"enum",
                        "options":[
                           "MILLISECONDS",
                           "SECONDS",
                           "MINUTES",
                           "HOURS",
                           "DAYS",
                           "WEEKS",
                           "MONTHS",
                           "YEARS"
                        ],
                        "defaultValue":"MILLISECONDS",
                        "validations":[

                        ]
                     }
                  ]
               }
            ]
         },
         {
            "name":"gaps",
            "label":"Gaps",
            "description":"Marks gaps in data according to sampling rate with a null data point.",
            "properties":[
               {
                  "name":"align_sampling",
                  "label":"Align sampling",
                  "description":"When set to true the time for the aggregated data point for each range will fall\" +\n                \"on the start of the range instead of being the value for the first data point within that range. \" +\n                \"Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                  "optional":false,
                  "type":"boolean",
                  "options":[

                  ],
                  "defaultValue":"true",
                  "validations":[

                  ]
               },
               {
                  "name":"align_start_time",
                  "label":"Align start time",
                  "description":"Setting this to true will cause the aggregation range to be aligned based on the sampling size. \" +\n                \"For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. \" +\n                \"The effect of setting this to true is that your data will take the same shape when graphed as you refresh the data. \" +\n                \"Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                  "optional":false,
                  "type":"boolean",
                  "options":[

                  ],
                  "defaultValue":"false",
                  "validations":[

                  ]
               },
               {
                  "name":"sampling",
                  "label":"Sampling",
                  "optional":false,
                  "type":"Object",
                  "properties":[
                     {
                        "name":"value",
                        "label":"Value",
                        "description":"The number of units for the aggregation buckets",
                        "optional":false,
                        "type":"long",
                        "options":[

                        ],
                        "defaultValue":"1",
                        "validations":[
                           {
                              "expression":"value > 0",
                              "type":"js",
                              "message":"Value must be greater than 0."
                           }
                        ]
                     },
                     {
                        "name":"unit",
                        "label":"Unit",
                        "description":"The time unit for the sampling rate",
                        "optional":false,
                        "type":"enum",
                        "options":[
                           "MILLISECONDS",
                           "SECONDS",
                           "MINUTES",
                           "HOURS",
                           "DAYS",
                           "WEEKS",
                           "MONTHS",
                           "YEARS"
                        ],
                        "defaultValue":"MILLISECONDS",
                        "validations":[

                        ]
                     }
                  ]
               }
            ]
         },
         {
            "name":"last",
            "label":"Last",
            "description":"Returns the last value data point for the time range.",
            "properties":[
               {
                  "name":"align_sampling",
                  "label":"Align sampling",
                  "description":"When set to true the time for the aggregated data point for each range will fall\" +\n                \"on the start of the range instead of being the value for the first data point within that range. \" +\n                \"Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                  "optional":false,
                  "type":"boolean",
                  "options":[

                  ],
                  "defaultValue":"true",
                  "validations":[

                  ]
               },
               {
                  "name":"align_start_time",
                  "label":"Align start time",
                  "description":"Setting this to true will cause the aggregation range to be aligned based on the sampling size. \" +\n                \"For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. \" +\n                \"The effect of setting this to true is that your data will take the same shape when graphed as you refresh the data. \" +\n                \"Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                  "optional":false,
                  "type":"boolean",
                  "options":[

                  ],
                  "defaultValue":"false",
                  "validations":[

                  ]
               },
               {
                  "name":"sampling",
                  "label":"Sampling",
                  "optional":false,
                  "type":"Object",
                  "properties":[
                     {
                        "name":"value",
                        "label":"Value",
                        "description":"The number of units for the aggregation buckets",
                        "optional":false,
                        "type":"long",
                        "options":[

                        ],
                        "defaultValue":"1",
                        "validations":[
                           {
                              "expression":"value > 0",
                              "type":"js",
                              "message":"Value must be greater than 0."
                           }
                        ]
                     },
                     {
                        "name":"unit",
                        "label":"Unit",
                        "description":"The time unit for the sampling rate",
                        "optional":false,
                        "type":"enum",
                        "options":[
                           "MILLISECONDS",
                           "SECONDS",
                           "MINUTES",
                           "HOURS",
                           "DAYS",
                           "WEEKS",
                           "MONTHS",
                           "YEARS"
                        ],
                        "defaultValue":"MILLISECONDS",
                        "validations":[

                        ]
                     }
                  ]
               }
            ]
         },
         {
            "name":"least_squares",
            "label":"Least Squares",
            "description":"Returns a best fit line through the datapoints using the least squares algorithm.",
            "properties":[
               {
                  "name":"align_sampling",
                  "label":"Align sampling",
                  "description":"When set to true the time for the aggregated data point for each range will fall\" +\n                \"on the start of the range instead of being the value for the first data point within that range. \" +\n                \"Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                  "optional":false,
                  "type":"boolean",
                  "options":[

                  ],
                  "defaultValue":"true",
                  "validations":[

                  ]
               },
               {
                  "name":"align_start_time",
                  "label":"Align start time",
                  "description":"Setting this to true will cause the aggregation range to be aligned based on the sampling size. \" +\n                \"For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. \" +\n                \"The effect of setting this to true is that your data will take the same shape when graphed as you refresh the data. \" +\n                \"Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                  "optional":false,
                  "type":"boolean",
                  "options":[

                  ],
                  "defaultValue":"false",
                  "validations":[

                  ]
               },
               {
                  "name":"sampling",
                  "label":"Sampling",
                  "optional":false,
                  "type":"Object",
                  "properties":[
                     {
                        "name":"value",
                        "label":"Value",
                        "description":"The number of units for the aggregation buckets",
                        "optional":false,
                        "type":"long",
                        "options":[

                        ],
                        "defaultValue":"1",
                        "validations":[
                           {
                              "expression":"value > 0",
                              "type":"js",
                              "message":"Value must be greater than 0."
                           }
                        ]
                     },
                     {
                        "name":"unit",
                        "label":"Unit",
                        "description":"The time unit for the sampling rate",
                        "optional":false,
                        "type":"enum",
                        "options":[
                           "MILLISECONDS",
                           "SECONDS",
                           "MINUTES",
                           "HOURS",
                           "DAYS",
                           "WEEKS",
                           "MONTHS",
                           "YEARS"
                        ],
                        "defaultValue":"MILLISECONDS",
                        "validations":[

                        ]
                     }
                  ]
               }
            ]
         },
         {
            "name":"max",
            "label":"Max",
            "description":"Returns the maximum value data point for the time range.",
            "properties":[
               {
                  "name":"align_sampling",
                  "label":"Align sampling",
                  "description":"When set to true the time for the aggregated data point for each range will fall\" +\n                \"on the start of the range instead of being the value for the first data point within that range. \" +\n                \"Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                  "optional":false,
                  "type":"boolean",
                  "options":[

                  ],
                  "defaultValue":"true",
                  "validations":[

                  ]
               },
               {
                  "name":"align_start_time",
                  "label":"Align start time",
                  "description":"Setting this to true will cause the aggregation range to be aligned based on the sampling size. \" +\n                \"For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. \" +\n                \"The effect of setting this to true is that your data will take the same shape when graphed as you refresh the data. \" +\n                \"Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                  "optional":false,
                  "type":"boolean",
                  "options":[

                  ],
                  "defaultValue":"false",
                  "validations":[

                  ]
               },
               {
                  "name":"sampling",
                  "label":"Sampling",
                  "optional":false,
                  "type":"Object",
                  "properties":[
                     {
                        "name":"value",
                        "label":"Value",
                        "description":"The number of units for the aggregation buckets",
                        "optional":false,
                        "type":"long",
                        "options":[

                        ],
                        "defaultValue":"1",
                        "validations":[
                           {
                              "expression":"value > 0",
                              "type":"js",
                              "message":"Value must be greater than 0."
                           }
                        ]
                     },
                     {
                        "name":"unit",
                        "label":"Unit",
                        "description":"The time unit for the sampling rate",
                        "optional":false,
                        "type":"enum",
                        "options":[
                           "MILLISECONDS",
                           "SECONDS",
                           "MINUTES",
                           "HOURS",
                           "DAYS",
                           "WEEKS",
                           "MONTHS",
                           "YEARS"
                        ],
                        "defaultValue":"MILLISECONDS",
                        "validations":[

                        ]
                     }
                  ]
               }
            ]
         },
         {
            "name":"min",
            "label":"Min",
            "description":"Returns the minimum value data point for the time range.",
            "properties":[
               {
                  "name":"align_sampling",
                  "label":"Align sampling",
                  "description":"When set to true the time for the aggregated data point for each range will fall\" +\n                \"on the start of the range instead of being the value for the first data point within that range. \" +\n                \"Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                  "optional":false,
                  "type":"boolean",
                  "options":[

                  ],
                  "defaultValue":"true",
                  "validations":[

                  ]
               },
               {
                  "name":"align_start_time",
                  "label":"Align start time",
                  "description":"Setting this to true will cause the aggregation range to be aligned based on the sampling size. \" +\n                \"For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. \" +\n                \"The effect of setting this to true is that your data will take the same shape when graphed as you refresh the data. \" +\n                \"Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                  "optional":false,
                  "type":"boolean",
                  "options":[

                  ],
                  "defaultValue":"false",
                  "validations":[

                  ]
               },
               {
                  "name":"sampling",
                  "label":"Sampling",
                  "optional":false,
                  "type":"Object",
                  "properties":[
                     {
                        "name":"value",
                        "label":"Value",
                        "description":"The number of units for the aggregation buckets",
                        "optional":false,
                        "type":"long",
                        "options":[

                        ],
                        "defaultValue":"1",
                        "validations":[
                           {
                              "expression":"value > 0",
                              "type":"js",
                              "message":"Value must be greater than 0."
                           }
                        ]
                     },
                     {
                        "name":"unit",
                        "label":"Unit",
                        "description":"The time unit for the sampling rate",
                        "optional":false,
                        "type":"enum",
                        "options":[
                           "MILLISECONDS",
                           "SECONDS",
                           "MINUTES",
                           "HOURS",
                           "DAYS",
                           "WEEKS",
                           "MONTHS",
                           "YEARS"
                        ],
                        "defaultValue":"MILLISECONDS",
                        "validations":[

                        ]
                     }
                  ]
               }
            ]
         },
         {
            "name":"percentile",
            "label":"Percentile",
            "description":"Finds the percentile of the data range.",
            "properties":[
               {
                  "name":"align_sampling",
                  "label":"Align sampling",
                  "description":"When set to true the time for the aggregated data point for each range will fall\" +\n                \"on the start of the range instead of being the value for the first data point within that range. \" +\n                \"Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                  "optional":false,
                  "type":"boolean",
                  "options":[

                  ],
                  "defaultValue":"true",
                  "validations":[

                  ]
               },
               {
                  "name":"align_start_time",
                  "label":"Align start time",
                  "description":"Setting this to true will cause the aggregation range to be aligned based on the sampling size. \" +\n                \"For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. \" +\n                \"The effect of setting this to true is that your data will take the same shape when graphed as you refresh the data. \" +\n                \"Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                  "optional":false,
                  "type":"boolean",
                  "options":[

                  ],
                  "defaultValue":"false",
                  "validations":[

                  ]
               },
               {
                  "name":"percentile",
                  "label":"Percentile",
                  "description":"Data points returned will be in this percentile.",
                  "optional":false,
                  "type":"double",
                  "options":[

                  ],
                  "defaultValue":"10",
                  "validations":[
                     {
                        "expression":"value > 0",
                        "type":"js",
                        "message":"Percentile must be greater than 0."
                     }
                  ]
               },
               {
                  "name":"sampling",
                  "label":"Sampling",
                  "optional":false,
                  "type":"Object",
                  "properties":[
                     {
                        "name":"value",
                        "label":"Value",
                        "description":"The number of units for the aggregation buckets",
                        "optional":false,
                        "type":"long",
                        "options":[

                        ],
                        "defaultValue":"1",
                        "validations":[
                           {
                              "expression":"value > 0",
                              "type":"js",
                              "message":"Value must be greater than 0."
                           }
                        ]
                     },
                     {
                        "name":"unit",
                        "label":"Unit",
                        "description":"The time unit for the sampling rate",
                        "optional":false,
                        "type":"enum",
                        "options":[
                           "MILLISECONDS",
                           "SECONDS",
                           "MINUTES",
                           "HOURS",
                           "DAYS",
                           "WEEKS",
                           "MONTHS",
                           "YEARS"
                        ],
                        "defaultValue":"MILLISECONDS",
                        "validations":[

                        ]
                     }
                  ]
               }
            ]
         },
         {
            "name":"rate",
            "label":"Rate",
            "description":"Computes the rate of change for the data points.",
            "properties":[
               {
                  "name":"sampling",
                  "label":"Sampling",
                  "optional":false,
                  "type":"Object",
                  "properties":[
                     {
                        "name":"value",
                        "label":"Value",
                        "description":"The number of units for the aggregation buckets",
                        "optional":false,
                        "type":"long",
                        "options":[

                        ],
                        "defaultValue":"1",
                        "validations":[
                           {
                              "expression":"value > 0",
                              "type":"js",
                              "message":"Value must be greater than 0."
                           }
                        ]
                     },
                     {
                        "name":"unit",
                        "label":"Unit",
                        "description":"The time unit for the sampling rate",
                        "optional":false,
                        "type":"enum",
                        "options":[
                           "MILLISECONDS",
                           "SECONDS",
                           "MINUTES",
                           "HOURS",
                           "DAYS",
                           "WEEKS",
                           "MONTHS",
                           "YEARS"
                        ],
                        "defaultValue":"MILLISECONDS",
                        "validations":[

                        ]
                     }
                  ]
               }
            ]
         },
         {
            "name":"sma",
            "label":"SMA",
            "description":"Simple moving average.",
            "properties":[
               {
                  "name":"size",
                  "label":"Size",
                  "description":"The period of the moving average. This is the number of data point to use each time the average is calculated.",
                  "optional":false,
                  "type":"int",
                  "options":[

                  ],
                  "defaultValue":"10",
                  "validations":[
                     {
                        "expression":"value > 0",
                        "type":"js",
                        "message":"Size must be greater than 0."
                     }
                  ]
               }
            ]
         },
         {
            "name":"sampler",
            "label":"Sampler",
            "description":"Computes the sampling rate of change for the data points.",
            "properties":[
               {
                  "name":"sampling",
                  "label":"Sampling",
                  "optional":false,
                  "type":"Object",
                  "properties":[
                     {
                        "name":"value",
                        "label":"Value",
                        "description":"The number of units for the aggregation buckets",
                        "optional":false,
                        "type":"long",
                        "options":[

                        ],
                        "defaultValue":"1",
                        "validations":[
                           {
                              "expression":"value > 0",
                              "type":"js",
                              "message":"Value must be greater than 0."
                           }
                        ]
                     },
                     {
                        "name":"unit",
                        "label":"Unit",
                        "description":"The time unit for the sampling rate",
                        "optional":false,
                        "type":"enum",
                        "options":[
                           "MILLISECONDS",
                           "SECONDS",
                           "MINUTES",
                           "HOURS",
                           "DAYS",
                           "WEEKS",
                           "MONTHS",
                           "YEARS"
                        ],
                        "defaultValue":"MILLISECONDS",
                        "validations":[

                        ]
                     }
                  ]
               }
            ]
         },
         {
            "name":"save_as",
            "label":"Save As",
            "description":"Saves the results to a new metric.",
            "properties":[
               {
                  "name":"metricName",
                  "label":"Save As",
                  "description":"The name of the new metric.",
                  "optional":false,
                  "type":"String",
                  "options":[

                  ],
                  "defaultValue":"<new name>",
                  "validations":[
                     {
                        "expression":"!value &&&& value.length > 0",
                        "type":"js",
                        "message":"The name can't be empty."
                     }
                  ]
               }
            ]
         },
         {
            "name":"scale",
            "label":"Scale",
            "description":"Scales each data point by a factor.",
            "properties":[
               {
                  "name":"factor",
                  "label":"Factor",
                  "description":"The value to scale each data point by.",
                  "optional":false,
                  "type":"double",
                  "options":[

                  ],
                  "defaultValue":"0.0",
                  "validations":[
                     {
                        "expression":"value > 0",
                        "type":"js",
                        "message":"Factor must be greater than 0."
                     }
                  ]
               }
            ]
         },
         {
            "name":"sum",
            "label":"Sum",
            "description":"Adds data points together.",
            "properties":[
               {
                  "name":"align_sampling",
                  "label":"Align sampling",
                  "description":"When set to true the time for the aggregated data point for each range will fall\" +\n                \"on the start of the range instead of being the value for the first data point within that range. \" +\n                \"Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                  "optional":false,
                  "type":"boolean",
                  "options":[

                  ],
                  "defaultValue":"true",
                  "validations":[

                  ]
               },
               {
                  "name":"align_start_time",
                  "label":"Align start time",
                  "description":"Setting this to true will cause the aggregation range to be aligned based on the sampling size. \" +\n                \"For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. \" +\n                \"The effect of setting this to true is that your data will take the same shape when graphed as you refresh the data. \" +\n                \"Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                  "optional":false,
                  "type":"boolean",
                  "options":[

                  ],
                  "defaultValue":"false",
                  "validations":[

                  ]
               },
               {
                  "name":"sampling",
                  "label":"Sampling",
                  "optional":false,
                  "type":"Object",
                  "properties":[
                     {
                        "name":"value",
                        "label":"Value",
                        "description":"The number of units for the aggregation buckets",
                        "optional":false,
                        "type":"long",
                        "options":[

                        ],
                        "defaultValue":"1",
                        "validations":[
                           {
                              "expression":"value > 0",
                              "type":"js",
                              "message":"Value must be greater than 0."
                           }
                        ]
                     },
                     {
                        "name":"unit",
                        "label":"Unit",
                        "description":"The time unit for the sampling rate",
                        "optional":false,
                        "type":"enum",
                        "options":[
                           "MILLISECONDS",
                           "SECONDS",
                           "MINUTES",
                           "HOURS",
                           "DAYS",
                           "WEEKS",
                           "MONTHS",
                           "YEARS"
                        ],
                        "defaultValue":"MILLISECONDS",
                        "validations":[

                        ]
                     }
                  ]
               }
            ]
         },
         {
            "name":"trim",
            "label":"Trim",
            "description":"Trims off the first, last or both (first and last) data points from the results.",
            "properties":[
               {
                  "name":"trim",
                  "label":"Trim",
                  "description":"Which data point to trim",
                  "optional":false,
                  "type":"enum",
                  "options":[
                     "FIRST",
                     "LAST",
                     "BOTH"
                  ],
                  "defaultValue":"both",
                  "validations":[

                  ]
               }
            ]
         }
      ]
   }
]


@Injectable()
export class DescriptorService {

    constructor(private queryService: QueryService) { }

    getDescriptorList(): Promise<PsDescriptor[]> {
        return Promise.resolve(descriptorList);
    }
}
