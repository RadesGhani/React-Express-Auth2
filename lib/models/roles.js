const mongoose = require ("mongoose")

const userSchema = new mongoose.Schema ({
    role_name: {
        type: String,
        required: true,
        unique: true
    },
    acl: {
        type: Array,
        required: true
    }
})

const Role = mongoose.model("role", userSchema)

module.exports = Role