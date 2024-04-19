import pkg from "../../../package.json";
const nodeEnv = import.meta.env.VITE_ENV
const isProduction = nodeEnv === 'production';
const isDevelopment = nodeEnv === 'development';

const config = {
    version: pkg.version,
    baseUrl: import.meta.env.VITE_BASE_URL!.replace(/\/+$/, ''),
    localUrl:'http://localhost:3000',
    nodeEnv,
    isProduction,
    isDevelopment,
    useLocal: false,
}

export function configurePrefix() {
    return config.useLocal ? config.localUrl : config.baseUrl
}

export default config
