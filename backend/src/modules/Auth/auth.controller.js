import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

//____________________________________ Register ____________________________________
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.cookie("token", token, {
      httpOnly: true, // ← آمن ضد XSS
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 أيام
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//____________________________________ Login ____________________________________
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
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ____________________________________ Get current user (protected) ____________________________________
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//____________________________________ Logout ____________________________________
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // لو في production خلي true
    sameSite: "lax",
  });
  res.json({ success: true, message: "تم تسجيل الخروج بنجاح" });
};

//____________________________________ Update user profile ____________________________________
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

//  __________________________________ Get All Users by Owner ____________________________________
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  __________________________________ Delete User by Owner ____________________________________
export const deleteUser = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOneAndDelete({ email });
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });
    res.json({ message: "تم حذف المستخدم بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  __________________________________ Make Admin by Owner ____________________________________
export const makeAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });
    res.json({ message: "تم تحويل المستخدم إلى أدمن بنجاح", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
