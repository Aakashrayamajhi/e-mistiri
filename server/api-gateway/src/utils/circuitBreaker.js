import CircuitBreaker from 'opossum'

export const createCircuitBreaker = (fn, options = {}, fallback) => {
  const defaultOptions = {
    errorThresholdPercentage: 50,
    resetTimeout: 30000,
    timeout: 5000,
    volumeThreshold: 10
  }

  const mergedOptions = { ...defaultOptions, ...options }

  const breaker = new CircuitBreaker(fn, mergedOptions)

  if (fallback) {
    breaker.fallback(fallback)
  }

  breaker.on('open', () => {
    console.warn('Circuit breaker opened - failures exceeded threshold')
  })

  breaker.on('halfOpen', () => {
    console.info('Circuit breaker half-open - testing recovery')
  })

  breaker.on('close', () => {
    console.info('Circuit breaker closed - service recovered')
  })

  breaker.on('failure', (error) => {
    console.error('Circuit breaker failure:', error.message)
  })

  return breaker
}
