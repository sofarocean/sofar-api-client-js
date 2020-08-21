import { MarineWeather } from './marineWeather';
import { getCategories, getCategoryMetadata } from './weatherTestSuport';
import superagent from 'superagent';
import mockSuperagent from 'superagent-mock';
import { SDK } from '../sdk';
import { DataCategory, DataCategoryDetail } from './dataCategory';

const apiKey = 'key';

describe('Marine Weather Model Data Categories test', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let superagentMock: any;
    let marineWeather: MarineWeather;

    afterAll(async (done) => {
        superagentMock.unset();
        done();
    });

    describe('Data Categories API', () => {
        const expectedResult = getCategories();

        const getMock = (result: object): object => {
            return mockSuperagent(superagent, [
                {
                    pattern: `${SDK.baseUrl}/marine-weather/v1/data-categories(.*)`,
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
                await expect(marineWeather.getDataCategories()).resolves.not.toBeNull();
                const data = await marineWeather.getDataCategories();
                expect(data.length).toBe(0);
            });
        });

        describe('With valid model data', () => {
            beforeAll(() => {
                superagentMock = getMock(expectedResult);
            });
            describe('With invalid authentication', () => {
                beforeEach(() => {
                    marineWeather = new MarineWeather('--INVALID---');
                });
                it('should throw an error', async () => {
                    await expect(marineWeather.getDataCategories()).rejects.toThrow();
                });
            });

            describe('With proper authentication', () => {
                beforeEach(() => {
                    marineWeather = new MarineWeather(apiKey);
                });

                it('should return the expeted result', async (done) => {
                    await expect(marineWeather.getDataCategories()).resolves.not.toBeNull();
                    const data = await marineWeather.getDataCategories();
                    expect(data.length).toBe(3);
                    expect(data).toBeInstanceOf(Array);
                    expect(data[0]).toBeInstanceOf(DataCategory);

                    expect(data[0].dataCategoryID).toBe('surfaceWaves');

                    expect(data[0].providedBy.length).toBe(2);
                    expect(data[0].providedBy[0]).toBeInstanceOf(DataCategoryDetail);
                    expect(data[0].providedBy[0].modelID).toBe('SofarOperationalWaveModel');
                    expect(data[0].providedBy[0].variableIDs).toStrictEqual([
                        'SofarOperationalWaveModel-significantWaveHeight',
                        'SofarOperationalWaveModel-meanDirection',
                        'SofarOperationalWaveModel-meanPeriod',
                    ]);

                    expect(data[2].providedBy.length).toBe(0);

                    done();
                });
            });
        });
    });

    // Data Category Metadata
    describe('Weather Model Data Category Metadata API', () => {
        const expectedResult = getCategoryMetadata();

        const getMock = (result: object): object => {
            return mockSuperagent(superagent, [
                {
                    pattern: `${SDK.baseUrl}/marine-weather/v1/data-categories/(.*)`,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    fixtures: (match: any, params: unknown, headers: Record<string, unknown>): unknown => {
                        const query = match[1] as string;
                        if (!query.includes(`token=${apiKey}`)) {
                            throw new Error('403');
                        }
                        if ((match[1] as string).startsWith('surfaceWaves')) {
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
                    await expect(marineWeather.getDataCategoryMetadata('Foo')).rejects.toThrow();
                });
            });

            describe('Invalid ModelID', () => {
                beforeEach(() => {
                    marineWeather = new MarineWeather(apiKey);
                });

                it('Should return an error', async () => {
                    await expect(marineWeather.getDataCategoryMetadata('invalid')).rejects.toThrowError('404');
                });
            });

            describe('With proper authentication', () => {
                beforeEach(() => {
                    marineWeather = new MarineWeather(apiKey);
                });

                it('should return the expeted result', async (done) => {
                    await expect(marineWeather.getDataCategoryMetadata('surfaceWaves')).resolves.not.toBeNull();
                    const data = await marineWeather.getDataCategoryMetadata('surfaceWaves');
                    expect(data).toBeInstanceOf(DataCategory);

                    expect(data.dataCategoryID).toBe('surfaceWaves');
                    expect(data.providedBy.length).toEqual(2);

                    expect(data.providedBy[0]).toBeInstanceOf(DataCategoryDetail);
                    expect(data.providedBy[0].modelID).toBe('SofarOperationalWaveModel');
                    expect(data.providedBy[0].variableIDs).toStrictEqual([
                        'SofarOperationalWaveModel-significantWaveHeight',
                        'SofarOperationalWaveModel-meanDirection',
                        'SofarOperationalWaveModel-meanPeriod',
                    ]);
                    done();
                });
            });
        });
    });
});
