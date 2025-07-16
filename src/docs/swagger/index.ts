import * as fs from 'fs'
import * as path from 'path'

import { Express } from 'express'
import { serve, setup } from 'swagger-ui-express'

import { config } from '../../config'

// Read and parse the JSON files
const authSpec = JSON.parse(fs.readFileSync(path.join(__dirname, 'auth.json'), 'utf8'))
const userSpec = JSON.parse(fs.readFileSync(path.join(__dirname, 'user.json'), 'utf8'))
const companySpec = JSON.parse(fs.readFileSync(path.join(__dirname, 'company.json'), 'utf8'))
const branchSpec = JSON.parse(fs.readFileSync(path.join(__dirname, 'branch.json'), 'utf8'))
const commonSpec = JSON.parse(fs.readFileSync(path.join(__dirname, 'common.json'), 'utf8'))

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
      url: config.server.baseUrl,
      description: config.server.isProd ? 'Production server' : 'Local server',
    },
  ],
  tags: [
    ...authSpec.tags,
    ...userSpec.tags,
    ...companySpec.tags,
    ...branchSpec.tags
  ],
  paths: {
    ...(authSpec.paths || {}),
    ...(userSpec.paths || {}),
    ...(companySpec.paths || {}),
    ...(branchSpec.paths || {})
  },
  components: {
    securitySchemes: commonSpec.components.securitySchemes
  }
}

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', serve, setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Documentation'
  }))

  // Serve swagger spec as JSON
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(specs)
  })
}
