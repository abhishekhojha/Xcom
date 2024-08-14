const User = require('../model/UserModel')
async function UserRegister(req,res){
    const userExists = await User.findOne({email:data.email})
    if(userExists){
        return res.status(401).json({ message: 'Invalid user' });
    }
    const newUser = new User({
        name:data.name,
        email:data.email,
        admin:true,
        password:data.password
    })
}