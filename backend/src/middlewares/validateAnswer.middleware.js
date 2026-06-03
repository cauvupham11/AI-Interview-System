const validateSubmitAnswer = (req, res, next) => {
    const questionId = Number(req.body.questionId);
    const answerText = typeof req.body.answerText === 'string'
        ? req.body.answerText.trim()
        : '';
    const timeSpent = req.body.timeSpent === undefined
        ? null
        : Number(req.body.timeSpent);

    if (!questionId || !answerText) {
        return res.status(400).json({
            message: 'questionId va answerText la bat buoc',
        });
    }

    if (timeSpent !== null && (Number.isNaN(timeSpent) || timeSpent < 0)) {
        return res.status(400).json({
            message: 'timeSpent khong hop le',
        });
    }

    req.body.questionId = questionId;
    req.body.answerText = answerText;
    req.body.timeSpent = timeSpent;

    return next();
};

module.exports = {
    validateSubmitAnswer,
};
