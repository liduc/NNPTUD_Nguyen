var express = require('express');
var router = express.Router();
let userControllers = require('../controllers/users')
let jwt = require('jsonwebtoken')
let constants = require("../utils/constants")


router.post('/login', async function (req, res, next) {
    try {
        let username = req.body.username;
        let password = req.body.password;
        let result = await userControllers.checkLogin(username, password);
        res.status(200).send({
            success: true,
            data: jwt.sign({
                id: result,
                expireIn: (new Date(Date.now() + 3600 * 1000)).getTime()
            }, constants.SECRET_KEY)
        })
    } catch (error) {
        next(error)
    }
});
router.post('/signup', async function (req, res, next) {
    try {
        let username = req.body.username;
        let password = req.body.password;
        let email = req.body.email;
        let result = await userControllers.createAnUser(username, password,
            email, 'user');
        res.status(200).send({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
});
router.get('/me', async function (req, res, next) {
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
          let user = await userControllers.getUserById(user_id)
          res.send({
            success: true,
            data: user
          });
        } else {
          throw new Error("token het han")
        }
      } catch (error) {
        next(error)
      }
});

module.exports = router