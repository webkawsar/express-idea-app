// eslint-disable-next-line no-unused-vars
const errorMiddleware = (error, req, res, next) => {
    console.log(error);
    res.status(500).render('error', { title: 'Server side Error' });
};

module.exports = errorMiddleware;
