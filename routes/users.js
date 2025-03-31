var express = require('express');
const { token } = require('morgan');
var router = express.Router();
var userControllers = require('../controllers/users')
let jwt = require('jsonwebtoken');
const constants = require('../utils/constants');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    if (!req.headers || !req.headers.authorization) {
      throw new Error("ban chua dang nhap")
    }
    if (!req.headers.authorization.startsWith("Bearer")) {
      throw new Error("ban chua dang nhap")
    }
    let token = req.headers.authorization.split(" ")[1];
    let result = jwt.verify(token, constants.SECRET_KEY);
    let user_id = result.id;
    if (result.expireIn > Date.now()) {
      let users = await userControllers.getAllUsers()
      res.send({
        success: true,
        data: users
      });
    } else {
      throw new Error("token het han")
    }
  } catch (error) {
    next(error)
  }
});
router.post('/', async function (req, res, next) {
  try {
    let body = req.body;
    let newUser = await userControllers.createAnUser(
      body.username,
      body.password,
      body.email,
      body.role
    )
    res.status(200).send({
      success: true,
      message: newUser
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }

});
router.put('/:id', async function (req, res, next) {
  try {
    let body = req.body;
    let updatedUser = await userControllers.updateAnUser(req.params.id, body);
    res.status(200).send({
      success: true,
      message: updatedUser
    });
  } catch (error) {
    next(error)
  }
});
router.delete('/:id', async function (req, res, next) {
  try {
    let deleteUser = await userControllers.deleteAnUser(req.params.id);
    res.status(200).send({
      success: true,
      message: deleteUser
    });
  } catch (error) {
    next(error)
  }

});
module.exports = router;
