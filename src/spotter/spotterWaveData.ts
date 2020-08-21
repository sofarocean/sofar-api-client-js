/**
 * Parameter type to request spotter wave data.
 */
export type SpotterWaveDataRequest = {
    /**
     * Include derived wind speed and direction in response.
     * @default false
     */
    includeWindData: boolean;
    /**
     * Include spectrally binned directional moments.
     * Only applies if Spotter is in *Full Waves Mode*.
     * @default false
     */
    includeDirectionalMoments: boolean;
    /**
     * Include spectrally binned surface variance, direction, and directional spreading.
     * Only applies for samples collected in *Full Waves Mode*.
     * @default false
     */
    includeFrequencyData: boolean;
    /**
     * Timestamp for start of data range.
     * @default null
     */
    startDate?: Date;
    /**
     * Timestamp for end of data range.
     * @default now()
     */
    endDate?: Date;
    /**
     * Maximum number of samples to retrieve in request.
     */
    limit: number;
};

export type SpotterWave = {
    /** Unit: meters. */
    significantWaveHeight: number;
    /** Unit: seconds */
    peakPeriod: number;
    /** Unit: seconds */
    meanPeriod: number;
    /** Unit: degrees */
    peakDirection: number;
    peakDirectionalSpread: number;
    /** Unit: degrees */
    meanDirection: number;
    meanDirectionalSpread: number;
    timestamp: Date;
    /** Unit: decimal degrees */
    latitude: number;
    /** Unit: decimal degrees */
    longitude: number;
};

export type SpotterWind = {
    speed: number;
    /** Unit: degrees */
    direction: number;
    seasurfaceId: number;
    timestamp: Date;
    /** Unit: decimal degrees */
    latitude: number;
    /** Unit: decimal degrees */
    longitude: number;
};

/**
 * For more information on data collected by Spotter, see the product documentation.
 * https://www.sofarocean.com/posts/spotter-product-documentation
 */
export class SpotterWaveData {
    spotterId = '';
    /** Maximum number of samples to retrieve in request.
     *  @default 20
     *  Max: 500
     *  Max: 100 if frequencyData included.
     */
    limit = 0;
    waves: SpotterWave[] = [];
    wind: SpotterWind[] = [];

    /** @ignore */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(obj: any) {
        Object.assign(this, obj);

        /* istanbul ignore next */
        if (obj.waves && obj.waves.length != 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.waves = obj.waves.map((item: any) => {
                const wave: SpotterWave = { ...item };
                Object.assign(wave, item);
                return wave;
            });
        }

        /* istanbul ignore next */
        if (obj.wind && obj.wind.length != 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.wind = obj.wind.map((item: any) => {
                const wind: SpotterWind = { ...item };
                Object.assign(wind, item);
                return wind;
            });
        }
    }
}