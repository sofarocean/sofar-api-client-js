import superagent from 'superagent';
import { SDK } from '../sdk';
import * as fs from 'fs';

export class WaveSpectraData {
    constructor(
        readonly latitude: number,
        readonly longitude: number,
        readonly url: string,
        /** @ignore */
        private readonly apiKey: string,
    ) {}

    /** @ignore */
    static create(params: { latitude: number; longitude: number; url: string; apiKey: string }): WaveSpectraData {
        return new WaveSpectraData(params.latitude, params.longitude, params.url, params.apiKey);
    }

    /** Download the given spectra data. */
    download(fileName: string): Promise<void> {
        const wstream = fs.createWriteStream(fileName);
        return new Promise<void>((resolve, reject) => {
            superagent //
                .get(`${this.url}`)
                .set('token', this.apiKey)
                .pipe(wstream)
                .on('finish', () => {
                    wstream.close();
                    /* istanbul ignore next */
                    resolve();
                })
                .on('error', (err) => {
                    /* istanbul ignore next */
                    reject(err);
                });
        });
    }
}

/**
 * The Wave Spectra API provides full spectra 7-day forecast from the Sofar Operational WaveWatch III Model.
 */
export class WaveSpectra {
    /** @ignore */
    private apiKey: string;
    /** @ignore */
    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    /**
     * Return a {@link WaveSpectraData} object with the requested lat/long.
     * @param params Latitude/Longitude of the location requested. Must be 0.5º resolution
     */
    async getWaveSpectraForecast(params: { latitude: number; longitude: number }): Promise<WaveSpectraData> {
        const latLong = `${params.latitude}/${params.longitude}`;
        const url = `${SDK.baseUrl}/api/op-wave-spectra/${latLong}`;

        return new Promise<WaveSpectraData>((resolve) => {
            resolve(new WaveSpectraData(params.latitude, params.longitude, url, this.apiKey));
        });
    }

    /**
     * This endpoint returns a list of locations you have access to, or retrieves NetCDF data for a target location.
     */
    async getWaveSpectraForecasts(): Promise<WaveSpectraData[]> {
        const url = `${SDK.baseUrl}/api/op-wave-spectra/`;
        return new Promise<WaveSpectraData[]>((resolve, reject) => {
            superagent //
                .get(url)
                .set('token', this.apiKey)
                .then((response) => {
                    if (response.body && response.body.status !== 'success') {
                        reject(new Error(`Retrieval of data failed! Status was '${response.body.status}'.`));
                    }
                    if (response.body.status == 'success') {
                        resolve(
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            response.body.data.map((item: any) => {
                                return WaveSpectraData.create({ apiKey: this.apiKey, ...item });
                            }),
                        );
                    }
                })
                .catch((err: Error) => {
                    reject(err);
                });
        });
    }
}
