import instituteUser from "../models/instituteSchema.js";

const loginUser = async (req , res) => {
    const { email , password, role } = req.body;
    const user = await instituteUser.findOne({email})

    if(user && await user.matchPasswords(password) &&  user.role.toLowerCase() === role.toLowerCase()){
        res.status(200).json({message : "Login Successful for Institute" , user : user})
    }else {
        res.status(401).json({message: 'No user found'})
    }
}

const registerUser = async (req , res) => {
    const {role , email , password} = req.body
    const userExists = await instituteUser.findOne({email , role})

    if(userExists){
        res.status(400)
        throw new Error('User already exists')
    }

    const user = await instituteUser.create({
        role , 
        email , 
        password
    })

    if(user) {
        res.status(201).json({
            message : "User created successfully for Institute",
            _id: user._id,
            name: user.name,
            email: user.email,
        })
    }
    else {
        res.status(400)
        throw new Error('Invalid user data')
    }
}

export {
    loginUser,
    registerUser
}