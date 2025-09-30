// authRoutes.js
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./User.js";
import { authMiddleware } from "./authMiddleware.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Faltan campos" });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "El correo ya está registrado" });

    const user = new User({ name, email, password });
    await user.save();

    return res.json({ ok: true, message: "Usuario creado" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error al registrar" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Credenciales inválidas" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Credenciales inválidas" });

    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res.json({ token, name: user.name, email: user.email });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  const u = await User.findById(req.user.userId).select("_id name email");
  return res.json(u);
});

export default router;
