import { SpotterWaveDataRequest, SpotterWaveData } from './spotterWaveData';
import superagent from 'superagent';
import { SDK } from '../sdk';

export class Spotter {
    /** Spotter ID */
    id = '';
    /** Spotter name */
    name = '';
    /** @ignore */ _apiKey = '';

    /** @ignore */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(obj: any, apiKey: string) {
        /* istanbul ignore next */
        if (obj.spotterId) {
            this.id = obj.spotterId;
        }
        /* istanbul ignore next */
        if (obj.name) {
            this.name = obj.name;
        }

        this._apiKey = apiKey;
    }

    /**
     * Returns surface data for this spotter.
     *
     * A maximum of 500 samples may be retrieved in a single request (100 if includeFrequencyData==true).
     * Frequency data is only available for samples collected from Spotters in Full Waves Mode.
     *
     * @param params Parameters to retrieve {@link SpotterWaveDataRequest|wave data}
     */
    getWaveData(
        params: Partial<SpotterWaveDataRequest> = {
            includeWindData: false,
            includeDirectionalMoments: false,
            includeFrequencyData: false,
            startDate: undefined,
            endDate: undefined,
            limit: 20,
        },
    ): Promise<SpotterWaveData> {
        return new Promise<SpotterWaveData>((resolve, reject) => {
            superagent //
                .get(`${SDK.baseUrl}/api/wave-data`)
                .set('token', this._apiKey)
                .query({ ...params, spotterId: this.id })
                .then((response) => {
                    /* istanbul ignore next */
                    if (response.body && response.body.data) {
                        const res = new SpotterWaveData(response.body.data);
                        resolve(res);
                    } else {
                        /* istanbul ignore next */
                        resolve(new SpotterWaveData({}));
                    }
                })
                .catch((err: Error) => {
                    reject(err);
                });
        });
    }
}
