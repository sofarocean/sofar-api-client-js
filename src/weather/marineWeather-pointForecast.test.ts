import { MarineWeather } from './marineWeather';
import { getForecastPoint, getEmptyForecastPoint } from './weatherTestSuport';
import superagent from 'superagent';
import mockSuperagent from 'superagent-mock';
import { SDK } from '../sdk';

const apiKey = 'key';

describe('Marine Weather Point Forecast test', () => {
    describe('Point forecast API', () => {
        const expectedResult = getForecastPoint();

        const getMock = (result: object): object => {
            return mockSuperagent(superagent, [
                {
                    pattern: `${SDK.baseUrl}/marine-weather/v1/models/(.*)/forecast/point(.*)`,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    fixtures: (match: any, params: unknown, headers: Record<string, unknown>): unknown => {
                        const query = match[2] as string;
                        if (!query.includes(`token=${apiKey}`)) {
                        }
                        if (match[1] === 'SofarWaveWatch3') {
                            return result;
                        } else {
                            throw new Error('404');
                        }
                    },
                    get: (_match: unknown, data: unknown): unknown => ({ body: data }),
                },
            ]);
        };

        describe('Check parameters', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let superagentMock: any;
            let marineWeather: MarineWeather;
            beforeAll(() => {
                marineWeather = new MarineWeather(apiKey);
                superagentMock = getMock({ foo: 'bar' });
            });

            it('Should check modelId', async () => {
                await expect(marineWeather.getPointForecast('', 0, 0, ['foo'])).rejects.toThrowError(
                    'A modelId has to be specified!',
                );
            });

            it('Should check for at least one variableId', async () => {
                await expect(marineWeather.getPointForecast('foo', 0, 0, [])).rejects.toThrowError(
                    'At least one variableID must be specified!',
                );
            });
            afterAll(async (done) => {
                superagentMock.unset();
                done();
            });
        });

        describe('Invalid authentication', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let superagentMock: any;
            let marineWeather: MarineWeather;
            beforeAll(() => {
                marineWeather = new MarineWeather('invalid');
                superagentMock = getMock(expectedResult);
            });

            it('ensures proper error handling', async () => {
                await expect(marineWeather.getPointForecast('abc', 0, 0, ['abc'])) //
                    .rejects.toThrowError('404');
            });
            afterAll(async (done) => {
                superagentMock.unset();
                done();
            });
        });

        describe('Request data', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let superagentMock: any;
            let marineWeather: MarineWeather;
            beforeAll(() => {
                marineWeather = new MarineWeather(apiKey);
                superagentMock = getMock(expectedResult);
            });

            it('Request single variable', async () => {
                const promise = marineWeather.getPointForecast(
                    //
                    'SofarWaveWatch3',
                    -152.0001,
                    37.0001,
                    ['SofarOperationalWaveModel-significantWaveHeight'],
                );
                await expect(promise).resolves.not.toBeNull();
                const data = await promise;
                expect(data.modelID).toBe('SofarOperationalWaveModel');
                expect(data.requestTime).toBe('2020-03-07T00:08:17.965Z');
                expect(data.requestLocation).toEqual({
                    latitude: 37.0001,
                    longitude: -152.0001,
                });
                expect(data.forecastVariables.length).toBe(2);
                const variable0 = data.forecastVariables[0];
                expect(variable0.variableID).toBe('SofarOperationalWaveModel-significantWaveHeight');
                expect(variable0.variableName).toBe('significantWaveHeight');
                expect(variable0.dataCategory).toBe('surfaceWaves');
                expect(variable0.physicalUnit).toBe('m');
                expect(variable0.values).toEqual([
                    {
                        timestamp: '2020-03-07T00:00:00.000Z',
                        value: 3.28,
                        leadTimeHours: 6,
                    },
                    {
                        timestamp: '2020-03-07T01:00:00.000Z',
                        value: 3.23,
                        leadTimeHours: 7,
                    },
                    {
                        timestamp: '2020-03-07T02:00:00.000Z',
                        value: 3.1799998,
                        leadTimeHours: 8,
                    },
                ]);
            });
            afterAll(async (done) => {
                superagentMock.unset();
                done();
            });
        });

        describe('Handle empty forcastVariables', () => {
            let superagentMock: any;
            let marineWeather: MarineWeather;
            beforeAll(() => {
                marineWeather = new MarineWeather(apiKey);
                superagentMock = getMock(getEmptyForecastPoint());
            });

            it('Request single variable', async () => {
                const promise = marineWeather.getPointForecast(
                    //
                    'SofarWaveWatch3',
                    -152.0001,
                    37.0001,
                    ['SofarOperationalWaveModel-significantWaveHeight'],
                );
                await expect(promise).resolves.not.toBeNull();
                const data = await promise;
                expect(data.forecastVariables.length).toBe(0);
            });

            afterAll(async (done) => {
                superagentMock.unset();
                done();
            });
        });
    });
});
