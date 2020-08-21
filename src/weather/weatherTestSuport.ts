export function getModels(): object {
    return {
        models: [
            {
                modelID: 'SofarWaveWatch3',
                description: 'Sofar Operational Wave Forecast',
                dataCategories: ['surfaceWaves', 'surfaceWind'],
                variables: [
                    {
                        variableID: 'SofarWaveWatch3-significantWaveHeight',
                        variableName: 'significantWaveHeight',
                        defaultPhysicalUnit: 'm',
                        dataCategory: 'surfaceWaves',
                    },
                    {
                        variableID: 'SofarWaveWatch3-meanWaveDirection',
                        variableName: 'meanWaveDirection',
                        defaultPhysicalUnit: 'degree',
                        dataCategory: 'surfaceWaves',
                    },
                    {
                        variableID: 'SofarWaveWatch3-Mean_wave_direction_of_third_swell_partition',
                        variableName: 'Mean_wave_direction_of_third_swell_partition',
                        defaultPhysicalUnit: 'degree',
                        dataCategory: 'surfaceWaves',
                    },
                ],
            },
            {
                modelID: 'GFS',
                description: 'NOAA Global Forecast System',
                dataCategories: ['surfaceWind'],
                variables: [
                    {
                        variableID: 'GFS-10_meter_wind_component',
                        variableName: '10_meter_wind_component',
                        defaultPhysicalUnit: 'm/s_eastingnorthing',
                        dataCategory: 'surfaceWind',
                    },
                ],
            },
            {
                modelID: 'EMPTY',
                description: 'EmptyVar',
                dataCategories: [],
                variables: [],
            },
        ],
    };
}

export function getModelMetadata(): object {
    return {
        modelID: 'SofarWaveWatch3',
        description: 'Sofar Operational Wave Forecast',
        dataCategories: ['surfaceWaves', 'surfaceWind'],
        variables: [
            {
                variableID: 'SofarWaveWatch3-significantWaveHeight',
                variableName: 'significantWaveHeight',
                defaultPhysicalUnit: 'm',
                dataCategory: 'surfaceWaves',
            },
            {
                variableID: 'SofarWaveWatch3-meanWaveDirection',
                variableName: 'meanWaveDirection',
                defaultPhysicalUnit: 'degree',
                dataCategory: 'surfaceWaves',
            },
            {
                variableID: 'SofarWaveWatch3-Mean_wave_direction_of_third_swell_partition',
                variableName: 'Mean_wave_direction_of_third_swell_partition',
                defaultPhysicalUnit: 'degree',
                dataCategory: 'surfaceWaves',
            },
        ],
    };
}

export function getCategories(): object {
    return {
        dataCategories: [
            {
                dataCategoryID: 'surfaceWaves',
                providedBy: [
                    {
                        modelID: 'SofarOperationalWaveModel',
                        variableIDs: [
                            'SofarOperationalWaveModel-significantWaveHeight',
                            'SofarOperationalWaveModel-meanDirection',
                            'SofarOperationalWaveModel-meanPeriod',
                        ],
                    },
                    {
                        modelID: 'NOAAOperationalWaveModel',
                        variableIDs: [
                            'NOAAOperationalWaveModel-significantWaveHeight',
                            'NOAAOperationalWaveModel-peakPeriod',
                            'NOAAOperationalWaveModel-primaryWaveDirection',
                        ],
                    },
                ],
            },
            {
                dataCategoryID: 'circulation',
                providedBy: [
                    {
                        modelID: 'HYCOM',
                        variableIDs: [
                            'HYCOM-seaSurfaceTemperature',
                            'HYCOM-surfaceCurrentVelocityEastward',
                            'HYCOM-surfaceCurrentVelocityNorthward',
                        ],
                    },
                ],
            },
            {
                dataCategoryID: 'empty',
                providedBy: [],
            },
        ],
    };
}

export function getCategoryMetadata(): object {
    return {
        dataCategoryID: 'surfaceWaves',
        providedBy: [
            {
                modelID: 'SofarOperationalWaveModel',
                variableIDs: [
                    'SofarOperationalWaveModel-significantWaveHeight',
                    'SofarOperationalWaveModel-meanDirection',
                    'SofarOperationalWaveModel-meanPeriod',
                ],
            },
            {
                modelID: 'NOAAOperationalWaveModel',
                variableIDs: [
                    'NOAAOperationalWaveModel-significantWaveHeight',
                    'NOAAOperationalWaveModel-peakPeriod',
                    'NOAAOperationalWaveModel-primaryWaveDirection',
                ],
            },
        ],
    };
}

export function getForecastPoint(): object {
    return {
        modelID: 'SofarOperationalWaveModel',
        requestTime: '2020-03-07T00:08:17.965Z',
        requestLocation: {
            latitude: 37.0001,
            longitude: -152.0001,
        },
        forecastVariables: [
            {
                variableID: 'SofarOperationalWaveModel-significantWaveHeight',
                variableName: 'significantWaveHeight',
                dataCategory: 'surfaceWaves',
                physicalUnit: 'm',
                values: [
                    {
                        timestamp: '2020-03-07T00:00:00.000Z',
                        value: 3.28,
                        leadTimeHours: 6,
                    },
                    {
                        timestamp: '2020-03-07T01:00:00.000Z',
                        value: 3.23,
                        leadTimeHours: 7,
                    },
                    {
                        timestamp: '2020-03-07T02:00:00.000Z',
                        value: 3.1799998,
                        leadTimeHours: 8,
                    },
                ],
            },
            {
                variableID: 'test',
                variableName: 'test',
                dataCategory: 'test',
                physicalUnit: 't',
                values: [],
            },
        ],
    };
}

export function getHindcastPoint(): object {
    return {
        modelID: 'SofarOperationalWaveModel',
        requestTime: '2020-03-07T00:08:17.965Z',
        requestStart: '2020-01-01T22:00:00.000Z',
        requestEnd: '2020-06-01T00:00:00.000Z',
        requestLocation: {
            latitude: 37.0001,
            longitude: -152.0001,
        },
        hindcastVariables: [
            {
                variableID: 'SofarOperationalWaveModel-significantWaveHeight',
                variableName: 'significantWaveHeight',
                dataCategory: 'surfaceWaves',
                physicalUnit: 'm',
                values: [
                    {
                        timestamp: '2020-03-07T00:00:00.000Z',
                        value: 3.28,
                    },
                    {
                        timestamp: '2020-03-07T01:00:00.000Z',
                        value: 3.23,
                    },
                    {
                        timestamp: '2020-03-07T02:00:00.000Z',
                        value: 3.1799998,
                    },
                ],
            },
            {
                variableID: 'test',
                variableName: 'test',
                dataCategory: 'test',
                physicalUnit: 't',
                values: [],
            },
        ],
    };
}

export function getEmptyForecastPoint(): object {
    return {
        modelID: 'SofarOperationalWaveModel',
        requestTime: '2020-03-07T00:08:17.965Z',
        requestLocation: {
            latitude: 37.0001,
            longitude: -152.0001,
        },
        forecastVariables: [],
    };
}

export function getEmptyHindcastPoint(): object {
    return {
        modelID: 'SofarOperationalWaveModel',
        requestTime: '2020-03-07T00:08:17.965Z',
        requestStart: '2020-01-01T22:00:00.000Z',
        requestEnd: '2020-06-01T00:00:00.000Z',
        requestLocation: {
            latitude: 37.0001,
            longitude: -152.0001,
        },
        hindcastVariables: [],
    };
}
