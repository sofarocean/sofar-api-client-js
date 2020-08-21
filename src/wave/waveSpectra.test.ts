import { WaveSpectra, WaveSpectraData } from './waveSpectra';
import superagent from 'superagent';
import mockSuperagent from 'superagent-mock';
import { SDK } from '../sdk';
import { PassThrough } from 'stream';
import { isNullOrUndefined } from 'util';
import * as temp from 'temp';
import * as nodestream from 'stream';
import * as fs from 'fs';

const apiKey = 'key';

describe('Marine Weather Model Data Categories test', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let superagentMock: any;
    let waveSpectra: WaveSpectra;

    describe('get spectra forcast', () => {
        const expectedResult = {
            status: 'success',
            data: [
                {
                    latitude: 34.5,
                    longitude: 200.0,
                    url: 'https://api.sofarocean.com/api/op-wave-spectra/34.5/200',
                },
                {
                    latitude: 14.5,
                    longitude: 20.0,
                    url: 'https://api.sofarocean.com/api/op-wave-spectra/14.5/20',
                },
            ],
        };

        const getMock = (result: object): object => {
            return mockSuperagent(superagent, [
                {
                    pattern: `${SDK.baseUrl}/api/op-wave-spectra/(.*)`,
                    fixtures: (_match: any, params: unknown, headers: Record<string, unknown>): unknown => {
                        if (headers['token'] != apiKey) {
                            // const query = _match[0] as string;
                            // if (!query.includes(`token=${apiKey}`)) {
                            throw new Error('403');
                        }
                        return result;
                    },
                    get: (_match: unknown, data: unknown): unknown => ({ body: data }),
                },
            ]);
        };

        describe('With failure resonse', () => {
            beforeAll(() => {
                superagentMock = getMock({ status: 'failure' });
                waveSpectra = new WaveSpectra(apiKey);
            });

            it('should handle gracefully', async () => {
                const promise = waveSpectra.getWaveSpectraForecasts();
                expect(promise).rejects.toThrowError('failure');
            });
        });

        describe('With invlaid token', () => {
            beforeAll(() => {
                superagentMock = getMock({});
                waveSpectra = new WaveSpectra('foo');
            });

            it('should handle gracefully', async () => {
                await expect(waveSpectra.getWaveSpectraForecasts()).rejects.toThrowError('403');
            });
        });

        describe('get list of results', () => {
            beforeAll(() => {
                superagentMock = getMock(expectedResult);
                waveSpectra = new WaveSpectra(apiKey);
            });

            it('should handle gracefully', async () => {
                const data = await waveSpectra.getWaveSpectraForecasts();
                expect(data.length).toBe(2);
                expect(data[0].latitude).toEqual(expectedResult.data[0].latitude);
                expect(data[0].longitude).toEqual(expectedResult.data[0].longitude);
                expect(data[1].latitude).toEqual(expectedResult.data[1].latitude);
                expect(data[1].longitude).toEqual(expectedResult.data[1].longitude);
            });
        });

        describe('get a single result', () => {
            it('should get the right URL', async () => {
                const data = await waveSpectra.getWaveSpectraForecast({ latitude: 34.2, longitude: 200 });

                expect(data.latitude).toBe(34.2);
                expect(data.longitude).toBe(200);
            });
        });

        describe('download data', () => {
            let data: WaveSpectraData;

            beforeAll(() => {
                jest.setTimeout(20000);
                temp.track();
                superagentMock = getMock({ data: 'AABB' });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const sprnt: any = superagent;
                const Request = sprnt.Request;

                const oldEnd = Request.prototype.end;
                let wstream: NodeJS.WritableStream | null = null;
                Request.prototype.pipe = function (stream: NodeJS.WritableStream, options?: object): any {
                    stream.write('Foo');
                    wstream = stream;
                    this.end();
                    return stream;
                };
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                Request.prototype.end = function (fn: any): void {
                    if (isNullOrUndefined(fn)) {
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        const fnn = function (): void {};
                        oldEnd.call(this, fnn);
                        wstream?.emit('finish');
                        wstream?.end();
                    }
                };

                data = new WaveSpectraData(
                    34.5,
                    200,
                    'https://api.sofarocean.com/api/op-wave-spectra/34.5/200',
                    apiKey,
                );
            });

            it('Should download the data from the specified URL', async (done) => {
                temp.open('test', (err, inf) => {
                    data.download(inf.path)
                        .then(() => {
                            fs.readFile(inf.path, 'utf8', (_, data) => {
                                if (data == 'Foo') {
                                    done();
                                } else {
                                    throw new Error('Invalid data');
                                }
                            });
                        })
                        .catch((err) => {
                            console.error(err);
                            done();
                        });
                });
            });
        });

        afterAll(async (done) => {
            superagentMock.unset();
            done();
        });
    });
});
