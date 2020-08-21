import superagent from 'superagent';
import mockSuperagent from 'superagent-mock';
import { SDK } from '../sdk';
import { Spotter } from './spotter';
import { SpotterWaveData } from './spotterWaveData';

const apiKey = 'key';

describe('Spotter test', () => {
    describe('Wave data API', () => {
        const queryStringRx = new RegExp('([^?=&]+)(=([^&]*))?', 'g');
        const spotterId = '123';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const getMock = (fn: (match: any) => object): object => {
            return mockSuperagent(superagent, [
                {
                    pattern: `${SDK.baseUrl}\/api\/wave-data(.*)`,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    fixtures: (match: any, _params: unknown, headers: Record<string, unknown>): unknown => {
                        if (headers['token'] != apiKey) {
                            throw new Error('403');
                        }
                        return fn(match);
                    },
                    get: (_match: unknown, data: unknown): unknown => ({ body: data }),
                },
            ]);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const getProofingMock = (key: string, expected: any, result: object): object => {
            return getMock((match) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const queryString: any = {};
                const uri = match[0];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                uri.replace(queryStringRx, function (_0: any, key: string, _1: any, val: any) {
                    queryString[key] = val;
                });
                if (queryString[key] == expected) {
                    return result;
                } else throw Error(`${key} didn't match, expected ${expected} - got ${queryString[key]}`);
            });
        };

        describe('Invalid authentication', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let superagentMock: any;
            let spotter: Spotter;
            beforeAll(() => {
                spotter = new Spotter({ spotterId: spotterId }, 'invalid');
                superagentMock = getMock(() => {
                    return new SpotterWaveData({});
                });
            });

            it('ensures proper error handling', async () => {
                await expect(spotter.getWaveData()) //
                    .rejects.toThrowError('403');
            });
            afterAll(async (done) => {
                superagentMock.unset();
                done();
            });
        });

        describe('Verify parameters', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let superagentMock: any;
            let spotter: Spotter;
            const expected = { data: { spotterId: spotterId, limit: 123, waves: [{}], wind: [{}] } };
            beforeAll(() => {
                spotter = new Spotter({ spotterId: spotterId }, apiKey);
            });

            it('spotterId', async () => {
                superagentMock = getProofingMock('spotterId', spotterId, expected);
                const data = await spotter.getWaveData();
                expect(data.spotterId).toBe(spotterId);
                expect(data.limit).toBe(123);
            });

            it('includeWindData', async () => {
                superagentMock = getProofingMock('includeWindData', 'true', expected);
                const data = await spotter.getWaveData({ includeWindData: true });
                expect(data.spotterId).toBe(spotterId);
            });
            it('includeDirectionalMoments', async () => {
                superagentMock = getProofingMock('includeDirectionalMoments', 'true', expected);
                const data = await spotter.getWaveData({ includeDirectionalMoments: true });
                expect(data.spotterId).toBe(spotterId);
            });
            it('includeFrequencyData', async () => {
                superagentMock = getProofingMock('includeFrequencyData', 'true', expected);
                const data = await spotter.getWaveData({ includeFrequencyData: true });
                expect(data.spotterId).toBe(spotterId);
            });

            it('startDate', async () => {
                const startDate = new Date();

                superagentMock = getProofingMock('startDate', encodeURIComponent(startDate.toISOString()), expected);
                const data = await spotter.getWaveData({ startDate: startDate });
                expect(data.spotterId).toBe(spotterId);
            });

            it('endDate', async () => {
                const endDate = new Date();

                superagentMock = getProofingMock('endDate', encodeURIComponent(endDate.toISOString()), expected);
                const data = await spotter.getWaveData({ endDate: endDate });
                expect(data.spotterId).toBe(spotterId);
            });

            afterAll(async (done) => {
                superagentMock.unset();
                done();
            });
        });
    });
});
