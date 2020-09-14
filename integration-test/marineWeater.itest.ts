import { SDK } from '../src/sdk';
import { config } from './config';

const sdk = new SDK(config.apiKey);

describe('Test marine weather interface', () => {
    describe('Weater API', () => {
        it('Get point forecast', async () => {
            const pointForecast = await sdk.marineWeather.getPointForecast(
                'SofarOperationalWaveModel',
                -152.0001,
                37.0001,
                ['SofarOperationalWaveModel-significantWaveHeight', 'SofarOperationalWaveModel-meanDirection'],
            );
            expect(pointForecast.modelID).toBe('SofarOperationalWaveModel');
            expect(pointForecast.requestLocation.latitude).toBe(37.0001);
            expect(pointForecast.requestLocation.longitude).toBe(-152.0001);
            expect(pointForecast.forecastVariables.length).toBe(2);
            expect(pointForecast.forecastVariables[0].variableName).toBe('significantWaveHeight');
            expect(pointForecast.forecastVariables[0].values.length).toBeGreaterThan(1);

            expect(pointForecast.forecastVariables[1].variableName).toBe('meanDirection');
            expect(pointForecast.forecastVariables[1].values.length).toBeGreaterThan(1);
        });

        it('Get point hindcast', async () => {
            const pointHindcast = await sdk.marineWeather.getPointHindcast(
                'SofarOperationalWaveModel',
                -152,
                37,
                new Date('2020-07-12T22:00:00Z'),
                new Date('2020-07-12T24:00:00Z'),
                ['SofarOperationalWaveModel-significantWaveHeight', 'SofarOperationalWaveModel-meanDirection'],
            );
            expect(pointHindcast.modelID).toBe('SofarOperationalWaveModel');
            expect(pointHindcast.requestLocation.latitude).toBe(37);
            expect(pointHindcast.requestLocation.longitude).toBe(-152);
            expect(pointHindcast.hindcastVariables.length).toBe(2);

            expect(pointHindcast.hindcastVariables[0].variableName).toBe('significantWaveHeight');
            expect(pointHindcast.hindcastVariables[0].values.length).toBeGreaterThan(1);

            expect(pointHindcast.hindcastVariables[1].variableName).toBe('meanDirection');
            expect(pointHindcast.hindcastVariables[1].values.length).toBeGreaterThan(1);
        }, 10000);
    });

    describe('Metadata API', () => {
        it('Get weather data categories', async () => {
            const data = await sdk.marineWeather.getDataCategories();
            expect(data.length).toBe(4);
            expect(data[0].dataCategoryID).toBe('surfaceWaves');
            expect(data[1].dataCategoryID).toBe('circulation');
            expect(data[2].dataCategoryID).toBe('atmospheric');
            expect(data[3].dataCategoryID).toBe('coralEcosystem');
        });

        it('Get data category metadata', async () => {
            const data = await sdk.marineWeather.getDataCategoryMetadata('coralEcosystem');
            expect(data.providedBy.length).toBeGreaterThan(0);
            expect(data.providedBy[0].modelID).toBe('NOAACoralReefWatch');
        });

        it('Get models', async () => {
            const data = await sdk.marineWeather.getModels();

            expect(data.length).toBe(5);

            expect(data.map((d) => d.modelID)).toEqual([
                'SofarOperationalWaveModel',
                'HYCOM',
                'GFS',
                'NOAAOperationalWaveModel',
                'NOAACoralReefWatch',
            ]);
        });

        it('Get model metadata', async () => {
            const data = await sdk.marineWeather.getModelMetadata('SofarOperationalWaveModel');
            expect(data.modelID).toBe('SofarOperationalWaveModel');
            expect(data.variables.length).toBe(22);
        });

        it('Get weather model data availability', async () => {
            const data = await sdk.marineWeather.getModelAvailability({ modelID: 'SofarOperationalWaveModel' });
            expect(data.modelID).toBe('SofarOperationalWaveModel');
            expect(data.outputTimes.length).toBeGreaterThan(0);
        });
    });
});
