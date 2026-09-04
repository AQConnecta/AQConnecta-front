import pkg from '../../../package.json'

const nodeEnv = import.meta.env.VITE_ENV || 'development'
const isProduction = nodeEnv === 'production'
const isDevelopment = nodeEnv === 'development'

// Em desenvolvimento (ou se não tiver VITE_BASE_URL), usa o proxy do Vite (/api)
// Em produção, usa a URL configurada no env
const getBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL

  if (isProduction && baseUrl) {
    return baseUrl.replace(/\/+$/, '')
  }

  return '/api'
}

const config = {
  version: pkg.version,
  baseUrl: getBaseUrl(),
  localUrl: 'http://localhost:3000',
  nodeEnv,
  isProduction,
  isDevelopment,
  useLocal: false,
}

export function configurePrefix() {
  return config.useLocal ? config.localUrl : config.baseUrl
}

export default config
