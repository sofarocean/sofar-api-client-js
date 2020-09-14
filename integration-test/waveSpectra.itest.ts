import { SDK } from '../src/sdk';
import { config } from './config';
import * as fs from 'fs';

const sdk = new SDK(config.apiKey);

describe('Test wave spectra interface', () => {
    it('Download wave spectra file', async () => {
        const spectra = await sdk.waveSpectra.getWaveSpectraForecast({ latitude: 34.5, longitude: 200 });
        const fileName = `${spectra.latitude}_${spectra.longitude}.netcdf`;
        console.log(`Downloading WaveSpectra ${fileName}...`);
        try {
            await spectra.download(fileName);
            expect(fs.existsSync(fileName)).toBeTruthy();
        } finally {
            fs.unlinkSync(fileName);
        }
    });
});
