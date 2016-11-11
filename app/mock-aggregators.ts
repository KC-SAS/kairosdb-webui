export const AGGREGATORS: {} = {
    aggregators: [
        {
            structure: {
                name: "sum", //mandatory
                sampling: {
                    property_type: {
                        value: {
                            property_type: "integer",
                            validator: "value>0",
                            label: "Sampling value", 
                            description: "The number of units for the aggregation buckets",
                            default: 1,
                            optional: false
                        },
                        unit: {
                            property_type: "enum",
                            values: ["years", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds"],
                            label: "Sampling unit",
                            description: "The unit for the aggregation buckets",
                            default: "milliseconds",
                            optional: false
                        }
                    },
                    optional: false
                },
                align_sampling: {
                    property_type: "boolean",
                    label: "Align sampling", //mandatory
                    description: "When set to true the time for the aggregated data point for each range will fall" 
                    + "on the start of the range instead of being the value for the first data point within that range. "
                    + "Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                    default: true,
                    optional: true
                },
                align_start_time: {
                    property_type: "boolean",
                    label: "Align start time", //mandatory
                    description: "Setting this to true will cause the aggregation range to be aligned based on the sampling size. "
                    +"For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. "
                    +"The effect of setting this to true is that your data will take the same shape when graphed as you refresh the data. "
                    +"Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                    default: false,
                    optional: true
                }
            },
            metadata: {
                description: "Downsampling aggregator that computes the sum of all datapoint values over the chosen time buckets", //mandatory
                label: "Sum" //mandatory
            },

        },
        {
            structure: {
                name: "avg", //mandatory
                sampling: {
                    property_type: {
                        value: {
                            property_type: "integer",
                            validator: "value>0",
                            label: "Sampling value", 
                            description: "The number of units for the aggregation buckets",
                            default: 1,
                            optional: false
                        },
                        unit: {
                            property_type: "enum",
                            values: ["years", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds"],
                            label: "Sampling unit",
                            description: "The unit for the aggregation buckets",
                            default: "milliseconds",
                            optional: false
                        }
                    },
                    optional: false
                },
                align_sampling: {
                    property_type: "boolean",
                    label: "Align sampling", //mandatory
                    description: "When set to true the time for the aggregated data point for each range will fall" 
                    + "on the start of the range instead of being the value for the first data point within that range. "
                    + "Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                    default: true,
                    optional: true
                },
                align_start_time: {
                    property_type: "boolean",
                    label: "Align start time", //mandatory
                    description: "Setting this to true will cause the aggregation range to be aligned based on the sampling size. "
                    +"For example if your sample size is either milliseconds, seconds, minutes or hours then the start of the range will always be at the top of the hour. "
                    +"The effect of setting this to true is that your data will take the same shape when graphed as you refresh the data. "
                    +"Note that align_sampling and align_start_time are mutually exclusive. If both are set, unexpected results will occur.",
                    default: false,
                    optional: true
                }
            },
            metadata: {
                description: "Downsampling aggregator that computes the average of the datapoint values over the chosen time buckets", //mandatory
                label: "Average" //mandatory
            },
        },
        {
            structure: {
                name: "test", //mandatory
                sampling: {
                    property_type: {
                        value: {
                            property_type: "integer",
                            validator: "value>0",
                            label: "Sampling value", 
                            description: "The number of units for the aggregation buckets",
                            default: 1,
                            optional: false
                        },
                        unit: {
                            property_type: "enum",
                            options: ["years", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds"],
                            label: "Sampling unit",
                            description: "The unit for the aggregation buckets",
                            default: "milliseconds",
                            optional: false
                        }
                    },
                    optional: false
                },
                long_prop: {
                    property_type: "long",
                    label: "Long prop", //mandatory
                    default: true,
                    optional: true
                },
                boolean_prop: {
                    property_type: "boolean",
                    label: "Boolean prop", //mandatory
                    description: "Boolean prop",
                    default: false,
                    optional: true
                },
                text_prop: {
                    property_type: "text",
                    label: "Text prop prop", //mandatory
                    description: "Full line text",
                    default: false,
                    optional: false
                }
            },
            metadata: {
                description: "This is a test aggregator... to do tests !", //mandatory
                label: "Test" //mandatory
            },
        }

    ]
};