// controllers/userController.js

exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.status(200).json(req.user);
  } catch (error) {
    logger.error(`Get current user error: ${error.message}\n${error.stack}`);
    res.status(500).json({ message: 'Failed to retrieve user', error: error.message });
  }
};
