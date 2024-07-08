import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import Organisation from "../models/organisation.models.js";

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(422).json({
        errors: [{ field: "email", message: "Email already exists" }],
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    });

    // Create default organisation
    const orgName = `${firstName}'s Organisation`;
    await Organisation.create(
      {
        name: orgName,
        description: `${firstName}'s default organisation`,
        Users: [user],
      },
      {
        include: [User],
      }
    );

    // Generate JWT token
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad request",
      message: "Registration unsuccessful",
      statusCode: 400,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: "Bad request",
        message: "Authentication failed",
        statusCode: 401,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "Bad request",
        message: "Authentication failed",
        statusCode: 401,
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(401).json({
      status: "Bad request",
      message: "Authentication failed",
      statusCode: 401,
    });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User fetched successfully",
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad request",
      message: "Unable to fetch user",
      statusCode: 400,
    });
  }
};

export { registerUser, loginUser, getUser };
