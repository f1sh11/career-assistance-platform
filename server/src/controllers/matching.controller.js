const User = require('../models/user.model');
const fs = require('fs');
const path = require('path');

const logDirectory = path.join(__dirname, '../../src/logs');

// Get recommended mentors, alumni, and industry professionals
exports.getRecommendations = async (req, res) => {
  try {
    // Get recommendations based on user role
    if (req.user.role === 'student') {
      // Get mentors
      const mentors = await User.find({ role: 'mentor' })
        .select('_id role profile')
        .limit(4);
        
      // Get alumni (simplified to get other students, actual application may require more complex logic)
      const alumni = await User.find({ 
        role: 'student',
        _id: { $ne: req.user._id }
      })
        .select('_id role profile')
        .limit(4);
        
      // Get industry professionals
      const professionals = await User.find({ role: 'industry' })
        .select('_id role profile')
        .limit(4);
      
      // Record recommendation request log
      fs.appendFileSync(
        path.join(logDirectory, 'matching.log'),
        `${new Date().toISOString()} - User ${req.user._id} (student) requested recommendation list\n`
      );
      
      res.status(200).json({
        mentors,
        alumni,
        professionals
      });
    } else if (req.user.role === 'mentor') {
      // Mentor sees students
      const students = await User.find({ role: 'student' })
        .select('_id role profile')
        .limit(8);
      
      // Record recommendation request log
      fs.appendFileSync(
        path.join(logDirectory, 'matching.log'),
        `${new Date().toISOString()} - User ${req.user._id} (mentor) requested recommendation list\n`
      );
      
      res.status(200).json({
        students
      });
    } else if (req.user.role === 'industry') {
      // Industry professionals see students and mentors
      const students = await User.find({ role: 'student' })
        .select('_id role profile')
        .limit(6);
        
      const mentors = await User.find({ role: 'mentor' })
        .select('_id role profile')
        .limit(3);
      
      // Record recommendation request log
      fs.appendFileSync(
        path.join(logDirectory, 'matching.log'),
        `${new Date().toISOString()} - User ${req.user._id} (industry professional) requested recommendation list\n`
      );
      
      res.status(200).json({
        students,
        mentors
      });
    } else {
      // Admin can see everyone
      const users = await User.find({ _id: { $ne: req.user._id } })
        .select('_id role profile')
        .limit(10);
      
      // Record recommendation request log
      fs.appendFileSync(
        path.join(logDirectory, 'matching.log'),
        `${new Date().toISOString()} - User ${req.user._id} (admin) requested recommendation list\n`
      );
      
      res.status(200).json({
        users
      });
    }
  } catch (error) {
    // Record error to log
    fs.appendFileSync(
      path.join(logDirectory, 'error.log'),
      `${new Date().toISOString()} - Get recommendation error: ${error.message}\n${error.stack}\n`
    );
    
    res.status(500).json({ message: 'Get recommendation failed', error: error.message });
  }
};

// Create connection
exports.createConnection = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'No user ID provided' });
    }
    
    // Ensure the connected user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User does not exist' });
    }
    
    // Ensure not connecting to oneself
    if (req.user._id.toString() === userId) {
      return res.status(400).json({ message: 'Cannot connect to oneself' });
    }
    
    // Check if connection already exists
    const currentUser = await User.findById(req.user._id);
    if (currentUser.connections.includes(userId)) {
      return res.status(400).json({ message: 'Connection already exists' });
    }
    
    // Add connection to current user
    currentUser.connections.push(userId);
    await currentUser.save();
    
    // Add connection to target user (bidirectional connection)
    targetUser.connections.push(req.user._id);
    await targetUser.save();
    
    // Record connection creation log
    fs.appendFileSync(
      path.join(logDirectory, 'matching.log'),
      `${new Date().toISOString()} - User ${req.user._id} (${req.user.role}) connected with user ${userId} (${targetUser.role})\n`
    );
    
    res.status(200).json({ 
      message: 'Connection successfully created',
      connection: {
        userId: targetUser._id,
        role: targetUser.role,
        profile: targetUser.profile
      }
    });
  } catch (error) {
    // Record error to log
    fs.appendFileSync(
      path.join(logDirectory, 'error.log'),
      `${new Date().toISOString()} - Create connection error: ${error.message}\n${error.stack}\n`
    );
    
    res.status(500).json({ message: 'Create connection failed', error: error.message });
  }
};

// Get all connections for the current user
exports.getConnections = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('connections', '_id role profile');
    
    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }
    
    // Record connection retrieval log
    fs.appendFileSync(
      path.join(logDirectory, 'user.log'),
      `${new Date().toISOString()} - User ${req.user._id} retrieved connection list\n`
    );
    
    res.status(200).json({
      connections: user.connections
    });
  } catch (error) {
    // Record error to log
    fs.appendFileSync(
      path.join(logDirectory, 'error.log'),
      `${new Date().toISOString()} - Get connection error: ${error.message}\n${error.stack}\n`
    );
    
    res.status(500).json({ message: 'Get connection failed', error: error.message });
  }
}; 