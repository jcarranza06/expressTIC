const catchErrors = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ message: error.message });
        }
    };
};
module.exports = catchErrors;