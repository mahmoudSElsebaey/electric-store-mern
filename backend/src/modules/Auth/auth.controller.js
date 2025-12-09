import jwt from "jsonwebtoken";
import User from "../../models/auth.model.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "بيانات الدخول غير صحيحة" });
    }

    const token = signToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user (protected)
export const getMe = async (req, res) => {
  res.json({ user: req.user });
};
 


export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const allowedFields = ["name", "email", "phone", "address"];
    const filteredUpdates = {};

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, filteredUpdates, {
      new: true,
      runValidators: true
    }).select("-password");

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};