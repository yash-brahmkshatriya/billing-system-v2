const { isAuthenticated, isSelf } = require('../middlewares/authenticate');
const {
  applyMiddlewares,
  getParentQuery,
  getContextValue,
} = require('../middlewares/middlewareChain');
const billRepository = require('../../modules/bill/repository');
const userRepository = require('../../modules/user/repository');
const { RESOLVER_NAME_KEY } = require('../../constants');

const billResolver = {
  [RESOLVER_NAME_KEY]: 'BILL_RESOLVER',
  Query: {},
  Mutation: {
    createBill: async (...resolverArgs) =>
      await applyMiddlewares.apply(null, resolverArgs)(
        isAuthenticated,
        billRepository.createBillMutationResolver
      ),
  },
  Bill: {
    owner: async (...resolverArgs) => {
      return userRepository.getProfileResolver(
        getParentQuery(resolverArgs),
        { _id: getParentQuery(resolverArgs).owner.toString() },
        getContextValue(resolverArgs)
      );
    },
  },
};

module.exports = { billResolver };
