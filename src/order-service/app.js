'use strict'

const path = require('path')
const AutoLoad = require('@fastify/autoload')
const { MongoClient } = require('mongodb')

module.exports = async function (fastify, opts) {
  fastify.register(require('@fastify/cors'), {
    origin: '*'
  })

  const client = new MongoClient(process.env.MONGO_URL)
  await client.connect()
  const db = client.db()
  fastify.decorate('mongo', db)

  fastify.addHook('onClose', async (instance, done) => {
    await client.close()
    done()
  })

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
}
