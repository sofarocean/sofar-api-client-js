export class PointLocation {
    latitude = 0;
    longitude = 0;

    /** @ignore */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(obj: any) {
        Object.assign(this, obj);
    }
}

export class PointForecastValue {
    timestamp = new Date();
    value = 0;
    leadTimeHours = 0;

    /** @ignore */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(obj: any) {
        Object.assign(this, obj);
    }
}

export class PointForecastVariable {
    variableID = '';
    variableName = '';
    dataCategory = '';
    physicalUnit = '';
    values: PointForecastValue[] = [];

    /** @ignore */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(obj: any) {
        Object.assign(this, obj);

        if (obj.values && obj.values.length != 0) {
            this.values = obj.values.map((item: unknown) => {
                return new PointForecastValue(item);
            });
        }
    }
}

export class PointForecast {
    modelID = '';
    requestTime: Date = new Date();
    requestLocation: PointLocation = new PointLocation({});
    forecastVariables: PointForecastVariable[] = [];

    /** @ignore */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(obj: any) {
        Object.assign(this, obj);

        if (obj.forecastVariables && obj.forecastVariables.length != 0) {
            this.forecastVariables = obj.forecastVariables.map((item: unknown) => {
                return new PointForecastVariable(item);
            });
        }

        /* istanbul ignore next */
        if (obj.requestLocation) {
            this.requestLocation = new PointLocation(obj.requestLocation);
        }
    }
}
