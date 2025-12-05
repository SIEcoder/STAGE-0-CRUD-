const { User } = require('../db/models')
const { validateUserId, validateUserPayload } = require('../utils/validateUser')
const express = require('express')

const getUsers = async (req, res) => {
    const users = await User.findAll()
    res.status(200).json({
        status: 'successful', 
        data: users
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
    const validatedPayload = await validateUserPayload(full_name, email, res)
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

    const validatedPayload = await validateUserPayload(full_name, email, res, userToUpdate.id)
    if(!validatedPayload) return

    userToUpdate.full_name = full_name
    userToUpdate.email = email
    userToUpdate.stage = stage

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