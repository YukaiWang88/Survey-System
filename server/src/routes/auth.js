const usesMockDB = () => global.mockDB !== undefined;
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Update your register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Use mock DB if MongoDB is not available
    if (usesMockDB()) {
      console.log('Using mock DB for registration');
      
      // Check if user exists
      const existingUser = global.mockDB.users.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Create mock user with ID
      const mockUser = {
        _id: Date.now().toString(),
        name,
        email,
        password: `hashed_${password}`, // Simulate hashed password
        createdAt: new Date()
      };
      
      global.mockDB.users.push(mockUser);
      console.log('Created mock user:', mockUser);
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: mockUser._id },
        process.env.JWT_SECRET || '665eced222ba5d45aa7e3774cc8d30bb4fc122be7ef6c9e6ec31996bdd78e184a00460c1ab1436c615016dcfc4ece66d3f581fc41c7380adf154a850149ab7c7',
        { expiresIn: '7d' }
      );
      
      return res.status(201).json({
        token,
        user: {
          id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email
        }
      });
    }
    
    // Regular MongoDB flow
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || '665eced222ba5d45aa7e3774cc8d30bb4fc122be7ef6c9e6ec31996bdd78e184a00460c1ab1436c615016dcfc4ece66d3f581fc41c7380adf154a850149ab7c7',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update your login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Use mock DB if MongoDB is not available
    if (usesMockDB()) {
      console.log('Using mock DB for login');
      
      // Find user
      const user = global.mockDB.users.find(u => u.email === email);
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      // Simple password check (mock)
      const isMatch = user.password === `hashed_${password}`;
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || '665eced222ba5d45aa7e3774cc8d30bb4fc122be7ef6c9e6ec31996bdd78e184a00460c1ab1436c615016dcfc4ece66d3f581fc41c7380adf154a850149ab7c7',
        { expiresIn: '7d' }
      );
      
      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    }
    
    // Regular MongoDB flow
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || '665eced222ba5d45aa7e3774cc8d30bb4fc122be7ef6c9e6ec31996bdd78e184a00460c1ab1436c615016dcfc4ece66d3f581fc41c7380adf154a850149ab7c7',
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update your verify route
router.get('/verify', async (req, res) => {
  try {
    if (!req.header('Authorization')) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
    
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || '665eced222ba5d45aa7e3774cc8d30bb4fc122be7ef6c9e6ec31996bdd78e184a00460c1ab1436c615016dcfc4ece66d3f581fc41c7380adf154a850149ab7c7'
    );
    
    // Use mock DB if MongoDB is not available
    if (usesMockDB()) {
      console.log('Using mock DB for verify');
      
      const user = global.mockDB.users.find(u => u._id === decoded.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Exclude password
      const { password, ...userWithoutPassword } = user;
      
      return res.json({ user: userWithoutPassword });
    }
    
    // Regular MongoDB flow
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ user });
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: "Please authenticate" });
  }
});