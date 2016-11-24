export const GROUP_BYS = [
    {
        properties: [
            {
                name: "tags",
                property_type: "array",
                element_type: "string",
                autocomplete: "tag_name",
                label: "Tag names",
                description: "List of tags used by the grouping",
                validations: [],
                optional: false
            }
        ],
        validations: [],
        name: "tag",
        description: "Groups datapoints into bins according to their value. This aggregator can slow down queries.",
        label: "Tag"
    },
    {
        properties: [
            {
                name: "range_size",
                property_type: "object",
                validations: [],
                optional: false,
                properties: [
                    {
                        name: "value",
                        property_type: "integer",
                        validations: [{ validator: "value>0", message: "should be positive", type: "js" }],
                        label: "Target size value",
                        description: "The number of units for the aggregation buckets",
                        default: 1,
                        optional: false
                    },
                    {
                        name: "unit",
                        property_type: "enum",
                        options: ["years", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds"],
                        label: "Target size unit",
                        validations: [],
                        description: "The unit for the aggregation buckets",
                        default: "milliseconds",
                        optional: false
                    }
                ]
            },
            {
                name: "group_count",
                property_type: "integer",
                label: "Count",
                description: "Number of different groups",
                validations: [],
                optional: false
            }
        ],
        validations: [],
        name: "time",
        description: "Groups datapoints into the given number of time bucket. This aggregator can slow down queries.",
        label: "Time"
    },
    {
        properties: [
            {
                name: "range_size",
                property_type: "integer",
                label: "Target Size",
                description: "Integer size of the buckets",
                validations: [],
                optional: false
            }
        ],
        validations: [],
        name: "value",
        description: "Groups datapoints into buckets according to their value. This aggregator can slow down queries.",
        label: "Value"
    },
    {
        properties: [
            {
                name: "bins",
                property_type: "array",
                element_type: "double",
                label: "Bin values",
                description: "Float values that delimitate bins",
                validations: [],
                optional: false
            }
        ],
        validations: [],
        name: "bin",
        description: "Groups datapoints into bins according to their value. This aggregator can slow down queries.",
        label: "Bin"
    }
];