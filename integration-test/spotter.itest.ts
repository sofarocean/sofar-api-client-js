import { SDK } from '../src/sdk';
import { config } from './config';

const sdk = new SDK(config.apiKey);

describe('Test spotter interface', () => {
    it('Get a list of spotters', async () => {
        const spotters = await sdk.spotters.getSpotters();
        expect(spotters.length).toBe(1);
        expect(spotters[0].id).toBe('SPOT-0222');
    });

    it('Get a specific spotter', async () => {
        const spotter = await sdk.spotters.getSpotter('SPOT-0222');
        expect(spotter.id).toBe('SPOT-0222');
    });

    it('Get spotter wave data', async () => {
        const spotter = await sdk.spotters.getSpotter('SPOT-0222');
        const waveData = await spotter.getWaveData({ includeWindData: true });
        expect(waveData.spotterId).toBe('SPOT-0222');
        expect(waveData.waves.length).not.toBe(0);
        expect(waveData.wind.length).not.toBe(0);
    });
});
