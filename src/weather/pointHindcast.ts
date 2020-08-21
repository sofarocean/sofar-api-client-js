import { PointLocation } from './pointForecast';

export class PointHindcastValue {
    timestamp = new Date();
    value = 0;

    /** @ignore */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(obj: any) {
        Object.assign(this, obj);
    }
}

export class PointHindcastVariable {
    variableID = '';
    variableName = '';
    dataCategory = '';
    physicalUnit = '';
    values: PointHindcastValue[] = [];

    /** @ignore */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(obj: any) {
        Object.assign(this, obj);

        if (obj.values && obj.values.length != 0) {
            this.values = obj.values.map((item: unknown) => {
                return new PointHindcastValue(item);
            });
        }
    }
}

export class PointHindcast {
    modelID = '';
    requestTime: Date = new Date();
    requestStart: Date = new Date();
    requestEnd: Date = new Date();
    requestLocation: PointLocation = new PointLocation({});

    hindcastVariables: PointHindcastVariable[] = [];

    /** @ignore */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(obj: any) {
        Object.assign(this, obj);

        if (obj.hindcastVariables && obj.hindcastVariables.length != 0) {
            this.hindcastVariables = obj.hindcastVariables.map((item: unknown) => {
                return new PointHindcastVariable(item);
            });
        }

        /* istanbul ignore next */
        if (obj.requestLocation) {
            this.requestLocation = new PointLocation(obj.requestLocation);
        }
    }
}
