const { User } = require('../db/models')

const validateUserId = async (id, res) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if(!uuidRegex.test(id)){
        return res.status(400).json({
            status: "failed", 
            message: "Invalid UUID character length/type"
        })
    }

    const userById = await User.findByPk(id)
    if(!userById){
        return res.status(404).json({
            status: "failed", 
            message: "Found no user matching supplied ID"
        })
    }
    return userById
}

const validateUserPayloadInsert = async (full_name, email, res, excludeUserId = null) => {
    if(!full_name || !email){
        return res.status(400).json({
            status: 'failed', 
            message: 'Please provide full name and email'
        })
    }
    const existingUser = await User.findOne({where: { email }})
    if( existingUser && existingUser.id !== excludeUserId ){
        return res.status(400).json({
            status: "failed",
            message: "This email is already registered by a another user, please enter a different email"
        })
    }
    return true
}

const validateUserPayloadUpdate = async (email, res, excludeUserId = null) => {

    if (!email) return true
    
    const existingUser = await User.findOne({where: { email }})
    if( existingUser && existingUser.id !== excludeUserId ){
        return res.status(400).json({
            status: "failed",
            message: "This email is already registered by a another user, please enter a different email"
        })
    }
    return true
}

module.exports = { validateUserId, validateUserPayloadInsert, validateUserPayloadUpdate }
    