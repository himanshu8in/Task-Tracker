const Task = require("../models/Task");

// @desc    Get all tasks for logged in user with filtering, sorting and search
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
    try {
        const { search, status, priority, sortBy, order } = req.query;
        
        // Scope queries to the currently authenticated user
        let query = { user: req.user.id };

        // Search in title and description
        if (search) {
            query.$and = [
                { user: req.user.id },
                {
                    $or: [
                        { title: { $regex: search, $options: "i" } },
                        { description: { $regex: search, $options: "i" } }
                    ]
                }
            ];
        }

        // Filter by status
        if (status && status !== "all") {
            query.status = status;
        }

        // Filter by priority
        if (priority && priority !== "all") {
            query.priority = priority;
        }

        // Build sort object
        let sort = {};
        if (sortBy) {
            const sortOrder = order === "desc" ? -1 : 1;
            sort[sortBy] = sortOrder;
        } else {
            // Default sort: newest created first
            sort.createdAt = -1;
        }

        const tasks = await Task.find(query).sort(sort);
        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTaskById = async (req, res, next) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) {
            return res.status(404).json({
                success: false,
                error: "Task not found"
            });
        }
        res.status(200).json({
            success: true,
            data: task
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;

        const task = await Task.create({
            user: req.user.id, // Attach user ID
            title,
            description,
            status,
            priority,
            dueDate
        });

        res.status(201).json({
            success: true,
            data: task
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
    try {
        let task = await Task.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) {
            return res.status(404).json({
                success: false,
                error: "Task not found or not authorized"
            });
        }

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: 'after',
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: updatedTask
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) {
            return res.status(404).json({
                success: false,
                error: "Task not found or not authorized"
            });
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
