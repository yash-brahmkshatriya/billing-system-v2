const User = require('./model');
const encryption = require('../../utils/encryption');
const { throwGraphQLError } = require('../../utils/responses');
const messages = require('../../utils/messages');
const { CONTEXT_USER_KEY } = require('../../constants');

const loginResolver = async (_, { loginInput }) => {
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
  };

  const authToken = await encryption.generateAuthToken(criteriaForJWT);
  return { authToken };
};

const checkEmailResolver = async (_, { checkEmailInput }) => {
  const { email } = checkEmailInput;
  let user = await User.findOne({ email }).lean();
  if (user) {
    return true;
  } else return false;
};

const getProfileResolver = async (_, { _id }) => {
  let user = await User.findById(_id).select({ password: 0 }).lean();

  if (user) return user;
  throwGraphQLError(messages.user.user_not_found);
};

const me = async (_, __, contextValue) => {
  let user = await User.findById(contextValue[CONTEXT_USER_KEY])
    .select({ password: 0 })
    .lean();

  if (user) return user;
  throwGraphQLError(messages.user.user_not_found);
};

const createUserMutationResolver = async (_, { createUserInput }) => {
  let user = await User.findOne({ email: createUserInput.email });
  if (user) {
    throwGraphQLError(messages.user.user_exist, 403);
  }
  createUserInput.password = await encryption.hashPasswordUsingBcrypt(
    createUserInput.password
  );

  user = await User.create(createUserInput);
  const criteriaForJWT = {
    _id: user._id,
  };

  const token = await encryption.generateAuthToken(criteriaForJWT);
  return { token, user };
};

const editUserMutationResolver = async (_, { editUserInput, _id }) => {
  let user = await User.findById(_id).lean();
  Object.keys(editUserInput).forEach((key) => (user[key] = editUserInput[key]));

  user = await User.findByIdAndUpdate(
    _id,
    { $set: user },
    { new: true }
  ).select('-password');

  return user;
};

const changePassword = async (_, { changePasswordInput }, contextValue) => {
  let user = await User.findById(contextValue[CONTEXT_USER_KEY]._id);
  let oldPasswordsMatch = await encryption.comparePasswordUsingBcrypt(
    changePasswordInput.old,
    user.password
  );

  if (!oldPasswordsMatch)
    throwGraphQLError(messages.user.old_password_not_match);
  let newPassword = await encryption.hashPasswordUsingBcrypt(
    changePasswordInput.new
  );
  await User.findByIdAndUpdate(user._id, {
    $set: { password: newPassword },
  });
  return true;
};

module.exports = {
  loginResolver,
  checkEmailResolver,
  getProfileResolver,
  createUserMutationResolver,
  editUserMutationResolver,
  changePassword,
  me,
};
