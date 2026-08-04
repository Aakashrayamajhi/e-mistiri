export const retryWithBackoff = async (fn, retries = 3, factor = 2, minTimeout = 1000, maxTimeout = 10000) => {
  let attempt = 0
  let timeout = minTimeout

  while (attempt < retries) {
    try {
      return await fn()
    } catch (error) {
      attempt++

      if (attempt >= retries) {
        throw error
      }

      console.warn(`Attempt ${attempt} failed, retrying in ${timeout}ms...`)

      await new Promise((resolve) => setTimeout(resolve, timeout))

      timeout = Math.min(timeout * factor, maxTimeout)
    }
  }
}
