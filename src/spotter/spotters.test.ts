import superagent from 'superagent';
import mockSuperagent from 'superagent-mock';
import { SDK } from '../sdk';
import { Spotters } from './spotters';

const apiKey = 'key';

describe('Spotters list test', () => {
    describe('Point forecast API', () => {
        const expectedMultiResult = {
            message: '2 devices',
            data: {
                devices: [
                    {
                        spotterId: 'SPOT-0222',
                        name: 'SPOT-NAME-0222',
                    },
                    {
                        spotterId: 'SPOT-0223',
                        name: 'SPOT-NAME-0223',
                    },
                ],
            },
        };
        const expectedSingleResult = {
            message: '1 devices',
            data: {
                devices: [
                    {
                        spotterId: 'SPOT-0222',
                        name: 'SPOT-NAME-0222',
                    },
                ],
            },
        };
        const expectedResult = {
            single: expectedSingleResult,
            multi: expectedMultiResult,
        };

        const getMock = (obj: { single: any; multi: any }): object => {
            return mockSuperagent(superagent, [
                {
                    pattern: `${SDK.baseUrl}\/api\/devices(.exludeSharedDevices=(.*))*`,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    fixtures: (match: any, params: unknown, headers: Record<string, unknown>): unknown => {
                        if (headers['token'] != apiKey) {
                            throw new Error('403');
                        }
                        if (match[2] == 'true') {
                            return obj.single;
                        } else {
                            return obj.multi;
                        }
                    },
                    get: (_match: unknown, data: unknown): unknown => ({ body: data }),
                },
            ]);
        };

        describe('Invalid authentication', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let superagentMock: any;
            let spotters: Spotters;
            beforeAll(() => {
                spotters = new Spotters('invalid');
                superagentMock = getMock(expectedResult);
            });

            it('ensures proper error handling', async () => {
                await expect(spotters.getSpotters()) //
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
            let spotters: Spotters;
            beforeAll(() => {
                spotters = new Spotters(apiKey);
                superagentMock = getMock(expectedResult);
            });

            it('Request spotters', async () => {
                const promise = spotters.getSpotters();
                await expect(promise).resolves.not.toBeNull();

                const data = await promise;
                expect(data.length).toBe(2);
                expect(data[0].id).toBe('SPOT-0222');
                expect(data[0].name).toBe('SPOT-NAME-0222');
                expect(data[1].id).toBe('SPOT-0223');
                expect(data[1].name).toBe('SPOT-NAME-0223');
            });

            it('Requests one spotter', async () => {
                const promise = spotters.getSpotter('SPOT-0222');
                await expect(promise).resolves.not.toBeNull();

                const spotter = await promise;
                expect(spotter.id).toBe('SPOT-0222');
                expect(spotter.name).toBe('SPOT-NAME-0222');
            });

            it('Request nonexistant spotter', async () => {
                await expect(spotters.getSpotter('INVALID')).rejects.toThrowError('No spotter with id INVALID found.');
            });

            afterAll(async (done) => {
                superagentMock.unset();
                done();
            });
        });

        describe('Request exluding shared devices', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let superagentMock: any;
            let spotters: Spotters;
            beforeAll(() => {
                spotters = new Spotters(apiKey);
                superagentMock = getMock(expectedResult);
            });

            it('Request spotters', async () => {
                const promise = spotters.getSpotters(true);
                await expect(promise).resolves.not.toBeNull();

                const data = await promise;
                expect(data.length).toBe(1);
                expect(data[0].id).toBe('SPOT-0222');
                expect(data[0].name).toBe('SPOT-NAME-0222');
            });
            afterAll(async (done) => {
                superagentMock.unset();
                done();
            });
        });

        describe('Handle empty data', () => {
            let superagentMock: any;
            let spotters: Spotters;
            const emptyResult = {
                message: '1 devices',
                data: {
                    devices: null,
                },
            };
            beforeAll(() => {
                spotters = new Spotters(apiKey);
                superagentMock = getMock({ multi: emptyResult, single: emptyResult });
            });

            it('Handle no devices', async () => {
                const promise = spotters.getSpotters();
                await expect(promise).resolves.not.toBeNull();

                const data = await promise;
                expect(data.length).toBe(0);
            });
            afterAll(async (done) => {
                superagentMock.unset();
                done();
            });
        });
    });
});
