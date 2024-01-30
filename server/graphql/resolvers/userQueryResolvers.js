const User = require('../../modules/user/model');
const encryption = require('../../utils/encryption');
const messages = require('../../utils/messages');
const { throwGraphQLError } = require('../../utils/responses');

const userQueryResovlers = {
  Query: {
    login: async (_, { loginInput }) => {
      const { email, password } = loginInput;
      let user = await User.findOne({ email });
      if (!user) throwGraphQLError(messages.user.user_not_found);
      let validPassword = await encryption.comparePasswordUsingBcrypt(
        password,
        user.password
      );
      if (!validPassword) {
        throwGraphQLError(messages.auth.invalid_credentials);
      }
      const criteriaForJWT = {
        _id: user._id,
        date: new Date(),
      };

      const authToken = await encryption.generateAuthToken(criteriaForJWT);
      return { authToken };
    },
    checkEmail: async (_, { checkEmailInput }) => {
      const { email } = checkEmailInput;
      let user = await User.findOne({ email }).lean();
      if (user) {
        return true;
      } else return false;
    },
  },
  Mutation: {},
};

module.exports = { userQueryResovlers };
