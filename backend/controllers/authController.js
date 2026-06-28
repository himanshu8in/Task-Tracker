const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT token helper
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET || "focusflow_secret_key_987654321",
        { expiresIn: "30d" }
    );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Validation checks
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                error: "Please enter all registration fields"
            });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                error: "User already exists with this email"
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        // Generate token and respond
        const token = generateToken(user._id);
        res.status(201).json({
            success: true,
            token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validation checks
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Please enter email and password"
            });
        }

        // Check for user
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                error: "Invalid email or password"
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: "Invalid email or password"
            });
        }

        // Generate token and respond
        const token = generateToken(user._id);
        res.status(200).json({
            success: true,
            token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    OAuth Login / Signup (Google & GitHub)
// @route   POST /api/auth/oauth
// @access  Public
exports.oauthLogin = async (req, res, next) => {
    try {
        const { name, email, provider, providerId, avatar } = req.body;

        if (!email || !provider || !providerId) {
            return res.status(400).json({
                success: false,
                error: "Missing vital OAuth parameters"
            });
        }

        // Find user by provider ID or email
        let query = {};
        if (provider === "google") {
            query.googleId = providerId;
        } else if (provider === "github") {
            query.githubId = providerId;
        }

        let user = await User.findOne(query);

        if (!user) {
            // Check if user already exists with the same email
            user = await User.findOne({ email });

            if (user) {
                // User exists by email, link the provider account
                if (provider === "google") {
                    user.googleId = providerId;
                } else if (provider === "github") {
                    user.githubId = providerId;
                }
                if (avatar && !user.avatar) {
                    user.avatar = avatar;
                }
                await user.save();
            } else {
                // User does not exist, create a new one
                const userFields = {
                    name,
                    email,
                    avatar: avatar || ""
                };
                if (provider === "google") {
                    userFields.googleId = providerId;
                } else if (provider === "github") {
                    userFields.githubId = providerId;
                }
                
                user = await User.create(userFields);
            }
        }

        const token = generateToken(user._id);
        res.status(200).json({
            success: true,
            token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};
