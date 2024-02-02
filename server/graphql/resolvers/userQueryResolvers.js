const { isAuthenticated, isSelf } = require('../middlewares/authenticate');
const { applyMiddlewares } = require('../middlewares/middlewareChain');
const userRepository = require('../../modules/user/repository');

const userQueryResovlers = {
  Query: {
    login: userRepository.loginResolver,
    checkEmail: userRepository.checkEmailResolver,
    profile: async (...resolverArgs) =>
      await applyMiddlewares.apply(null, resolverArgs)(
        isAuthenticated,
        userRepository.getProfileResolver
      ),
    me: async (...resolverArgs) =>
      await applyMiddlewares.apply(null, resolverArgs)(
        isAuthenticated,
        userRepository.me
      ),
  },
  Mutation: {
    createUser: userRepository.createUserMutationResolver,
    editUser: async (...resolverArgs) =>
      await applyMiddlewares.apply(null, resolverArgs)(
        isAuthenticated,
        isSelf,
        userRepository.editUserMutationResolver
      ),
    changePassword: async (...resolverArgs) =>
      await applyMiddlewares.apply(null, resolverArgs)(
        isAuthenticated,
        userRepository.changePassword
      ),
  },
};

module.exports = { userQueryResovlers };
