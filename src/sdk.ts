import { MarineWeather } from './weather/marineWeather';
import { WaveSpectra } from './wave/waveSpectra';
import { Spotters } from './spotter/spotters';

/**
 * Primary access point to the SOFAR API SDK.
 *
 */
export class SDK {
    /** @ignore */
    private apiKey: string;
    /** Access the Marine Weather API. */
    readonly marineWeather: MarineWeather;
    /** Access the Wave Spectra API. */
    readonly waveSpectra: WaveSpectra;
    /** Access the Spotter API. */
    readonly spotters: Spotters;

    /** @ignore */
    static baseUrl = 'https://api.sofarocean.com';

    /**
     * Create a new SOFAR API.
     * @param apiKey SOFAR weather dashboard API key.
     */
    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.marineWeather = new MarineWeather(apiKey);
        this.waveSpectra = new WaveSpectra(apiKey);
        this.spotters = new Spotters(apiKey);
    }
}
