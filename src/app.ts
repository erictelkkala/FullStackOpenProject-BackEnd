import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import http from 'http'
import morgan from 'morgan'

import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault
} from '@apollo/server/plugin/landingPage/default'

import itemResolver from './graphql/itemResolvers.js'
import orderResolver from './graphql/orderResolvers.js'
import typeDefs from './graphql/typeDefs.js'
import userResolver from './graphql/userResolvers.js'
import logger from './utils/logger.js'

interface MyContext {
  token?: string
}

const app = express()

// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app)

// Combine all resolvers
const resolvers = Object.assign({
  Query: Object.assign({}, itemResolver.Query, userResolver.Query, orderResolver.Query),
  Mutation: Object.assign({}, itemResolver.Mutation, userResolver.Mutation, orderResolver.Mutation)
})

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers: resolvers,
  plugins: [
    process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageProductionDefault({ footer: false })
      : ApolloServerPluginLandingPageLocalDefault(),
    ApolloServerPluginDrainHttpServer({ httpServer })
  ]
})

await server.start()

app.use(morgan('dev'))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
})

if (process.env.NODE_ENV !== 'development') {
  // Don't limit requests during testing
  logger.info('Rate limiting enabled: ' + process.env.NODE_ENV)
  app.use(limiter)
}

// https://helmetjs.github.io/
app.use(helmet.expectCt())
app.use(helmet.frameguard())
app.use(helmet.hidePoweredBy())
app.use(helmet.hsts())
app.use(helmet.ieNoOpen())
app.use(helmet.noSniff())
app.use(helmet.referrerPolicy())
app.use(helmet.xssFilter())

app.use(
  '/',
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({
      token: req.headers.authorization || ''
    })
  })
)

app.use('/ping', (_req, res) => {
  res.send('pong')
})

export default httpServer
