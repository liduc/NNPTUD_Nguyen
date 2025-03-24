let userSchema = require('../schemas/user')
let roleSchema = require('../schemas/role');
let bcrypt = require('bcrypt')
module.exports = {
    getAllUsers: async function () {
        return userSchema.find({})
    },
    getUserById: async function (id) {
        return userSchema.findById(id)
    },
    createAnUser: async function (username, password, email, roleI) {
        
        let role = await roleSchema.findOne({
            name: roleI
        })
        if (role) {
            let newUser = new userSchema({
                username: username,
                password: password,
                email: email,
                role: role._id
            })
            return await newUser.save();

        } else {
            throw new Error('role khong ton tai')
        }

    },
    updateAnUser: async function(id,body){
        let updatedUser = await this.getUserById(id);
        let allowFields = ["password","email"];
        for (const key of Object.keys(body)) {
            if(allowFields.includes(key)){
                updatedUser[key] = body[key]
            }
        }
        await updatedUser.save();
        return updatedUser;
    },
    deleteAnUser: async function(id){
        let updatedUser = await userSchema.findByIdAndUpdate(
            id,{
                status:false
            },{new:true}
        )
        return updatedUser;
    }
}