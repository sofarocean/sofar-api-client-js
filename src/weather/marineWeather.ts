import { WeatherModel, ModelAvailabilityRequest, ModelAvailability } from './weatherModel';
import superagent from 'superagent';
import { SDK } from '../sdk';
import { DataCategory } from './dataCategory';
import { PointForecast } from './pointForecast';
import { PointHindcast } from './pointHindcast';

/**
 * Gives access to our advanced Marine Weather data.
 */
export class MarineWeather {
    /** @ignore */
    private apiKey: string;
    /** @ignore */
    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    /**
     * Returns a list of all available forecast models that you are authorized to access.
     */
    async getModels(): Promise<WeatherModel[]> {
        return new Promise<WeatherModel[]>(async (resolve, reject) => {
            superagent //
                .get(`${SDK.baseUrl}/marine-weather/v1/models`)
                .query({ token: this.apiKey })
                .then((response) => {
                    if (response.body && response.body.models) {
                        const res = response.body.models.map((item: unknown) => {
                            return new WeatherModel(item);
                        });
                        resolve(res);
                    } else {
                        const res: WeatherModel[] = [];
                        resolve(res);
                    }
                })
                .catch((err: Error) => {
                    reject(err);
                });
        });
    }

    /**
     * Returns metadata about a single weather model, including a list of variables and data categories that the model outputs.
     *
     * @param modelId The ID of the model for which you want to retrieve metadata.
     */
    async getModelMetadata(modelId: string): Promise<WeatherModel> {
        return new Promise<WeatherModel>(async (resolve, reject) => {
            superagent //
                .get(`${SDK.baseUrl}/marine-weather/v1/models/${modelId}`)
                .query({ token: this.apiKey })
                .then((response) => {
                    const res = new WeatherModel(response.body);
                    resolve(res);
                })
                .catch((err: Error) => {
                    reject(err);
                });
        });
    }

    async getModelAvailability(
        /* istanbul ignore next */
        params: Partial<ModelAvailabilityRequest> = {
            start: undefined,
            end: undefined,
            clostest: undefined,
        },
    ): Promise<ModelAvailability> {
        return new Promise<ModelAvailability>(async (resolve, reject) => {
            superagent //
                .get(`${SDK.baseUrl}/marine-weather/v1/models/${params.modelID}/outputTimes`)
                .query({ ...params, token: this.apiKey })
                .then((response) => {
                    resolve(new ModelAvailability(response.body));
                })
                .catch((err: Error) => {
                    reject(err);
                });
        });
    }

    /**
     * Retrieve a list of all available categories of data and the model and variable IDs that provide data for each.
     */
    async getDataCategories(): Promise<DataCategory[]> {
        return new Promise<DataCategory[]>(async (resolve, reject) => {
            superagent //
                .get(`${SDK.baseUrl}/marine-weather/v1/data-categories`)
                .query({ token: this.apiKey })
                .then((response) => {
                    if (response.body && response.body.dataCategories) {
                        const res = response.body.dataCategories.map((item: unknown) => {
                            return new DataCategory(item);
                        });
                        resolve(res);
                    } else {
                        const res: DataCategory[] = [];
                        resolve(res);
                    }
                })
                .catch((err: Error) => {
                    reject(err);
                });
        });
    }

    /**
     * Retrieve the model and variable IDs that provide data for the specified data category.
     *
     * @param categoryId The ID of the data category for which you want to retrieve metadata.
     */
    async getDataCategoryMetadata(categoryId: string): Promise<DataCategory> {
        return new Promise<DataCategory>(async (resolve, reject) => {
            superagent //
                .get(`${SDK.baseUrl}/marine-weather/v1/data-categories/${categoryId}`)
                .query({ token: this.apiKey })
                .then((response) => {
                    const res = new DataCategory(response.body);
                    resolve(res);
                })
                .catch((err: Error) => {
                    reject(err);
                });
        });
    }

    /**
     * Returns forecast data from the specified model at a single latitude and longitude point for the next 7 days.
     *
     * Variables and model IDs used as parameters in the endpoint can be queried from {@link getModels} and {@link getModelMetadata}.
     *
     * @param modelId The ID off the model you want to get the forceast data.
     * @param longitude The longitude of the requested forecast point. Can be positive or negative.
     * @param latitude The latitude of the requested forecast point. Must be between -90 and 90 degrees.
     * @param variableIDs An array of strings containing variable IDs which you want to retrieve as part of the forecast data.
     */
    async getPointForecast(
        modelId: string,
        longitude: number,
        latitude: number,
        variableIDs: string[],
    ): Promise<PointForecast> {
        return new Promise<PointForecast>(async (resolve, reject) => {
            if (modelId.trim().length === 0) {
                return reject(new Error('A modelId has to be specified!'));
            }
            if (variableIDs.length === 0) {
                return reject(new Error('At least one variableID must be specified!'));
            }
            superagent //
                .get(`${SDK.baseUrl}/marine-weather/v1/models/${modelId}/forecast/point`)
                .query({
                    //
                    longitude: longitude,
                    latitude: latitude,
                    variableIDs: variableIDs,
                    token: this.apiKey,
                })
                .then((response) => {
                    resolve(new PointForecast(response.body));
                })
                .catch((err: Error) => {
                    reject(err);
                });
        });
    }

    /**
     * Returns hindcast data from the specified model at a single latitude and longitude point within a given timeframe.
     *
     * @param modelId The ID of the model from which you want to retrieve hindcast data
     * @param longitude The longitude of the requested hindcast point. Can be positive or negative.
     * @param latitude The latitude of the requested hindcast point. Must be between -90 and 90 degrees.
     * @param start The beginning of the requested time frame.
     * @param end The end of the requested time frame.
     * @param variableIDs An array of strings containing variable IDs which you want to retrieve as part of the hindcast data.
     */
    async getPointHindcast(
        modelId: string,
        longitude: number,
        latitude: number,
        start: Date,
        end: Date,
        variableIDs: string[],
    ): Promise<PointHindcast> {
        const startString = start.toISOString();
        const endString = end.toISOString();
        return new Promise<PointHindcast>(async (resolve, reject) => {
            if (modelId.trim().length === 0) {
                return reject(new Error('A modelId has to be specified!'));
            }
            if (variableIDs.length === 0) {
                return reject(new Error('At least one variableID must be specified!'));
            }
            superagent //
                .get(`${SDK.baseUrl}/marine-weather/v1/models/${modelId}/hindcast/point`)
                .query({
                    //
                    longitude: longitude,
                    latitude: latitude,
                    variableIDs: variableIDs,
                    start: `${startString}`,
                    end: `${endString}`,
                    token: this.apiKey,
                })
                .then((response) => {
                    resolve(new PointHindcast(response.body));
                })
                .catch((err: Error) => {
                    reject(err);
                });
        });
    }
}
