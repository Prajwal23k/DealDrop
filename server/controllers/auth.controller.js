import { User } from "../models/user.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function register(req, res) {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const password = req.body.password;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required !!" });
        }

        const existing_email = await User.findOne({ email });
        if (existing_email) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const hashed_pass = await bcrypt.hash(password, 10);

        const user = await User.create(
            {
                name: name,
                email: email,
                phone: phone,
                password: hashed_pass
            }
        );

        return res.status(201).json({
            message: "User registered successfully !!",
            userID: user._id,
            role: user.role
        });
    } catch (e) {
        console.error("Registration Failed", e.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function login(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).json({ message: " All fields are required !!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Email does not exists" });
    }

    if (user.isBlocked) {
        return res.status(403).json({ message: "User is blocked by admin" });
    }

    const isSame = await bcrypt.compare(password, user.password);
    if(!isSame)
    {
        return res.status(401).json({message : "Invalid Password"});
    }

    const token =jwt.sign(
            {
                userId : user._id,
                role : user.role 
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn : "1d"
            }
    );

    return res.status(200).json({
        message : "Login Successful !!",
        token,
        userId : user._id,
        role : user.role
    })
}

export { register, login };