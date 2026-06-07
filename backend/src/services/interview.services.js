const { mySqlDataSource } = require('../config/appDataSource');
const { interviewOptions } = require('../middlewares/validateInterview.middleware');
const {
    analyzeCvPdf,
    analyzeJobDescription,
    generateInterviewQuestion,
    evaluateInterviewAnswers,
    summarizeInterview,
} = require('./ai.services');

const sessionRepository = () => mySqlDataSource.getRepository('InterviewSessions');
const questionRepository = () => mySqlDataSource.getRepository('InterviewQuestions');
const answerRepository = () => mySqlDataSource.getRepository('InterviewAnswers');

const average = (items, field) => {
    if (!items.length) {
        return 0;
    }

    const total = items.reduce((sum, item) => sum + Number(item[field] || 0), 0);
    return Number((total / items.length).toFixed(2));
};

const countByScore = (items, predicate) => {
    return items.filter((item) => predicate(Number(item.score || 0))).length;
};

const toSourceContent = (sourceData) => {
    return JSON.stringify(sourceData, null, 2);
};

const uniqueQuestions = (questions) => {
    const seen = new Set();

    return questions.filter((question) => {
        const normalizedQuestion = String(question || '').trim().toLowerCase();

        if (!normalizedQuestion || seen.has(normalizedQuestion)) {
            return false;
        }

        seen.add(normalizedQuestion);
        return true;
    });
};

const getRecentSetupQuestions = async ({ session, limit = 10 }) => {
    const recentSessions = await sessionRepository().find({
        where: {
            accountId: session.accountId,
            position: session.position,
            technology: session.technology,
            level: session.level,
            difficulty: session.difficulty,
            questionCount: session.questionCount,
            interviewType: session.interviewType,
            interviewLanguage: session.interviewLanguage || 'vi',
        },
        relations: {
            questions: true,
        },
        order: {
            createdAt: 'DESC',
        },
        take: limit + 1,
    });

    return recentSessions
        .filter((recentSession) => recentSession.id !== session.id)
        .slice(0, limit)
        .flatMap((recentSession) => [...(recentSession.questions || [])]
            .sort((left, right) => left.orderIndex - right.orderIndex)
            .map((question) => question.questionText));
};

const createFirstQuestionInBackground = ({ session }) => {
    Promise.resolve()
        .then(() => createNextQuestion({ session }))
        .catch((error) => {
            console.error('Create first interview question failed:', {
                sessionId: session.id,
                message: error.message,
            });
        });
};
//Đếm tổng số câu trả lời của một interview session
const countSessionAnswers = async (sessionId) => {
    return answerRepository()
        .createQueryBuilder('answer')
        .innerJoin('answer.question', 'question')
        .where('question.sessionId = :sessionId', { sessionId })
        .getCount();
};
//Tìm câu hỏi chưa được trả lời trong một interview session
const findPendingQuestion = async (sessionId) => {
    const questions = await questionRepository().find({
        where: {
            sessionId,
        },
        relations: {
            answer: true,
        },
        order: {
            orderIndex: 'ASC',
        },
    });

    return questions.find((currentQuestion) => !currentQuestion.answer) || null;
};
// get session theo accountId và sessionId
const getSessionForAccount = async ({ accountId, sessionId, relations = {} }) => {
    const session = await sessionRepository().findOne({
        where: {
            id: Number(sessionId),
            accountId,
        },
        relations,
    });

    if (!session) {
        const error = new Error('Khong tim thay phien phong van');
        error.statusCode = 404;
        throw error;
    }

    return session;
};
//Tạo câu hỏi tiếp theo cho buổi phỏng vấn bằng AI
const createNextQuestion = async ({ session }) => {
    const previousQuestions = await questionRepository().find({
        where: {
            sessionId: session.id,
        },
        order: {
            orderIndex: 'ASC',
        },
    });

    if (previousQuestions.length >= session.questionCount) {
        return null;
    }

    const orderIndex = previousQuestions.length + 1;
    const recentSetupQuestions = await getRecentSetupQuestions({ session });
    const blockedQuestions = uniqueQuestions([
        ...recentSetupQuestions,
        ...previousQuestions.map((question) => question.questionText),
    ]);
    const questionText = await generateInterviewQuestion({
        position: session.position,
        technology: session.technology,
        level: session.level,
        difficulty: session.difficulty,
        questionNumber: orderIndex,
        questionCount: session.questionCount,
        previousQuestions: blockedQuestions,
        interviewType: session.interviewType,
        interviewLanguage: session.interviewLanguage,
        sourceContent: session.sourceContent,
    });

    const question = questionRepository().create({
        sessionId: session.id,
        questionText,
        questionType: 'main',
        orderIndex,
    });

    return questionRepository().save(question);
};
// tao buoi phong van moi va tra ve cau hoi dau tien cho ung vien
const createSession = async ({
    accountId,
    position,
    technology,
    level,
    difficulty,
    questionCount,
    interviewType = 'general',
    interviewLanguage = 'vi',
    sourceContent = null,
    waitForFirstQuestion = true,
}) => {
    const session = sessionRepository().create({
        accountId,
        position,
        technology,
        level,
        difficulty,
        questionCount,
        interviewType,
        interviewLanguage,
        sourceContent,
        status: 'in_progress',
    });

    const savedSession = await sessionRepository().save(session);
    let firstQuestion = null;

    if (waitForFirstQuestion) {
        try {
            firstQuestion = await createNextQuestion({
                session: savedSession,
            });
        } catch (error) {
            await sessionRepository().remove(savedSession);
            throw error;
        }
    }

    if (!waitForFirstQuestion) {
        createFirstQuestionInBackground({
            session: savedSession,
        });
    }

    return {
        session: savedSession,
        currentQuestion: firstQuestion,
        remainingQuestions: firstQuestion ? questionCount - 1 : questionCount,
    };
};

