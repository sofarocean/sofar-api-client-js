export class WeatherModelVariable {
    variableID = '';
    variableName = '';
    defaultPhysicalUnit = '';
    dataCategory = '';

    /** @ignore */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(obj: any) {
        Object.assign(this, obj);
    }
}

export class WeatherModel {
    modelID = '';
    description = '';
    dataCategories: string[] = [];
    variables: WeatherModelVariable[] = [];

    /** @ignore */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(obj: any) {
        Object.assign(this, obj);

        if (obj.variables && obj.variables.length != 0) {
            this.variables = obj.variables.map((item: unknown) => {
                return new WeatherModelVariable(item);
            });
        }
    }
}

/**
 * Parameter type to request Marine Weather Model Data Availability.
 */
export type ModelAvailabilityRequest = {
    /**
     * The ID of the model for which you want to retrieve data.
     */
    modelID: string;
    /**
     * The beginning of the requested time frame.
     */
    start?: Date;
    /**
     * The end of the requested time frame. Must be greater or equal to {@link start }. Required if start provided.
     */
    end?: Date;
    /**
     * Can be used to find the nearest timestamp when data is available for the model.
     */
    clostest?: Date;
};

/**
 * Model availability response.
 */
export class ModelAvailability {
    /**
     * Requested model id.
     */
    modelID = '';
    /**
     * Available times.
     */
    outputTimes: Date[] = [];

    /** @ignore */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(obj: any) {
        Object.assign(this, obj);

        /* istanbul ignore next */
        if (obj.outputTimes && obj.outputTimes.length != 0) {
            this.outputTimes = obj.outputTimes.map((item: string) => {
                return new Date(item);
            });
        }
    }
}
