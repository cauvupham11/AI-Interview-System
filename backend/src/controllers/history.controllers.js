const historyService = require('../services/history.services');

const getHistories = async (req, res, next) => {
    try {
        const data = await historyService.getHistories({
            accountId: req.account.id,
        });

        return res.status(200).json({
            message: 'Lay lich su phong van thanh cong',
            data,
        });
    } catch (error) {
        return next(error);
    }
};

const getHistoryStats = async (req, res, next) => {
    try {
        const data = await historyService.getHistoryStats({
            accountId: req.account.id,
        });

        return res.status(200).json({
            message: 'Lay thong ke lich su phong van thanh cong',
            data,
        });
    } catch (error) {
        return next(error);
    }
};

const getHistoryById = async (req, res, next) => {
    try {
        const data = await historyService.getHistoryById({
            accountId: req.account.id,
            historyId: req.params.id,
        });

        return res.status(200).json({
            message: 'Lay chi tiet lich su phong van thanh cong',
            data,
        });
    } catch (error) {
        return next(error);
    }
};

const getSessionSummary = async (req, res, next) => {
    try {
        const data = await historyService.getSessionSummary({
            accountId: req.account.id,
            sessionId: req.params.id,
        });

        return res.status(200).json({
            message: 'Lay tong ket phien phong van thanh cong',
            data,
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getHistories,
    getHistoryStats,
    getHistoryById,
    getSessionSummary,
};
