require('dotenv').config({ path: `${process.cwd()}/.env`})
const express = require('express')
const usersRoute = require('./routes/usersRoute')
const app = express()

app.use(express.json())
//app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/users', usersRoute)

app.use((req, res, next) => {
    res.status(404).json({
        status: "failed", 
        message: "Resource doesn't exist"
    })
})

const PORT = process.env.APP_PORT || 4000

app.listen(PORT, () => {
    console.log(`Server up and running on port ${PORT}....`)
})