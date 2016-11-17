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
                            options: ["years", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds"],
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
                            label: "Integer value", 
                            description: "The number of units for the aggregation buckets",
                            default: 1,
                            optional: false
                        },
                        unit: {
                            property_type: "enum",
                            options: ["years", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds"],
                            label: "Enum value",
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
                            label: "Integer Prop", 
                            description: "The number of units for the aggregation buckets",
                            default: 1,
                            optional: false
                        },
                        unit: {
                            property_type: "enum",
                            options: ["years", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds"],
                            label: "Enum prop",
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
                text_small_prop: {
                    property_type: "text-small",
                    label: "Small text prop", //mandatory
                    description: "25%",
                    default: false,
                    optional: false
                },
                text_prop: {
                    property_type: "text",
                    label: "Regular text prop", //mandatory
                    description: "50%",
                    default: false,
                    optional: false
                },
                text_large_prop: {
                    property_type: "text-large",
                    label: "Large text prop", //mandatory
                    description: "100%",
                    default: false,
                    optional: false
                },
                textarea_prop: {
                    property_type: "textarea",
                    label: "Text area", //mandatory
                    description: "multiline text",
                    default: false,
                    optional: false
                }

            },
            metadata: {
                description: "This is a test aggregator... to do tests !", //mandatory
                label: "Test" //mandatory
            },
        },
        {
            structure: {
                name: "corner_cases", //mandatory
                long_prop_name: {
                    property_type: "long",
                    label: "Very very long property name label hahaha got you didn' anticipate this :-)", //mandatory
                    description: "",
                    default: true,
                    optional: true
                },
                long_desc: {
                    property_type: "long",
                    label: "Long description", //mandatory
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras fringilla nibh et gravida sagittis. Suspendisse ut orci in arcu laoreet ultricies. Suspendisse arcu sapien, commodo id nulla sed, malesuada aliquet lorem. Etiam elementum eleifend viverra. Ut cursus tempor mauris quis faucibus. Sed sollicitudin quis leo eget pretium. Vestibulum molestie neque non ipsum malesuada consequat. Quisque porttitor, nunc in auctor volutpat, nisl lacus consectetur quam, eu pharetra est quam sit amet magna. Donec a auctor ligula. Fusce erat ligula, lobortis id massa rutrum, placerat eleifend leo. Maecenas rhoncus pharetra quam eu mollis. Morbi vitae interdum ex, at feugiat mi. Nullam semper lectus at est dignissim iaculis. Cras gravida turpis augue, eget sollicitudin sapien luctus vel. Nam consectetur lorem sit amet aliquet elementum. Integer sit amet enim pulvinar, ullamcorper lacus ut, rutrum lacus. Nam congue mollis leo id sodales. Mauris et hendrerit enim. Vestibulum consectetur ipsum massa, a vestibulum lorem blandit vitae. Curabitur vehicula quis est dapibus auctor. Duis dolor mauris, convallis sit amet aliquam ac, suscipit eget sapien. Sed commodo sapien sed augue placerat, a pellentesque ante pharetra. Sed quis felis id nibh pharetra laoreet ac id nisl. Pellentesque augue turpis, porta ac arcu vel, pellentesque elementum elit. In bibendum at turpis a condimentum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus suscipit pharetra mauris sit amet ultricies. Curabitur mauris libero, semper eget metus nec, cursus blandit nisl. Aliquam dapibus gravida lorem vel tempor. Ut viverra nisi vel sapien consequat, a dignissim enim facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in ullamcorper diam. Mauris rutrum quam lacus, ac accumsan turpis viverra ut. Mauris risus ex, egestas vitae sollicitudin id, sagittis id odio. Pellentesque suscipit urna maximus, euismod ante ac, finibus nulla. Vivamus eros risus, elementum at neque cursus, auctor mattis ante. Vivamus viverra massa sed dignissim bibendum. Vestibulum placerat ligula eros, vel porttitor urna semper sit amet. ",
                    default: true,
                    optional: true
                }

            },
            metadata: {
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras fringilla nibh et gravida sagittis. Suspendisse ut orci in arcu laoreet ultricies. Suspendisse arcu sapien, commodo id nulla sed, malesuada aliquet lorem. Etiam elementum eleifend viverra. Ut cursus tempor mauris quis faucibus. Sed sollicitudin quis leo eget pretium. Vestibulum molestie neque non ipsum malesuada consequat. Quisque porttitor, nunc in auctor volutpat, nisl lacus consectetur quam, eu pharetra est quam sit amet magna. Donec a auctor ligula. Fusce erat ligula, lobortis id massa rutrum, placerat eleifend leo. Maecenas rhoncus pharetra quam eu mollis. Morbi vitae interdum ex, at feugiat mi. Nullam semper lectus at est dignissim iaculis. Cras gravida turpis augue, eget sollicitudin sapien luctus vel. Nam consectetur lorem sit amet aliquet elementum. Integer sit amet enim pulvinar, ullamcorper lacus ut, rutrum lacus. Nam congue mollis leo id sodales. Mauris et hendrerit enim. Vestibulum consectetur ipsum massa, a vestibulum lorem blandit vitae. Curabitur vehicula quis est dapibus auctor. Duis dolor mauris, convallis sit amet aliquam ac, suscipit eget sapien. Sed commodo sapien sed augue placerat, a pellentesque ante pharetra. Sed quis felis id nibh pharetra laoreet ac id nisl. Pellentesque augue turpis, porta ac arcu vel, pellentesque elementum elit. In bibendum at turpis a condimentum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus suscipit pharetra mauris sit amet ultricies. Curabitur mauris libero, semper eget metus nec, cursus blandit nisl. Aliquam dapibus gravida lorem vel tempor. Ut viverra nisi vel sapien consequat, a dignissim enim facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in ullamcorper diam. Mauris rutrum quam lacus, ac accumsan turpis viverra ut. Mauris risus ex, egestas vitae sollicitudin id, sagittis id odio. Pellentesque suscipit urna maximus, euismod ante ac, finibus nulla. Vivamus eros risus, elementum at neque cursus, auctor mattis ante. Vivamus viverra massa sed dignissim bibendum. Vestibulum placerat ligula eros, vel porttitor urna semper sit amet. ", //mandatory
                label: "Very very long aggregator name label hahaha got you didn' anticipate this :-)" //mandatory
            },
        }

    ]
};