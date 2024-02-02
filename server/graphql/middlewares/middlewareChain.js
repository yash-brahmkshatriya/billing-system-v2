/**
 Last argument assed is treated as actual function and rest others as filters / middlewares
 * 
 * @param  resolverArgs 
 * @returns Resolver: actual resolver if all middlewares moves to next
 */
const applyMiddlewares =
  (...resolverArgs) =>
  async (...middlewares) => {
    const next = () => Promise.resolve();

    for (let index in middlewares) {
      index = +index;
      let middleware = middlewares[index];

      if (index === middlewares.length - 1) {
        return await middleware.apply(null, resolverArgs);
      }

      await middleware(resolverArgs, next);
    }
  };

const getParentQuery = (resolverArgs) => resolverArgs[0];
const getQueryArgs = (resolverArgs) => resolverArgs[1];
const getContextValue = (resolverArgs) => resolverArgs[2];

module.exports = {
  applyMiddlewares,
  getParentQuery,
  getQueryArgs,
  getContextValue,
};
