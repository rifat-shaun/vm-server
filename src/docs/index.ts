import * as fs from 'fs'
import * as path from 'path'

import { Express } from 'express'
import { serve, setup } from 'swagger-ui-express'

// Read and parse the JSON files
const commonSpec = JSON.parse(fs.readFileSync(path.join(__dirname, 'swagger/common.json'), 'utf8'))
const authSpec = JSON.parse(fs.readFileSync(path.join(__dirname, 'swagger/auth.json'), 'utf8'))
const userSpec = JSON.parse(fs.readFileSync(path.join(__dirname, 'swagger/user.json'), 'utf8'))

// Merge the specifications
const specs = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'API documentation for the authentication system',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
  ],
  tags: [
    ...authSpec.tags,
    ...userSpec.tags
  ],
  paths: {
    ...authSpec.paths,
    ...userSpec.paths
  },
  components: {
    schemas: {
      ...commonSpec.components.schemas,
      ...authSpec.components?.schemas,
      ...userSpec.components?.schemas
    },
    securitySchemes: commonSpec.components.securitySchemes
  }
}

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', serve, setup(specs))
}
