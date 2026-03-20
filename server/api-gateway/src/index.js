import { app } from './app.js'
import { PORT } from './config/env.config.js'

app.listen(PORT, () => {
  console.log(` API Gateway running on port ${PORT}`)
})