const User = require("./mongo/schemas/userSchema");
const express = require("express");
const AuthRouter = express.Router();
const dotenv = require("dotenv").config();
const secret = process.env.SECRET;
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

AuthRouter.post("/register", async (req, res) => {
  const body = req.body;
  console.log(body);

  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ error: "No email" });
  }

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return res.status(400).json({ error: "User already registered" });
  } else {
    const newUser = new User({
      name: body.name,
      email: body.email,
      password: body.password,
    });

    const savedUser = await newUser.save();
    if (savedUser) {
      // const msg = {
      //   to: email,
      //   from: "gerardoamadrid@gmail.com", // Change to your verified sender
      //   subject: "Welcome to ToDo App List",
      //   text: "Welcome",
      //   html: `<strong> Hello,  ${req.body.name} we are thrilled to have you onboard 
      //   now get ready to really get things done...</strong>`,
      // };
      // sgMail
      //   .send(msg)
      //   .then(() => {
      //     console.log("Email sent");
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //   });

      return res.status(200).json({
        token: savedUser.generateJWT(),
        user: {
          name: savedUser.name,
          email: savedUser.email,
          id: savedUser.id,
        },
      });
    } else {
      return res.status(400).json({ error: "Error on generating new user" });
    }
  }
});

AuthRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email or Password missing" });
  }

  try {
    const foundUser = await User.findOne({ email: email });
    if (!foundUser) {
      return res.status(400).json({ error: "Invalid Email please try again" });
    }

    // Compare the password entered by the user with the hashed password stored in the database
    const isPasswordValid = foundUser.comparePassword(password);
    if (!isPasswordValid) {
      // Invalid password
      return res
        .status(400)
        .json({ error: "Invalid Password please try again" });
    }

    // Password is valid, generate token and return user data

    return res.status(200).json({
      token: foundUser.generateJWT(),
      user: {
        name: foundUser.name,
        email: foundUser.email,
        id: foundUser.id,
      },
    });
  } catch (error) {
    // Handle any potential errors
    return res.status(500).json({ error: "Server Error" });
  }
});

const jwtMiddleware = (req, res, next) => {
  // Recogemos el header "Authorization". Sabemos que viene en formato "Bearer XXXXX...",
  // así que nos quedamos solo con el token y obviamos "Bearer "
  const authHeader = req.headers["authorization"];

  if (!authHeader)
    return res.status(401).json({ error: "Unauthorized MISSING HEADER" });
  const token = authHeader.split(" ")[1];
  // Si no hubiera token, respondemos con un 401
  if (!token)
    return res.status(401).json({ error: "Unauthorized and missing token" });

  let tokenPayload;

  try {
    // Si la función verify() funciona, devolverá el payload del token
    tokenPayload = JWT.verify(token, secret);
  } catch (error) {
    // Si falla, será porque el token es inválido, por lo que devolvemo error 401
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Guardamos los datos del token dentro de req.jwtPayload, para que esté accesible en los próximos objetos req
  req.payload = tokenPayload;
  next();
};

module.exports = { AuthRouter, jwtMiddleware };
