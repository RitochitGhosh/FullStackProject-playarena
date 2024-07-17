// const _asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next);
//     }
//     catch (error) {{
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }}
// }




// Promisified version of the above code:
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((error) => next(err))
    }
}

export { asyncHandler };