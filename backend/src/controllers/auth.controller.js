const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });

const sanitize = (e) => ({ id: e._id, name: e.name, email: e.email });

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'name, email and password are required' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const employee = await Employee.create({ name, email, password });
    res.status(201).json({
      success: true,
      message: 'Registered successfully',
      token: signToken(employee._id),
      employee: sanitize(employee),
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'email and password are required' });
    }

    const employee = await Employee.findOne({ email: String(email).toLowerCase() }).select('+password');
    if (!employee || !(await employee.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      message: 'Login successful',
      token: signToken(employee._id),
      employee: sanitize(employee),
    });
  } catch (err) {
    next(err);
  }
};