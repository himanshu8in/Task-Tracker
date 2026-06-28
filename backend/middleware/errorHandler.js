const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log to console for dev
    console.error(err);

    // Mongoose Bad ObjectId (CastError)
    if (err.name === "CastError") {
        const message = `Resource not found with id of ${err.value}`;
        return res.status(400).json({
            success: false,
            error: message
        });
    }

    // Mongoose Validation Error (ValidationError)
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            success: false,
            error: message.join(", ")
        });
    }

    // Default response
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error"
    });
};

module.exports = errorHandler;
