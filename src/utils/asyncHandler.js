const asyncHandler = (fn) => async (req,res,next) => {
    try {
        await fn(req,res,next)
    } catch (error) {
        res.status(err.code||400).json({
            success : true,
            message : err.message,
        });
    }
};