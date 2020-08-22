# SOFAR API Client

Welcome to the SOFAR API Client.
It is a simple and easy to use way to access the following API endpoints:

-   Marine Weather
-   Wave Spectra
-   Spotter Sensor

Check out our weather dashboard at [https://weather.sofarocean.com/](https://weather.sofarocean.com/).

## Installing

```
npm install --save @sofarocean/sofar-api-client
```

## Authentication

The Sofar API uses token-based authentication. To get started using the Sofar API, you'll need to retrieve or generate an authentication token.

Get your API token in the [Weather Dashboard](https://weather.sofarocean.com/) by signing up for a user, then navigating to [_Account_ **>** _API Access_](https://weather.sofarocean.com/admin/api-access).

## Usage

Typescript:

```ts
import { SDK } from 'sofar-sdk';
async function main(): Promise<number> {
    const apiKey = 'YOUR API KEY';
    const sdk = new SDK(apiKey);
    console.log(await sdk.spotters.getSpotters());
    return 0;
}
main();
```

JavaScript:

```js
var SDK = require('@sofarocean/sofar-sdk').SDK;
var apiKey = 'YOUR API KEY';

var sdk = new SDK(apiKey);
sdk.spotters.getSpotters().then((spotters) => {
    console.log(spotters);
});
```

## Documentation

For the full API documentation, see [here](https://sofarocean.github.io/sofar-api-client-js/).

## Examples

### Marine Weather

#### Get Point Forecast

```js
sdk.marineWeather
    .getPointForecast('SofarOperationalWaveModel', -152.0001, 37.0001, [
        'SofarOperationalWaveModel-significantWaveHeight',
        'SofarOperationalWaveModel-meanDirection',
    ])
    .then((data) => {
        console.log(data);
    });
```

#### Get Point Hindcast

```js
sdk.marineWeather
    .getPointHindcast(
        'SofarOperationalWaveModel',
        -152,
        37,
        new Date('2020-07-12T22:00:00Z'),
        new Date('2020-07-12T24:00:00Z'),
        ['SofarOperationalWaveModel-significantWaveHeight', 'SofarOperationalWaveModel-meanDirection'],
    )
    .then((data) => {
        console.log(data);
    });
```

### Get Weather models

```js
sdk.marineWeather
    .getModels()
    .then((models) => {
        console.log('Weather models:');
        console.dir(models, { depth: null });
    })
    .catch((err) => {
        console.error(JSON.stringify(err));
    });
```

### Get model metadata

```js
sdk.marineWeather
    .getModelMetadata('NOAACoralReefWatch')
    .then((metadata) => {
        console.log('Model category metadata:');
        console.dir(metadata, { depth: null });
    })
    .catch((err) => {
        console.error(JSON.stringify(err));
    });
```

### Get data categories

```js
sdk.marineWeather
    .getDataCategories()
    .then((categories) => {
        console.log('Data categories:');
        console.dir(categories, { depth: null });
    })
    .catch((err) => {
        console.error(JSON.stringify(err));
    });
```

### Get data category metadata

```js
sdk.marineWeather
    .getDataCategoryMetadata('coralEcosystem')
    .then((metadata) => {
        console.log('Data category metadata:');
        console.dir(metadata, { depth: null });
    })
    .catch((err) => {
        console.error(JSON.stringify(err));
    });
```

### Spotter

#### Get a list of spotters

```js
sdk.spotters.getSpotters().then((spotters) => {
    console.log(spotters);
});
```

### Get Wave Data from a specific Spotter

```js
sdk.spotters
    .getSpotter('SPOT-0222')
    .getWaveData({ includeWindData: true, includeFrequencyData: true, limit: 1 })
    .then((data) => {
        console.log(data);
    });
```

### Wave Spectra

#### Get Wave Specra List and download files

```js
sdk.waveSpectra
    .getWaveSpectraForecast({ latitude: 34.5, longitude: 200 })
    .then((spectra) => {
        spectra
            .download(`${spectra.latitude}_${spectra.longitude}.netcdf`)
            .then(() => {
                // successfully written data to stream.
            })
            .catch((err) => {
                console.error(err);
            });
    })
    .catch((err) => {
        console.error(err);
    });
```

### Download Wave Spectra File

```js
sdk.waveSpectra.getWaveSpectraForecast({ latitude: 34.5, longitude: 200 }).then((spectra) => {
    spectra.download('test.netcdf').then(() => {
        console.log('done');
    });
});
```

## Development

### Build

The build step runs the typescript compilers and also recreates the documentation.

```
yarn build
```

### Test

```
yarn test
```
