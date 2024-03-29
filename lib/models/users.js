const mongoose = require ("mongoose")
const bcrypt = require ("bcryptjs")

const userSchema = new mongoose.Schema ({
    method: {
        type: String,
        enum: ["local", "google", "facebook"],
        required: true
    },
    local: {
        email: {
            type: String,
            lowercase: true
        },
        password: {
            type: String
        }
    },
    google: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },
    facebook: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },
    roles: {
        type: Array,
        required: true
    }
})

userSchema.pre("save", async function (next) {
    try {
        if (this.method != "local") next ()
        const salt = await bcrypt.genSalt (10)
        const hashedPass = await bcrypt.hash (this.local.password, salt)
        this.local.password = hashedPass
        next ()
    } catch (error) {
        next (error)
    }
})

userSchema.pre("updateOne", async function (next){
    console.log("pre updateOne triggered")
    if (typeof this._update.roles == "object") next ()
    try {
        const salt = await bcrypt.genSalt (10)
        const hashedPass = await bcrypt.hash (this._update.local.password, salt)
        this._update.local.password = hashedPass
        next ()
    } catch (error) {
        next (error)
    }
})

userSchema.methods.passValidation = async function (rawPass) {
    try {
        return await bcrypt.compare (rawPass, this.local.password)
    } catch (error) {
        throw new Error (error)
    }
}

const User = mongoose.model("user", userSchema)

module.exports = User