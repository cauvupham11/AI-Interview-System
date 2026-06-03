const express = require('express');
const interviewController = require('../controllers/interview.controllers');
const { authenticate } = require('../middlewares/auth.middleware');
const {
    validateCreateInterviewSession,
    validateCreateJdSession,
    prepareCvUploadBody,
} = require('../middlewares/validateInterview.middleware');
const { validateSubmitAnswer } = require('../middlewares/validateAnswer.middleware');

const router = express.Router();

router.get('/options', interviewController.getOptions);
router.post('/sessions', authenticate, validateCreateInterviewSession, interviewController.createSession);
router.post(
    '/cv-sessions',
    authenticate,
    express.raw({ type: ['application/pdf', 'application/octet-stream'], limit: '10mb' }),
    prepareCvUploadBody,
    interviewController.createCvSession
);
router.post('/jd-sessions', authenticate, validateCreateJdSession, interviewController.createJdSession);
router.get('/sessions/:id', authenticate, interviewController.getSessionById);
router.get('/sessions/:id/summary', authenticate, interviewController.getSessionSummary);
router.post('/sessions/:id/answers', authenticate, validateSubmitAnswer, interviewController.submitAnswer);

module.exports = router;
