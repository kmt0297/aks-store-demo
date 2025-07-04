'use strict'

const path = require('path')
const AutoLoad = require('@fastify/autoload')
const { MongoClient } = require('mongodb')

module.exports = async function (fastify, opts) {
// Place here your custom code!

  // Connect to MongoDB if MONGO_URL is set
  const mongoUrl = process.env.MONGO_URL
  if (mongoUrl) {
    try {
      const client = await MongoClient.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      fastify.log.info('Connected to MongoDB from order-service')
      client.close()
    } catch (err) {
      fastify.log.error('Failed to connect to MongoDB:', err.message)
    }
  } else {
    fastify.log.warn('MONGO_URL not set in environment variables')
  }
  
  fastify.register(require('@fastify/cors'), {
    origin: '*'
  })

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
}
