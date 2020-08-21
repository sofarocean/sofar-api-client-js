import { MarineWeather } from './marineWeather';
import { getEmptyHindcastPoint, getHindcastPoint } from './weatherTestSuport';
import superagent from 'superagent';
import mockSuperagent from 'superagent-mock';
import { SDK } from '../sdk';

const apiKey = 'key';

describe('Marine Weather Point Hindcast test', () => {
    describe('Point Hindcast API', () => {
        const expectedResult = getHindcastPoint();

        const getMock = (result: object): object => {
            return mockSuperagent(superagent, [
                {
                    pattern: `${SDK.baseUrl}/marine-weather/v1/models/(.*)/hindcast/point(.*)`,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    fixtures: (match: any, params: unknown, headers: Record<string, unknown>): unknown => {
                        const query = match[2] as string;
                        if (!query.includes(`token=${apiKey}`)) {
                            throw new Error('403');
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
                await expect(
                    marineWeather.getPointHindcast('', 0, 0, new Date(), new Date(), ['foo']),
                ).rejects.toThrowError('A modelId has to be specified!');
            });

            it('Should check for at least one variableId', async () => {
                await expect(
                    marineWeather.getPointHindcast('foo', 0, 0, new Date(), new Date(), []),
                ).rejects.toThrowError('At least one variableID must be specified!');
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
                await expect(marineWeather.getPointHindcast('abc', 0, 0, new Date(), new Date(), ['abc'])) //
                    .rejects.toThrowError('403');
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
                const promise = marineWeather.getPointHindcast(
                    //
                    'SofarWaveWatch3',
                    -152.0001,
                    37.0001,
                    new Date(2020, 1, 1),
                    new Date(2020, 6, 1),
                    ['SofarOperationalWaveModel-significantWaveHeight'],
                );
                await expect(promise).resolves.not.toBeNull();
                const data = await promise;
                expect(data.modelID).toBe('SofarOperationalWaveModel');
                expect(data.requestTime).toBe('2020-03-07T00:08:17.965Z');
                expect(data.requestStart).toBe('2020-01-01T22:00:00.000Z');
                expect(data.requestEnd).toBe('2020-06-01T00:00:00.000Z');
                expect(data.requestLocation).toEqual({
                    latitude: 37.0001,
                    longitude: -152.0001,
                });
                expect(data.hindcastVariables.length).toBe(2);
                const variable0 = data.hindcastVariables[0];
                expect(variable0.variableID).toBe('SofarOperationalWaveModel-significantWaveHeight');
                expect(variable0.variableName).toBe('significantWaveHeight');
                expect(variable0.dataCategory).toBe('surfaceWaves');
                expect(variable0.physicalUnit).toBe('m');
                expect(variable0.values).toEqual([
                    {
                        timestamp: '2020-03-07T00:00:00.000Z',
                        value: 3.28,
                    },
                    {
                        timestamp: '2020-03-07T01:00:00.000Z',
                        value: 3.23,
                    },
                    {
                        timestamp: '2020-03-07T02:00:00.000Z',
                        value: 3.1799998,
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
                superagentMock = getMock(getEmptyHindcastPoint());
            });

            it('Request single variable', async () => {
                const promise = marineWeather.getPointHindcast(
                    //
                    'SofarWaveWatch3',
                    -152.0001,
                    37.0001,
                    new Date(2020, 1, 1),
                    new Date(2020, 6, 1),
                    ['SofarOperationalWaveModel-significantWaveHeight'],
                );
                await expect(promise).resolves.not.toBeNull();
                const data = await promise;
                expect(data.hindcastVariables.length).toBe(0);
            });

            afterAll(async (done) => {
                superagentMock.unset();
                done();
            });
        });
    });
});
