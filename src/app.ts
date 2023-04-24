import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import http from 'http'
import morgan from 'morgan'

import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'

import itemRouter from './controllers/item.js'
import loginRouter from './controllers/login.js'
import orderRouter from './controllers/order.js'
import signupRouter from './controllers/signup.js'
import itemResolver from './graphql/itemResolvers.js'
import typeDefs from './graphql/typeDefs.js'
import userResolver from './graphql/userResolvers.js'
import logger from './utils/logger.js'

const app = express()
app.use(cors())
app.use(morgan('dev'))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
})
app.use(limiter)

// https://helmetjs.github.io/
app.use(helmet.expectCt())
app.use(helmet.frameguard())
app.use(helmet.hidePoweredBy())
app.use(helmet.hsts())
app.use(helmet.ieNoOpen())
app.use(helmet.noSniff())
app.use(helmet.referrerPolicy())
app.use(helmet.xssFilter())

// Log requests to the console if not in production
// if (process.env.NODE_ENV !== ('production' || 'prod')) {
//   logger.warning('Not in production')
// }

app.use(express.json())

interface MyContext {
  token?: string
}

// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app)

const resolvers = Object.assign({
  Query: Object.assign({}, itemResolver.Query, userResolver.Query),
  Mutation: Object.assign({}, itemResolver.Mutation, userResolver.Mutation)
})

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers: resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
})

await server.start()

app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.authorization || '' })
  })
)

app.get('/ping', (_req: Request, res: Response) => {
  res.json({ pong: 'pong' })
})

// Routes
app.use('/api/login', loginRouter)
app.use('/api/signup', signupRouter)
app.use('/api/items', itemRouter)
app.use('/api/order', orderRouter)

// Error handling for JWT token
app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message)
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid token')
  } else {
    next()
  }
})

export default httpServer
