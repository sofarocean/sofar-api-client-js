import { MarineWeather } from './marineWeather';
import { getModels } from './weatherTestSuport';
import superagent from 'superagent';
import mockSuperagent from 'superagent-mock';
import { SDK } from '../sdk';
import { WeatherModel, WeatherModelVariable } from './weatherModel';

const apiKey = 'key';

describe('Marine Weather Model Availability test', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let superagentMock: any;
    let marineWeather: MarineWeather;

    afterAll(async (done) => {
        superagentMock.unset();
        done();
    });

    describe('Availability API', () => {
        const expectedResult = {
            modelID: 'SofarOperationalWaveModel',
            outputTimes: ['2020-05-29T00:00:00Z', '2020-05-29T01:00:00Z', '2020-05-29T02:00:00Z'],
        };

        const getMock = (result: object): object => {
            return mockSuperagent(superagent, [
                {
                    pattern: `${SDK.baseUrl}/marine-weather/v1/models/(.*)/outputTimes(.*)`,
                    fixtures: (_match: any, params: unknown, headers: Record<string, unknown>): unknown => {
                        const query = _match[2] as string;
                        if (!query.includes(`token=${apiKey}`)) {
                            throw new Error('403');
                        }
                        return result;
                    },
                    get: (_match: unknown, data: unknown): unknown => ({ body: data }),
                },
            ]);
        };

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
                    await expect(
                        marineWeather.getModelAvailability({ modelID: 'SofarOperationalWaveModel' }),
                    ).rejects.toThrow();
                });
            });

            describe('With proper authentication', () => {
                beforeEach(() => {
                    marineWeather = new MarineWeather(apiKey);
                });

                it('should return the expeted result', async (done) => {
                    await expect(
                        marineWeather.getModelAvailability({ modelID: 'SofarOperationalWaveModel' }),
                    ).resolves.not.toBeNull();

                    const data = await marineWeather.getModelAvailability({ modelID: 'SofarOperationalWaveModel' });
                    expect(data.modelID).toBe('SofarOperationalWaveModel');
                    expect(data.outputTimes.length).toBe(3);

                    expect(data.outputTimes[0]).toBeInstanceOf(Date);

                    expect(data.outputTimes).toEqual([
                        new Date('2020-05-29T00:00:00Z'),
                        new Date('2020-05-29T01:00:00Z'),
                        new Date('2020-05-29T02:00:00Z'),
                    ]);

                    done();
                });
            });
        });
    });
});
