const User = require("./model");
const encryption = require("../../utils/encryption");
const responses = require("../../utils/responses");
const messages = require("../../utils/messages");
const common = require("../../utils/common");

class UserController {
  async create(data, res) {
    try {
      const requiredFields = ["firstName", "userName", "password"];
      if (!common.checkKeys(data.body, requiredFields)) {
        return responses.sendBadRequest(res, data.url);
      }
      let user = await User.findOne({ userName: data.body.userName });
      if (user) {
        return responses.sendForbidden(res, data.url, messages.user.user_exist);
      }
      data.body.password = await encryption.hashPasswordUsingBcrypt(
        data.body.password
      );
      user = await User.create(data.body);
      return responses.sendSuccess(res, null, messages.user.user_created);
    } catch (err) {
      return responses.sendServerError(res, data.url, err);
    }
  }
  async login(data, res) {
    try {
      const requiredFields = ["userName", "password"];
      if (!common.checkKeys(data.body, requiredFields)) {
        return responses.sendBadRequest(res, data.url);
      }
      const { userName, password } = data.body;
      let user = await User.findOne({
        $or: [{ userName }, { email: userName }],
      });

      if (!user) {
        return responses.sendNotFound(
          res,
          data.url,
          messages.user.user_not_found
        );
      }
      let validPassword = await encryption.comparePasswordUsingBcrypt(
        password,
        user.password
      );
      if (validPassword) {
        const criteriaForJWT = {
          _id: user._id,
          date: new Date(),
        };

        const token = await encryption.generateAuthToken(criteriaForJWT);
        res.cookie("Authorization", token, {});
        return responses.sendSuccess(
          res,
          { token },
          messages.auth.login_success
        );
      } else {
        return responses.sendUnauthorized(
          res,
          data.url,
          messages.auth.invalid_credentials
        );
      }
    } catch (err) {
      return responses.sendServerError(res, data.url, err);
    }
  }
  async profile(data, res) {
    try {
      let user = await User.findById(data.user._id).select({ password: 0 });

      if (user)
        return responses.sendSuccess(res, user, messages.constant.retrive);
      return responses.sendNotFound(
        res,
        data.url,
        messages.user.user_not_found
      );
    } catch (e) {
      return responses.sendServerError(res, data.url);
    }
  }
  async edit(data, res) {
    try {
      let body = data.body;
      delete body.password;
      delete body.userName;

      let user = await User.findByIdAndUpdate(
        data.params.userId,
        { $set: body },
        { new: true }
      ).select("-password");

      return responses.sendSuccess(res, user, messages.user.user_updated);
    } catch (e) {
      return responses.sendServerError(res, data.url);
    }
  }
  async changePassword(data, res) {
    try {
      let user = await User.findById(data.user._id);
      let oldPassword = data.body.old;
      let newPassword = data.body.new;

      let oldPasswordsMatch = await encryption.comparePasswordUsingBcrypt(
        oldPassword,
        user.password
      );
      if (!oldPasswordsMatch) {
        return responses.sendForbidden(
          res,
          data.url,
          messages.user.old_password_not_match
        );
      }
      newPassword = await encryption.hashPasswordUsingBcrypt(newPassword);
      await User.findByIdAndUpdate(user._id, {
        $set: { password: newPassword },
      });
      return responses.sendSuccess(res, {}, messages.user.password_updated);
    } catch (e) {
      return responses.sendServerError(res, data.url);
    }
  }
  async checkUserName(data, res) {
    try {
      let user = await User.findOne({ userName: data.body.userName });

      if (user) {
        return responses.sendForbidden(
          res,
          data.url,
          messages.user.username_exists
        );
      }

      return responses.sendSuccess(res, messages.user.username_available);
    } catch (err) {
      returnresponse.sendSystemError(res, err);
    }
  }
}

module.exports = new UserController();
