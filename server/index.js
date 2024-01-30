const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const api = require('./api');
const serverUtil = require('./utils/serverUtil');
const {
  prepareGraphQlSchemas,
  prepareGraphQLResolvers,
} = require('./graphql/graphql-utils');
const prepareContext = require('./graphql/middlewares/prepareContext');

const app = express();

app.use(cors());
const PORT = process.env.PORT || 8000;

const startApp = async () => {
  const apolloServer = new ApolloServer({
    typeDefs: prepareGraphQlSchemas(),
    resolvers: prepareGraphQLResolvers(),
    context: async ({ req, res }) => {
      return await prepareContext(req, res);
    },
  });

  await apolloServer.start();
  app.use(express.json());
  app.use(cookieParser());
  apolloServer.applyMiddleware({ app });

  app.get('/', (req, res) =>
    res.status(200).send('Billing system v2 Express erver running...')
  );
  app.use('/api', api);

  app.listen(PORT, () => {
    console.log(`Billing System v2 API - up and running on ${PORT}`);
    console.log(
      `Billing System GraphQL server - up and running at ${apolloServer.graphqlPath}`
    );
  });
};

serverUtil
  .boot(app)
  .then(() => {
    startApp();
  })
  .catch((err) => console.error(err));
