const { mySqlDataSource } = require('../config/appDataSource');

const historyRepository = () => mySqlDataSource.getRepository('PracticeHistories');
const sessionRepository = () => mySqlDataSource.getRepository('InterviewSessions');

const getHistories = async ({ accountId }) => {
    return historyRepository().find({
        where: {
            accountId,
        },
        relations: {
            session: true,
        },
        order: {
            createdAt: 'DESC',
        },
    });
};

const getHistoryById = async ({ accountId, historyId }) => {
    const history = await historyRepository().findOne({
        where: {
            id: Number(historyId),
            accountId,
        },
        relations: {
            session: {
                questions: {
                    answer: {
                        feedback: true,
                    },
                },
            },
        },
    });

    if (!history) {
        const error = new Error('Khong tim thay lich su phong van');
        error.statusCode = 404;
        throw error;
    }

    if (history.session?.questions) {
        history.session.questions = history.session.questions
            .sort((left, right) => left.orderIndex - right.orderIndex);
    }

    return history;
};

const getHistoryStats = async ({ accountId }) => {
    const histories = await historyRepository().find({
        where: {
            accountId,
        },
        order: {
            createdAt: 'ASC',
        },
    });

    const totalPractice = histories.length;
    const averageScore = totalPractice
        ? Number((histories.reduce((sum, history) => sum + Number(history.averageScore || 0), 0) / totalPractice).toFixed(2))
        : 0;

    const scoreTimeline = histories.map((history) => ({
        historyId: history.id,
        sessionId: history.sessionId,
        date: history.createdAt,
        position: history.position,
        technology: history.technology,
        interviewType: history.interviewType,
        averageScore: history.averageScore,
        technicalScore: history.technicalScore,
        communicationScore: history.communicationScore,
    }));

    const skillScores = histories.reduce((result, history) => {
        const key = history.technology;

        if (!result[key]) {
            result[key] = {
                technology: key,
                count: 0,
                averageScore: 0,
                technicalScore: 0,
                communicationScore: 0,
            };
        }

        result[key].count += 1;
        result[key].averageScore += Number(history.averageScore || 0);
        result[key].technicalScore += Number(history.technicalScore || 0);
        result[key].communicationScore += Number(history.communicationScore || 0);

        return result;
    }, {});

    const scoresByTechnology = Object.values(skillScores).map((item) => ({
        technology: item.technology,
        practiceCount: item.count,
        averageScore: Number((item.averageScore / item.count).toFixed(2)),
        technicalScore: Number((item.technicalScore / item.count).toFixed(2)),
        communicationScore: Number((item.communicationScore / item.count).toFixed(2)),
    }));

    const frequencyByDate = histories.reduce((result, history) => {
        const dateKey = history.createdAt.toISOString().slice(0, 10);
        result[dateKey] = (result[dateKey] || 0) + 1;
        return result;
    }, {});

    return {
        totalPractice,
        averageScore,
        scoreTimeline,
        scoresByTechnology,
        practiceFrequency: Object.entries(frequencyByDate).map(([date, count]) => ({
            date,
            count,
        })),
    };
};

const getSessionSummary = async ({ accountId, sessionId }) => {
    const session = await sessionRepository().findOne({
        where: {
            id: Number(sessionId),
            accountId,
        },
    });

    if (!session) {
        const error = new Error('Khong tim thay phien phong van');
        error.statusCode = 404;
        throw error;
    }

    return {
        sessionId: session.id,
        status: session.status,
        position: session.position,
        technology: session.technology,
        level: session.level,
        difficulty: session.difficulty,
        interviewType: session.interviewType,
        totalQuestions: session.questionCount,
        totalScore: session.totalScore,
        totalScorePercent: Number((Number(session.totalScore || 0) * 10).toFixed(2)),
        technicalScore: session.technicalScore,
        communicationScore: session.communicationScore,
        goodAnswerCount: session.goodAnswerCount,
        weakAnswerCount: session.weakAnswerCount,
        strengths: session.strengths,
        weaknesses: session.weaknesses,
        improvementAdvice: session.improvementAdvice,
        overallFeedback: session.overallFeedback,
    };
};

module.exports = {
    getHistories,
    getHistoryById,
    getHistoryStats,
    getSessionSummary,
};
