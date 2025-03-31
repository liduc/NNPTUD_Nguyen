let jwt = require('jsonwebtoken');
let constants = require('./constants');
var userControllers = require('../controllers/users');

module.exports = {
  check_authentication: async function (req, res, next) {
    if (!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
      return next(new Error("Bạn chưa đăng nhập"));
    }
    
    let token = req.headers.authorization.split(" ")[1];
    try {
      let result = jwt.verify(token, constants.SECRET_KEY);
      if (result.expireIn < Date.now()) {
        return next(new Error("Token đã hết hạn"));
      }
      
      let user = await userControllers.getUserById(result.id);
      if (!user) {
        return next(new Error("User không tồn tại"));
      }
      
      req.user = user; // Gán toàn bộ object user vào req.user
      next();
    } catch (error) {
      next(new Error("Token không hợp lệ"));
    }
  },
  check_authorization: function (roles) {
    return function (req, res, next) {
      let roleOfUser = req.user.role?.name || req.user.role; // Hỗ trợ cả role là object hoặc string
      if (!roleOfUser || !roles.includes(roleOfUser)) {
        return next(new Error("Bạn không có quyền"));
      }
      next();
    };
  }
};