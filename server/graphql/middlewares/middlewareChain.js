/**
 Last argument assed is treated as actual function and rest others as filters / middlewares
 * 
 * @param  resolverArgs 
 * @returns Resolver: actual resolver if all middlewares moves to next
 */
const applyMiddlewares =
  (...resolverArgs) =>
  async (...middlewares) => {
    const contextValue = resolverArgs[2];
    const next = () => Promise.resolve();

    for (let index in middlewares) {
      index = +index;
      let middleware = middlewares[index];

      if (index === middlewares.length - 1) {
        return await middleware.apply(null, resolverArgs);
      }

      await middleware(contextValue, next);
    }
  };

module.exports = { applyMiddlewares };
