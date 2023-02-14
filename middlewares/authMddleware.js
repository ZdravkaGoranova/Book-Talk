const jwt = require('../lib/jsonWebToken.js');
const { SECRET } = require('../constans.js');

exports.authentication = async (req, res, next) => {

    const token = req.cookies['auth'];

    if (token) {
        try {
            const decodedToken = await jwt.verify(token, SECRET);

            req.user = decodedToken;
            res.locals.isAuthenticated = decodedToken;
            res.locals.user = decodedToken;

        } catch (err) {
            res.clearCookie('auth');

            return res.status(401).render('home/404');
        }
    }
    //req.user = {};ako e undefinde да върне false
    next();
};

exports.isAuth = async (req, res, next) => {

    if (!req.user) {
        return res.redirect('/login');
    }
    next();
};


