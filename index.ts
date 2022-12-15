import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@apollo/server/express4'
import { GraphQLError } from 'graphql'

import cors from 'cors'
import http from 'http'
import bodyParser from 'body-parser'

import express, { Request } from 'express'
import typeDefs from './src/graphql/typedefs.js'

const resolvers = {
  Query: {
    // Example resolver
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    adminExample: (_parent: any, _args: any, contextValue: { authScope: string; }, _info: any) => {
      if (contextValue.authScope !== 'ADMIN') {
        throw new GraphQLError('not admin!', {
          extensions: { code: 'UNAUTHENTICATED' },
        })
      }
    },
  },
}

const app = express()
const port = 3001

interface MyContext {
  token?: string
}

// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.

const httpServer = http.createServer(app)

// Same ApolloServer initialization as before, plus the drain plugin
// for our httpServer.

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

// Note you must call `server.start()` on the `ApolloServer`
// instance before passing the instance to `expressMiddleware`
await server.start()

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }),
)

app.get('/data', (_req: Request, res: any) => {
  res.json({ foo: 'bar' })
})

app.get('/ping', (_req: Request, res: any) => {
  res.json({ pong: 'pong' })
})

// Modified server startup
// eslint-disable-next-line no-promise-executor-return
await new Promise<void>((resolve) => httpServer.listen(port, resolve))

console.log(`🚀 Server ready at http://localhost:${port}/`)
