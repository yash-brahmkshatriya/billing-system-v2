const fs = require('fs');
const { gql } = require('apollo-server-express');

const {
  userQueryResovlers,
} = require('../graphql/resolvers/userQueryResolvers');
const { billResolver } = require('./resolvers/billResolver');
const { dateScalar } = require('./resolvers/scalars');
const { RESOLVER_NAME_KEY } = require('../constants');

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
  const resolvers = [userQueryResovlers, billResolver];
  const uniqueKeys = [
    ...new Set(resolvers.flatMap((resolver) => Object.keys(resolver))),
  ].filter((v) => v !== RESOLVER_NAME_KEY);

  const rootResolver = uniqueKeys.reduce((rootResolver, key) => {
    rootResolver[key] = {};
    resolvers.forEach((resolver) => {
      if (resolver[key]) {
        rootResolver[key] = { ...rootResolver[key], ...resolver[key] };
      }
    });
    return rootResolver;
  }, {});
  return {
    Date: dateScalar,
    ...rootResolver,
  };
};

module.exports = {
  prepareGraphQlSchemas,
  prepareGraphQLResolvers,
};
