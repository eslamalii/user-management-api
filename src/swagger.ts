// src/swagger.ts
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'
import path from 'path'
import fs from 'fs'

const swaggerPath = path.join(__dirname, 'docs', 'swagger.json')
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'))

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}
