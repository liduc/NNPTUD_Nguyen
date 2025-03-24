let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "username da ton tai"],
        required: true
    },
    password: {
        type: String,
        required: true
    }, email: {
        type: String,
        required: true,
        unique: true,
    }, fullName: {
        type: String,
        default: ""
    }, avatarUrl: {
        type: String,
        default: ""
    }, status: {
        type: Boolean,
        default: false
    }, role: {
        type: mongoose.Types.ObjectId,
        ref: 'role',
        required: true
    }, loginCount: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
})
module.exports= mongoose.model('user',userSchema)
