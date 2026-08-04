export const withTimeout = (promise, ms) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => {
        const error = new Error('Request timed out')
        error.status = 504
        error.statusCode = 504
        reject(error)
      }, ms)
    )
  ])
}
