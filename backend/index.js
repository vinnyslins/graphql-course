require('dotenv').config()

const { ApolloServer } = require('apollo-server')
const { importSchema } = require('graphql-import')

const resolvers = require('./resolvers')
const context = require('./config/context')

const schemaPath = './schema/index.graphql'
const server = new ApolloServer({
  typeDefs: importSchema(schemaPath),
  resolvers,
  context
})

server.listen(4001).then(({ url }) => {
  console.log(`Executando em ${url}`)
})
