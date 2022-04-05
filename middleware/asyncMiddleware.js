const asyncMiddleware = (fn) => async (req, res, next) => {
    try {
        await fn(req, res);
    } catch (error) {
        next(error);
    }
};

module.exports = asyncMiddleware;
