// Get information about the currently logged in user
exports.getProfile = (req, res) => {
    // authMiddleware has authenticated the user and attached the user object to req.user
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    // Return user information (sensitive information such as passwords has been filtered out in the middleware)
    res.json(req.user);
  };
  
