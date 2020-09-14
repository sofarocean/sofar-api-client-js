import { isNullOrUndefined } from 'util';

if (isNullOrUndefined(process.env.SOFAR_API_TOKEN)) {
    throw new Error("You have to set the environment variable 'SOFAR_API_TOKEN'!");
}

export const config = {
    apiKey: process.env.SOFAR_API_TOKEN,
};
