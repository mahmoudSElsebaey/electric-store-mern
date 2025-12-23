 
import { OAuth2Client } from 'google-auth-library';
import User from '../../models/user.model.js';
import jwt from 'jsonwebtoken';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body; // الـ ID Token اللي جاي من الفرونت

    if (!credential) {
      return res.status(400).json({ message: 'التوكن مفقود' });
    }

    // التحقق من التوكن
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({ message: 'فشل التحقق من حساب جوجل' });
    }

    let user = await User.findOne({ email: payload.email });

    // لو المستخدم مش موجود → ننشئ واحد جديد
    if (!user) {
      user = await User.create({
        name: payload.name || 'مستخدم جوجل',
        email: payload.email,
        googleId: payload.sub, // google user ID
        // اختياري: لو عايز تضيف الصورة
        // image: payload.picture,
        // مش هنخزن باسورد لأنها تسجيل اجتماعي
      });
    }

    // إنشاء JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // إرسال الكوكيز (نفس طريقتك الحالية)
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
      },
    });
  } catch (error) {
    console.error('Google Login Error:', error);
    res.status(401).json({
      message: 'فشل تسجيل الدخول بحساب جوجل، حاول مرة أخرى',
    });
  }
};