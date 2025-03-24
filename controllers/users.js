let userSchema = require('../schemas/user')
let roleSchema = require('../schemas/role');
module.exports = {
    getAllUsers: async function () {
        return userSchema.find({})
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
            throw new Error('user khong ton tai')
        }

    },
    updateAnUser: async function(id,body){
        let updateObject = {};
        let allowFields = ["password","email"];
        for (const key of Object.keys(body)) {
            if(allowFields.includes(key)){
                updateObject[key] = body[key]
            }
        }
        console.log(updateObject);
        let updatedUser = await userSchema.findByIdAndUpdate(
            id,updateObject,{new:true}
        )
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