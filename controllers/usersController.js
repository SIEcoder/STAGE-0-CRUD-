const { User } = require('../db/models')
const { validateUserId, validateUserPayloadInsert, validateUserPayloadUpdate } = require('../utils/validateUser')

const getUsers = async (req, res) => {
    const { page, limit  } = req.query

    const pageNumber = Math.max(Number(page) || 1, 1)
    const pageLimit = Math.max(Number(limit) || 2, 1)

    const offset = (pageNumber - 1) * pageLimit

    const result = await User.findAndCountAll({
        limit: pageLimit, 
        offset: offset
    })
    return res.status(200).json({
        status: 'successful', 
        totalRecords: result.count,
        totalPages: Math.ceil(result.count / pageLimit),
        data: result.rows, 
        page: pageNumber, 
        limit: pageLimit
    })
}
const getUserById = async (req, res) => {
    const { id } = req.params
    const userById = await validateUserId(id, res)
    if(!userById) return
    res.status(200).json({
        status: 'successful', 
        data: userById
    })
}
const insertUser = async (req, res) => {
    const { full_name, email, stage } = req.body
    const validatedPayload = await validateUserPayloadInsert(full_name, email, res)
    if(!validatedPayload) return
    const newUser = await User.create({
        full_name: full_name, 
        email: email, 
        stage: stage
    })
    res.status(201).json({
        status: 'successful', 
        data: newUser
    })
}
const updateUser = async (req, res) => {
    const { id } = req.params
    const { full_name, email, stage } = req.body 

    const userToUpdate = await validateUserId(id, res)
    if(!userToUpdate) return

    const validatedPayload = await validateUserPayloadUpdate(email, res, userToUpdate.id)
    if(!validatedPayload) return

    if(full_name){
        userToUpdate.full_name = full_name
    }
    if(email){
        userToUpdate.email = email
    }
    if(stage){
        userToUpdate.stage = stage
    }

    await userToUpdate.save()
    res.status(200).json({
        status: "successful", 
        data: userToUpdate
    })
}
const deleteUser = async (req, res) => {
    const { id } = req.params
    const userToDelete = await validateUserId(id, res)
    if(!userToDelete) return
    await User.destroy({
        where: { id: id}
    })
    res.status(200).json({
        status: "successful", 
        message: "User deleted!"
    })
}






module.exports = { 
    getUsers,
    getUserById, 
    insertUser,
    updateUser, 
    deleteUser  
};