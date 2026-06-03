const authService = require('../services/auth.services');

const register = async (req, res, next) => {
    try{
        const { email, password, fullname } = req.body;
        const data = await authService.register({
            fullname,
            email,
            password,
        });
        return res.status(201).json({
            message: 'dang ky thanh cong',
            data,
        });
    }catch(error){
        return next(error);
    }
};

const login = async (req, res, next) => {
    try{
        const {email, password} = req.body;
        const data = await authService.login({
            email,
            password,
        })
        return res.status(200).json({
            message: 'dang nhap thanh cong',
            data,
        });
    }catch(error){
        return next(error);
    }
};
const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken: token } = req.body;
        const data = await authService.refreshToken({
            refreshToken: token,
        });

        return res.status(200).json({
            message: 'Tao access token moi thanh cong',
            data,
        });
    } catch (error) {
        return next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        await authService.logout({
            accountId: req.account.id,
        });

        return res.status(200).json({
            message: 'dang xuat thanh cong',
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    register,
    login,
    refreshToken,
    logout,
}
