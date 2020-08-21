import { Spotter } from './spotter';
import superagent from 'superagent';
import { SDK } from '../sdk';
import { isNullOrUndefined } from 'util';

/**
 * The Spotter Sensor API provides access to real-time weather and surface data collected by Spotter devices.
 */
export class Spotters {
    /** @ignore */
    constructor(/** @ignore */ private readonly apiKey: string) {
        this.apiKey = apiKey;
    }

    /**
     * Retrieve a list of Spotters you have API access to, including Spotter ID and nickname.
     *
     * @param exludeSharedDevices Set true to only return devices you own. @default false
     * @returns A list of {@link Spotter|Spotters}
     */
    async getSpotters(exludeSharedDevices = false): Promise<Spotter[]> {
        return new Promise<Spotter[]>((resolve, reject) => {
            superagent //
                .get(`${SDK.baseUrl}/api/devices`)
                .set('token', this.apiKey)
                .query({ exludeSharedDevices: exludeSharedDevices })
                .then((response) => {
                    if (response.body && response.body.data && response.body.data.devices) {
                        const res = response.body.data.devices.map((item: unknown) => {
                            return new Spotter(item, this.apiKey);
                        });
                        resolve(res);
                    } else {
                        const res: Spotter[] = [];
                        resolve(res);
                    }
                })
                .catch((err: Error) => {
                    reject(err);
                });
        });
    }

    /**
     * Retrieves a specific spotter based on the ID.
     * @param spotterId the spotter ID to retrieve.
     *
     * @returns A {@link Spotter} if the spotter was found or rejects the promise with an error.
     */
    async getSpotter(spotterId: string): Promise<Spotter> {
        return new Promise<Spotter>(async (resolve, reject) => {
            const spotters = await this.getSpotters(true);
            const spotter = spotters.find((item) => item.id == spotterId);
            if (!isNullOrUndefined(spotter)) {
                resolve(spotter);
            } else {
                reject(new Error(`No spotter with id ${spotterId} found.`));
            }
        });
    }
}
