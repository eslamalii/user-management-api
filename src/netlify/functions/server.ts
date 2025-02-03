import serverless from 'serverless-http'
import express from 'express'
import app from '../../app'

const server = express()

server.use('/.netlify/functions/server/api-docs', app)

export const handler = serverless(server)
