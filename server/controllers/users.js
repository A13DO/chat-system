
const User = require('../models/user');

const users = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Errorسشيسي' });
    }
};

// Get user by ID (new function)
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id; // Get the user ID from the request parameters

        // Validate the ID (optional but recommended)
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Find the user by ID and exclude the password field
        const user = await User.findById(userId).select('-password');

        // If the user is not found, return a 404 error
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the user details
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { users, getUserById }; // Export both functions