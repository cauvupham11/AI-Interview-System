const isEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const normalizeAuthBody = (req, res, next) => {
    if (typeof req.body.email === 'string') {
        req.body.email = req.body.email.trim().toLowerCase();
    }

    if (typeof req.body.fullname === 'string') {
        req.body.fullname = req.body.fullname.trim();
    }

    return next();
};

const validateRegister = (req, res, next) => {
    const { email, password, fullname } = req.body;

    if (!email || !password || !fullname) {
        return res.status(400).json({
            message: 'Vui long nhap day du thong tin',
        });
    }

    if (!isEmail(email)) {
        return res.status(400).json({
            message: 'Email khong hop le',
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            message: 'Mat khau phai co it nhat 8 ky tu',
        });
    }

    return next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Vui long nhap day du thong tin',
        });
    }

    if (!isEmail(email)) {
        return res.status(400).json({
            message: 'Email khong hop le',
        });
    }

    return next();
};

const validateRefreshToken = (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({
            message: 'Refresh token la bat buoc',
        });
    }

    return next();
};

module.exports = {
    normalizeAuthBody,
    validateRegister,
    validateLogin,
    validateRefreshToken,
};
