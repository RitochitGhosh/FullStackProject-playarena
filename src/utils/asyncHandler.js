const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    }
    catch (error) {{
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }}
}

export { asyncHandler };


// Promisified version of the above code:
// const _asyncHandler = (requestHandler) => {
//     (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next))
//         .catch((error) => next(err))
//     }
// }