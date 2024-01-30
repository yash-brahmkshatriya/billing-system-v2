const fs = require('fs');
const { gql } = require('apollo-server-express');

const {
  userQueryResovlers,
} = require('../graphql/resolvers/userQueryResolvers');

const schemasPath = `${__dirname}/schemas`;

const scanSchemas = () => {
  return fs
    .readdirSync(schemasPath)
    .map((schemaFile) =>
      fs.readFileSync(`${schemasPath}/${schemaFile}`, 'utf-8')
    );
};

const prepareGraphQlSchemas = () => {
  return gql`
    ${scanSchemas().join('\n')}
  `;
};

const prepareGraphQLResolvers = () => {
  return {
    Query: {
      ...userQueryResovlers.Query,
    },
    Mutation: {
      ...userQueryResovlers.Mutation,
    },
  };
};

module.exports = {
  prepareGraphQlSchemas,
  prepareGraphQLResolvers,
};