const createCvSession = async ({
    accountId,
    cvPdfBuffer,
    interviewLanguage = 'vi',
}) => {
    const cvContext = await analyzeCvPdf({
        cvPdfBuffer,
    });

    return createSession({
        accountId,
        position: cvContext.suggestedPosition || 'Fullstack',
        technology: cvContext.mainTechnology || 'General',
        level: cvContext.estimatedLevel || 'Junior',
        difficulty: 'adaptive',
        questionCount: 15,
        interviewType: 'cv',
        interviewLanguage,
        sourceContent: toSourceContent(cvContext),
    });
};

const createJdSession = async ({
    accountId,
    jdText,
    interviewLanguage = 'vi',
}) => {
    const jdContext = await analyzeJobDescription({
        jdText,
    });

    return createSession({
        accountId,
        position: jdContext.suggestedPosition || 'Fullstack',
        technology: jdContext.mainTechnology || 'General',
        level: jdContext.estimatedLevel || 'Junior',
        difficulty: 'adaptive',
        questionCount: 15,
        interviewType: 'jd',
        interviewLanguage,
        sourceContent: toSourceContent(jdContext),
    });
};
//Lấy thông tin buổi phỏng vấn theo sessionId, bao gồm cả câu hỏi, câu trả lời và feedback (nếu có)
const getSessionById = async ({ accountId, sessionId }) => {
    const session = await getSessionForAccount({
        accountId,
        sessionId,
        relations: {
            questions: {
                answer: {
                    feedback: true,
                },
            },
        },
    });

    session.questions = session.questions.sort((left, right) => left.orderIndex - right.orderIndex);

    return session;
};
//Chấm nhiều câu trả lời phỏng vấn cùng lúc sau khi buổi phỏng vấn kết thúc
const evaluateCompletedSession = async ({ session }) => {
    const questions = await questionRepository().find({
        where: {
            sessionId: session.id,
        },
        relations: {
            answer: {
                feedback: true,
            },
        },
        order: {
            orderIndex: 'ASC',
        },
    });

    const unansweredQuestion = questions.find((question) => !question.answer);

    if (unansweredQuestion) {
        const error = new Error('Chua tra loi het tat ca cau hoi');
        error.statusCode = 400;
        throw error;
    }

    const answersForAi = questions.map((question) => ({
        answerId: question.answer.id,
        questionText: question.questionText,
        answerText: question.answer.answerText,
    }));

    const aiFeedbacks = await evaluateInterviewAnswers({
        position: session.position,
        technology: session.technology,
        level: session.level,
        difficulty: session.difficulty,
        interviewLanguage: session.interviewLanguage,
        answers: answersForAi,
    });

    const expectedAnswerIds = new Set(answersForAi.map((answer) => answer.answerId));
    const validFeedbacks = aiFeedbacks.filter((feedback) => expectedAnswerIds.has(feedback.answerId));
    const feedbackAnswerIds = new Set(validFeedbacks.map((feedback) => feedback.answerId));
    const missingFeedback = answersForAi.find((answer) => !feedbackAnswerIds.has(answer.answerId));

    if (missingFeedback) {
        const error = new Error('AI khong cham du tat ca cau tra loi');
        error.statusCode = 502;
        throw error;
    }

    return mySqlDataSource.transaction(async (manager) => {
        const feedbacks = validFeedbacks.map((feedback) => manager.create('AiFeedbacks', feedback));
        const savedFeedbacks = await manager.save('AiFeedbacks', feedbacks);

        const totalScore = average(savedFeedbacks, 'score');
        const technicalScore = average(savedFeedbacks, 'technicalScore');
        const communicationScore = average(savedFeedbacks, 'communicationScore');
        const goodAnswerCount = countByScore(savedFeedbacks, (score) => score >= 7);
        const weakAnswerCount = countByScore(savedFeedbacks, (score) => score < 5);
        const answerTextById = new Map(answersForAi.map((answer) => [answer.answerId, answer]));
        const summary = await summarizeInterview({
            position: session.position,
            technology: session.technology,
            level: session.level,
            difficulty: session.difficulty,
            interviewLanguage: session.interviewLanguage,
            totalScore,
            technicalScore,
            communicationScore,
            goodAnswerCount,
            weakAnswerCount,
            items: savedFeedbacks.map((feedback) => ({
                ...answerTextById.get(feedback.answerId),
                score: feedback.score,
                feedback: feedback.feedback || feedback.comment,
                missing: feedback.missing || feedback.missingPoints,
            })),
        });

        await manager.update('InterviewSessions', session.id, {
            status: 'completed',
            totalScore,
            technicalScore,
            communicationScore,
            goodAnswerCount,
            weakAnswerCount,
            strengths: summary.strengths,
            weaknesses: summary.weaknesses,
            improvementAdvice: summary.improvementAdvice,
            overallFeedback: summary.overallFeedback,
        });

        const existedHistory = await manager.findOne('PracticeHistories', {
            where: {
                sessionId: session.id,
            },
        });
        const historyPayload = {
            accountId: session.accountId,
            sessionId: session.id,
            technology: session.technology,
            position: session.position,
            level: session.level,
            interviewType: session.interviewType,
            totalQuestions: session.questionCount,
            answeredQuestions: questions.length,
            averageScore: totalScore,
            technicalScore,
            communicationScore,
            goodAnswerCount,
            weakAnswerCount,
            strengths: summary.strengths,
            weaknesses: summary.weaknesses,
            improvementAdvice: summary.improvementAdvice,
            note: summary.overallFeedback,
        };

        const history = existedHistory
            ? manager.merge('PracticeHistories', existedHistory, historyPayload)
            : manager.create('PracticeHistories', historyPayload);
        const savedHistory = await manager.save('PracticeHistories', history);

        return {
            feedbacks: savedFeedbacks,
            history: savedHistory,
            summary: {
                totalScore,
                totalScorePercent: Number((totalScore * 10).toFixed(2)),
                technicalScore,
                communicationScore,
                goodAnswerCount,
                weakAnswerCount,
                ...summary,
            },
        };
    });
};
//Xử lý khi user nộp câu trả lời cho một câu hỏi phỏng vấn
const submitAnswer = async ({ accountId, sessionId, questionId, answerText, timeSpent }) => {
    const session = await getSessionForAccount({
        accountId,
        sessionId,
    });

    if (session.status !== 'in_progress') {
        const error = new Error('Phien phong van da ket thuc');
        error.statusCode = 400;
        throw error;
    }

    const question = await questionRepository().findOne({
        where: {
            id: questionId,
            sessionId: session.id,
        },
        relations: {
            answer: true,
        },
    });

    if (!question) {
        const error = new Error('Khong tim thay cau hoi trong phien phong van nay');
        error.statusCode = 404;
        throw error;
    }

    if (question.answer) {
        const answeredCount = await countSessionAnswers(session.id);
        let nextQuestion = null;
        let evaluation = null;

        if (answeredCount >= session.questionCount) {
            evaluation = await evaluateCompletedSession({
                session,
            });
            session.status = 'completed';
        } else {
            nextQuestion = await findPendingQuestion(session.id);

            if (!nextQuestion) {
                nextQuestion = await createNextQuestion({
                    session,
                });
            }
        }

        return {
            answer: question.answer,
            evaluation,
            nextQuestion,
            isCompleted: session.status === 'completed',
            answeredCount,
            totalQuestions: session.questionCount,
        };
    }

    const answer = answerRepository().create({
        questionId: question.id,
        answerText,
        answerType: 'text',
        timeSpent,
    });
    const savedAnswer = await answerRepository().save(answer);

    const answeredCount = await countSessionAnswers(session.id);

    let nextQuestion = null;
    let evaluation = null;

    if (answeredCount >= session.questionCount) {
        evaluation = await evaluateCompletedSession({
            session,
        });
        session.status = 'completed';
    } else {
        nextQuestion = await createNextQuestion({
            session,
        });
    }

    return {
        answer: savedAnswer,
        evaluation,
        nextQuestion,
        isCompleted: session.status === 'completed',
        answeredCount,
        totalQuestions: session.questionCount,
    };
};

module.exports = {
    interviewOptions,
    createSession,
    createCvSession,
    createJdSession,
    getSessionById,
    submitAnswer,
};
