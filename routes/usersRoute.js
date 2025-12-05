const express = require('express')
const { getUsers,
      getUserById, 
      insertUser,
      updateUser,
      deleteUser} = require('../controllers/usersController')
const router = express.Router()

router.route('/').get(getUsers).post(insertUser)
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser)


module.exports = router