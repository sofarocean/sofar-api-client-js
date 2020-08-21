import { SDK } from './sdk';

describe('SDK test', () => {
    it('marine weather object is returned', async () => {
        const sdk = new SDK('Foo');
        expect(sdk.marineWeather).not.toBeNull();
    });

    it('wave spectra object is returnned', async () => {
        const sdk = new SDK('Foo');
        expect(sdk.waveSpectra).not.toBeNull();
    });

    it('spotters object is returnned', async () => {
        const sdk = new SDK('Foo');
        expect(sdk.spotters).not.toBeNull();
    });
});
