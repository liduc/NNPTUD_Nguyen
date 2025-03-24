var express = require('express');
var router = express.Router();
var userControllers = require('../controllers/users')

/* GET users listing. */
router.get('/', async function (req, res, next) {
  let users = await userControllers.getAllUsers()
  res.send({
    success: true,
    data: users
  });
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
    let updatedUser = await userControllers.updateAnUser(req.params.id,body);
    res.status(200).send({
      success: true,
      message: updatedUser
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
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
    res.status(404).send({
      success: false,
      message: error.message
    });
  }

});
module.exports = router;
