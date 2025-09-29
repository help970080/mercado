import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 Registrar usuario
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "El correo ya está registrado" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

// 📌 Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Credenciales inválidas" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Credenciales inválidas" });

    const token = jwt.sign(
      { userId: user._id, username: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

// 📌 Obtener perfil del usuario autenticado
router.get("/me", authMiddleware, (req, res) => {
  try {
    res.json({
      name: req.user.username,
      email: req.user.email
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener perfil" });
  }
});

export default router;
