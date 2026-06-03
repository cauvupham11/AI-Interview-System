const interviewService = require('../services/interview.services');
const historyService = require('../services/history.services');

const getOptions = (req, res) => {
    return res.status(200).json({
        message: 'Lay danh sach tuy chon phong van thanh cong',
        data: interviewService.interviewOptions,
    });
};

const createSession = async (req, res, next) => {
    try {
        const data = await interviewService.createSession({
            accountId: req.account.id,
            position: req.body.position,
            technology: req.body.technology,
            level: req.body.level,
            difficulty: req.body.difficulty,
            questionCount: req.body.questionCount,
            interviewLanguage: req.body.interviewLanguage,
        });

        return res.status(201).json({
            message: 'Tao phien phong van thanh cong',
            data,
        });
    } catch (error) {
        return next(error);
    }
};

const createCvSession = async (req, res, next) => {
    try {
        const data = await interviewService.createCvSession({
            accountId: req.account.id,
            cvPdfBuffer: req.cvPdfBuffer,
            interviewLanguage: req.body.interviewLanguage,
        });

        return res.status(201).json({
            message: 'Tao phien phong van theo CV thanh cong',
            data,
        });
    } catch (error) {
        return next(error);
    }
};

const createJdSession = async (req, res, next) => {
    try {
        const data = await interviewService.createJdSession({
            accountId: req.account.id,
            jdText: req.body.jdText,
            interviewLanguage: req.body.interviewLanguage,
        });

        return res.status(201).json({
            message: 'Tao phien phong van theo JD thanh cong',
            data,
        });
    } catch (error) {
        return next(error);
    }
};

const getSessionById = async (req, res, next) => {
    try {
        const data = await interviewService.getSessionById({
            accountId: req.account.id,
            sessionId: req.params.id,
        });

        return res.status(200).json({
            message: 'Lay phien phong van thanh cong',
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

const submitAnswer = async (req, res, next) => {
    try {
        const data = await interviewService.submitAnswer({
            accountId: req.account.id,
            sessionId: req.params.id,
            questionId: req.body.questionId,
            answerText: req.body.answerText,
            timeSpent: req.body.timeSpent,
        });

        return res.status(201).json({
            message: 'Nop cau tra loi thanh cong',
            data,
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getOptions,
    createSession,
    createCvSession,
    createJdSession,
    getSessionById,
    getSessionSummary,
    submitAnswer,
};
