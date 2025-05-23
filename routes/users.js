var express = require('express');
var router = express.Router();
var userControllers = require('../controllers/users');
const { check_authentication, check_authorization } = require("../utils/check_auth");
const constants = require('../utils/constants');

// GET all: Yêu cầu mod
router.get('/', check_authentication, check_authorization(constants.MOD_PERMISSION), async function (req, res, next) {
  try {
    let users = await userControllers.getAllUsers();
    res.send({ success: true, data: users });
  } catch (error) {
    next(error);
  }
});

// GET by ID: Yêu cầu mod, trừ chính user
router.get('/:id', check_authentication, check_authorization(constants.MOD_PERMISSION), async function (req, res, next) {
  try {
    if (req.user.id === req.params.id) {
      return res.status(403).send({ success: false, message: "Không thể xem thông tin của chính bạn qua route này" });
    }
    let user = await userControllers.getUserById(req.params.id);
    if (!user) throw new Error("User not found");
    res.send({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// POST: Yêu cầu admin
router.post('/', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let body = req.body;
    let newUser = await userControllers.createAnUser(body.username, body.password, body.email, body.role);
    res.status(200).send({ success: true, data: newUser });
  } catch (error) {
    next(error);
  }
});

// PUT: Yêu cầu admin
router.put('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let updatedUser = await userControllers.updateAnUser(req.params.id, req.body);
    res.status(200).send({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
});

// DELETE: Yêu cầu admin
router.delete('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let deleteUser = await userControllers.deleteAnUser(req.params.id);
    res.status(200).send({ success: true, data: deleteUser });
  } catch (error) {
    next(error);
  }
});

module.exports = router;