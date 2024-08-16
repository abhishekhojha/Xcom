const User = require('../model/UserModel')
async function UserRegister(req, res) {
    try {
        const data = req.body;
        console.log(data)
        const userExists = await User.findOne({ email: data.email })
        if (userExists) {
            return res.status(401).json({ message: 'User Exists' });
        }
        const newUser = new User({
            name: data.name,
            email: data.email,
            admin: true,
            password: data.password
        })
        try {
            await newUser.save()
            return res.status(201).json({ message: 'Account Created successfully', user: newUser })
        } catch (error) {
            return res.status(409).json({ message: "Some error occured while creating the account" })
        }
    } catch (error) {
        return res.status(409).json({ message: error.message });
    }
}
async function Login(req, res) {
    try {
        const data = req.body;
        const userExists = await User.findOne({ email: data.email });
        if (!userExists) {
            return res.status(401).json({ message: "Invalid user" });
        }
        userExists.comparePassword(data.password, (err,isMatch) => {
            if(err || !isMatch)
                return res.status(401).json({message:"Password did not matched"})
            const Token = userExists.generateToken()
            return res.status(201).json({message:"Login Successful",token:Token})
        })
        
    } catch (error) {
        return res.status(409).json({ message: error.message });
    }
}
async function GetUsers(req,res){
    try {
        const users = await User.find({});
        if(!users)
            return res.status(404).json({message:"Users not found"})
        return res.status(201).json({message:"Users fetch succesfully",data:users})
    } catch (error) {
        return res.status(409).json({message:error.message})
    }
}
module.exports = { UserRegister, Login, GetUsers }