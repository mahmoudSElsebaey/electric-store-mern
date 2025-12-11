import jwt from "jsonwebtoken";
import User from "../../models/auth.model.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.cookie("token", token, {
      httpOnly: true, // ← آمن ضد XSS
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 أيام
    });

    res.status(201).json({
      success: true,
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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "بيانات الدخول غير صحيحة" });
    }

    const token = signToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
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
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // لو في production خلي true
    sameSite: "lax",
  });
  res.json({ success: true, message: "تم تسجيل الخروج بنجاح" });
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const allowedFields = [
      "name",
      "email",
      "phone",
      "address",
      "birthdate",
      "additionalInfo", // ← مهم جدًا
    ];

    const filteredUpdates = {};
    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    // لو birthdate فاضي نحوله لـ null
    if (filteredUpdates.birthdate === "") {
      filteredUpdates.birthdate = null;
    }

    const user = await User.findByIdAndUpdate(req.user._id, filteredUpdates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

    res.json({ success: true, user });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(400).json({ message: error.message || "خطأ في تحديث البيانات" });
  }
};
