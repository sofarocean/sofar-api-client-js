import { MarineWeather } from './marineWeather';
import { getModels, getModelMetadata } from './weatherTestSuport';
import superagent from 'superagent';
import mockSuperagent from 'superagent-mock';
import { SDK } from '../sdk';
import { WeatherModel, WeatherModelVariable } from './weatherModel';

const apiKey = 'key';

describe('Marine Weather Model test', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let superagentMock: any;
    let marineWeather: MarineWeather;

    afterAll(async (done) => {
        superagentMock.unset();
        done();
    });

    describe('Models API', () => {
        const expectedResult = getModels();

        const getMock = (result: object): object => {
            return mockSuperagent(superagent, [
                {
                    pattern: `${SDK.baseUrl}/marine-weather/v1/models(.*)`,
                    fixtures: (_match: any, params: unknown, headers: Record<string, unknown>): unknown => {
                        const query = _match[1] as string;
                        if (!query.includes(`token=${apiKey}`)) {
                            throw new Error('403');
                        }
                        return result;
                    },
                    get: (_match: unknown, data: unknown): unknown => ({ body: data }),
                },
            ]);
        };

        describe('With no models', () => {
            beforeAll(() => {
                superagentMock = getMock({ foo: 'bar' });
                marineWeather = new MarineWeather(apiKey);
            });

            it('should handle gracefully', async () => {
                await expect(marineWeather.getModels()).resolves.not.toBeNull();
                const data = await marineWeather.getModels();
                expect(data.length).toBe(0);
            });
        });

        describe('With valid model data', () => {
            beforeAll(() => {
                superagentMock = getMock(expectedResult);
                marineWeather = new MarineWeather(apiKey);
            });
            describe('With invalid authentication', () => {
                beforeEach(() => {
                    marineWeather = new MarineWeather('--INVALID---');
                });
                it('should throw an error', async () => {
                    await expect(marineWeather.getModels()).rejects.toThrow();
                });
            });

            describe('With proper authentication', () => {
                beforeEach(() => {
                    marineWeather = new MarineWeather(apiKey);
                });

                it('should return the expeted result', async (done) => {
                    await expect(marineWeather.getModels()).resolves.not.toBeNull();
                    const data = await marineWeather.getModels();
                    expect(data.length).toBe(3);
                    expect(data).toBeInstanceOf(Array);
                    expect(data[0]).toBeInstanceOf(WeatherModel);

                    expect(data[0].modelID).toBe('SofarWaveWatch3');
                    expect(data[0].dataCategories).toEqual(['surfaceWaves', 'surfaceWind']);

                    expect(data[0].variables.length).toBe(3);
                    expect(data[0].variables[0]).toBeInstanceOf(WeatherModelVariable);
                    expect(data[0].variables[2].variableID).toBe(
                        'SofarWaveWatch3-Mean_wave_direction_of_third_swell_partition',
                    );
                    done();
                });
            });
        });
    });

    // Model Metadata
    describe('Weather Model Metadata API', () => {
        const expectedResult = getModelMetadata();

        const getMock = (result: object): object => {
            return mockSuperagent(superagent, [
                {
                    pattern: `${SDK.baseUrl}/marine-weather/v1/models/(.*)`,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    fixtures: (match: any, params: unknown, headers: Record<string, unknown>): unknown => {
                        const query = match[1] as string;
                        if (!query.includes(`token=${apiKey}`)) {
                            throw new Error('403');
                        }
                        if (match[1].includes('SofarWaveWatch3')) {
                            return result;
                        } else {
                            throw new Error('404');
                        }
                    },
                    get: (_match: unknown, data: unknown): unknown => ({ body: data }),
                },
            ]);
        };

        describe('With valid model data', () => {
            beforeAll(() => {
                superagentMock = getMock(expectedResult);
            });
            describe('With invalid authentication', () => {
                beforeEach(() => {
                    marineWeather = new MarineWeather('--INVALID---');
                });
                it('should throw an error', async () => {
                    await expect(marineWeather.getModelMetadata('SofarWaveWatch3')).rejects.toThrow();
                });
            });

            describe('Invalid ModelID', () => {
                beforeEach(() => {
                    marineWeather = new MarineWeather(apiKey);
                });

                it('Should return an error', async () => {
                    await expect(marineWeather.getModelMetadata('invalid')).rejects.toThrowError('404');
                });
            });

            describe('With proper authentication', () => {
                beforeEach(() => {
                    marineWeather = new MarineWeather(apiKey);
                });

                it('should return the expeted result', async (done) => {
                    await expect(marineWeather.getModelMetadata('SofarWaveWatch3')).resolves.not.toBeNull();
                    const data = await marineWeather.getModelMetadata('SofarWaveWatch3');
                    expect(data).toBeInstanceOf(WeatherModel);

                    expect(data.modelID).toBe('SofarWaveWatch3');
                    expect(data.dataCategories).toEqual(['surfaceWaves', 'surfaceWind']);

                    expect(data.variables.length).toBe(3);
                    expect(data.variables[0]).toBeInstanceOf(WeatherModelVariable);
                    expect(data.variables[2].variableID).toBe(
                        'SofarWaveWatch3-Mean_wave_direction_of_third_swell_partition',
                    );
                    done();
                });
            });
        });
    });
});
