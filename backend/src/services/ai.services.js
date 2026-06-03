const { GoogleGenerativeAI } = require('@google/generative-ai');
const { environment } = require('../config/env');

const extractJson = (content) => {
    try {
        return JSON.parse(content);
    } catch (error) {
        const matchedJson = content.match(/\{[\s\S]*\}/);
        if (!matchedJson) {
            throw error;
        }

        return JSON.parse(matchedJson[0]);
    }
};

const getLanguageInstruction = (interviewLanguage = 'vi') => {
    return interviewLanguage === 'en'
        ? 'Write the interview question, feedback, suggested answer, and summary in English.'
        : 'Write the interview question, feedback, suggested answer, and summary in Vietnamese.';
};
//Khởi tạo và trả về model Gemini AI

const getGeminiModel = ({ systemPrompt, temperature }) => {
    const genAI = new GoogleGenerativeAI(environment.GEMINI_API_KEY);

    return genAI.getGenerativeModel({
        model: environment.GEMINI_MODEL,
        systemInstruction: systemPrompt,
        generationConfig: {
            temperature,
            responseMimeType: 'application/json',
        },
    });
};

//Gọi Gemini AI và lấy kết quả JSON về cho hệ thống sử dụng

const callAiJson = async ({ systemPrompt, userPrompt, userParts, temperature = 0.4 }) => {
    if (!environment.GEMINI_API_KEY) {
        const error = new Error('Chua cau hinh GEMINI_API_KEY');
        error.statusCode = 500;
        throw error;
    }

    const model = getGeminiModel({
        systemPrompt,
        temperature,
    });
    let result;

    try {
        result = await model.generateContent(userParts
            ? {
                contents: [
                    {
                        role: 'user',
                        parts: userParts,
                    },
                ],
            }
            : userPrompt);
    } catch (error) {
        const message = error.message || '';
        const aiError = new Error(
            message.includes('429') || message.toLowerCase().includes('quota')
                ? 'Dich vu AI dang qua tai hoac het quota, vui long thu lai sau'
                : 'Khong the ket noi dich vu AI, vui long thu lai sau'
        );

        aiError.statusCode = message.includes('429') ? 503 : 502;
        throw aiError;
    }

    const content = result.response.text();

    if (!content) {
        const error = new Error('Gemini khong tra ve noi dung hop le');
        error.statusCode = 502;
        throw error;
    }

    return extractJson(content);
};

const analyzeCvPdf = async ({ cvPdfBuffer }) => {
    const systemPrompt = [
        'You are an expert technical recruiter.',
        'Read the candidate CV PDF and extract interview context.',
        'Return only valid JSON with this shape:',
        '{"profileSummary":"...","suggestedPosition":"Backend","mainTechnology":"NodeJS","estimatedLevel":"Junior","skills":["..."],"projects":["..."],"experiences":["..."],"technologies":["..."],"interviewFocus":["..."]}',
        'Write concise Vietnamese text where possible.',
    ].join(' ');

    const data = await callAiJson({
        systemPrompt,
        userParts: [
            {
                text: 'Read this CV PDF and extract practical interview context from skills, projects, experience, and technologies.',
            },
            {
                inlineData: {
                    mimeType: 'application/pdf',
                    data: cvPdfBuffer.toString('base64'),
                },
            },
        ],
        temperature: 0.2,
    });

    return {
        profileSummary: data.profileSummary || '',
        suggestedPosition: data.suggestedPosition || 'Fullstack',
        mainTechnology: data.mainTechnology || 'General',
        estimatedLevel: data.estimatedLevel || 'Junior',
        skills: Array.isArray(data.skills) ? data.skills : [],
        projects: Array.isArray(data.projects) ? data.projects : [],
        experiences: Array.isArray(data.experiences) ? data.experiences : [],
        technologies: Array.isArray(data.technologies) ? data.technologies : [],
        interviewFocus: Array.isArray(data.interviewFocus) ? data.interviewFocus : [],
    };
};

const analyzeJobDescription = async ({ jdText }) => {
    const systemPrompt = [
        'You are an expert technical recruiter.',
        'Read the job description and extract interview context.',
        'Return only valid JSON with this shape:',
        '{"profileSummary":"...","suggestedPosition":"Backend","mainTechnology":"NodeJS","estimatedLevel":"Junior","requiredSkills":["..."],"responsibilities":["..."],"technologies":["..."],"interviewFocus":["..."]}',
        'Write concise Vietnamese text where possible.',
    ].join(' ');

    const data = await callAiJson({
        systemPrompt,
        userPrompt: [
            'Analyze this job description for interview question generation.',
            jdText,
        ].join('\n\n'),
        temperature: 0.2,
    });

    return {
        profileSummary: data.profileSummary || '',
        suggestedPosition: data.suggestedPosition || 'Fullstack',
        mainTechnology: data.mainTechnology || 'General',
        estimatedLevel: data.estimatedLevel || 'Junior',
        requiredSkills: Array.isArray(data.requiredSkills) ? data.requiredSkills : [],
        responsibilities: Array.isArray(data.responsibilities) ? data.responsibilities : [],
        technologies: Array.isArray(data.technologies) ? data.technologies : [],
        interviewFocus: Array.isArray(data.interviewFocus) ? data.interviewFocus : [],
        originalText: jdText,
    };
};
//Tạo câu hỏi phỏng vấn bằng AI Gemini
const generateInterviewQuestion = async ({
    position,
    technology,
    level,
    difficulty,
    questionNumber,
    questionCount,
    previousQuestions,
    interviewType = 'general',
    interviewLanguage = 'vi',
    sourceContent,
}) => {
    const adaptiveDifficulty = interviewType === 'cv' || interviewType === 'jd'
        ? (
            questionNumber <= 5
                ? 'easy'
                : questionNumber <= 10
                    ? 'medium'
                    : 'hard'
        )
        : difficulty;
    const systemPrompt = [
        'You are an experienced technical interviewer.',
        'Create exactly one interview question.',
        'Return only valid JSON with this shape: {"questionText":"..."}',
        'The question must be clear, practical, and suitable for a real interview.',
        'Do not repeat previous questions.',
        'Avoid duplicate intent, duplicate topic, or only slightly reworded versions of previous questions.',
        'If source context is provided, the question must be based on that CV or job description context.',
        'For CV or JD interviews, difficulty must progress: questions 1-5 easy, 6-10 medium, 11-15 hard.',
        getLanguageInstruction(interviewLanguage),
    ].join(' ');

    const userPrompt = [
        `Create question ${questionNumber}/${questionCount}.`,
        `Position: ${position} Developer.`,
        `Technology: ${technology}.`,
        `Candidate level: ${level}.`,
        `Difficulty: ${adaptiveDifficulty}.`,
        `Interview type: ${interviewType}.`,
        sourceContent ? `Source context:\n${sourceContent}` : 'Source context: none.',
        previousQuestions.length
            ? `Questions that are already used and must not be repeated:\n${previousQuestions.map((question) => `- ${question}`).join('\n')}`
            : 'Questions that are already used and must not be repeated: none.',
    ].join('\n');

    const data = await callAiJson({
        systemPrompt,
        userPrompt,
    });

    if (!data.questionText || typeof data.questionText !== 'string') {
        const error = new Error('AI khong tra ve questionText hop le');
        error.statusCode = 502;
        throw error;
    }

    return data.questionText.trim();
};

//Chấm 1 câu trả lời phỏng vấn bằng AI Gemini

const evaluateInterviewAnswer = async ({
    questionText,
    answerText,
    position,
    technology,
    level,
    difficulty,
    interviewLanguage = 'vi',
}) => {
    const systemPrompt = [
        'You are an experienced technical interviewer.',
        'Evaluate the candidate answer fairly.',
        'Return only valid JSON with this shape:',
        '{"isCorrect":true,"score":8,"technicalScore":8,"communicationScore":7,"feedback":"...","correctComment":"...","incorrectComment":"...","missing":"...","missingPoints":"...","suggestedAnswer":"...","needFollowUp":false,"followUpQuestion":"..."}',
        'Scores are from 0 to 10.',
        getLanguageInstruction(interviewLanguage),
    ].join(' ');

    const userPrompt = [
        `Position: ${position} Developer.`,
        `Technology: ${technology}.`,
        `Candidate level: ${level}.`,
        `Difficulty: ${difficulty}.`,
        `Question: ${questionText}`,
        `Candidate answer: ${answerText}`,
    ].join('\n');

    const data = await callAiJson({
        systemPrompt,
        userPrompt,
        temperature: 0.2,
    });

    return {
        isCorrect: Boolean(data.isCorrect),
        score: Number(data.score) || 0,
        technicalScore: Number(data.technicalScore) || 0,
        communicationScore: Number(data.communicationScore) || 0,
        comment: data.comment || data.feedback || '',
        feedback: data.feedback || data.comment || '',
        correctComment: data.correctComment || '',
        incorrectComment: data.incorrectComment || '',
        missingPoints: data.missingPoints || data.missing || '',
        missing: data.missing || data.missingPoints || '',
        suggestedAnswer: data.suggestedAnswer || '',
        needFollowUp: Boolean(data.needFollowUp),
        followUpQuestion: data.followUpQuestion || '',
    };
};

//Chấm nhiều câu trả lời phỏng vấn cùng lúc sau khi buổi phỏng vấn kết thúc
const evaluateInterviewAnswers = async ({
    position,
    technology,
    level,
    difficulty,
    interviewLanguage = 'vi',
    answers,
}) => {
    const systemPrompt = [
        'You are an experienced technical interviewer.',
        'Evaluate all candidate answers fairly after the interview is finished.',
        'Return only valid JSON with this shape:',
        '{"results":[{"answerId":1,"isCorrect":true,"score":8,"technicalScore":8,"communicationScore":7,"feedback":"...","correctComment":"...","incorrectComment":"...","missing":"...","missingPoints":"...","suggestedAnswer":"...","needFollowUp":false,"followUpQuestion":"..."}]}',
        'Scores are from 0 to 10.',
        'Every input answerId must have exactly one result.',
        getLanguageInstruction(interviewLanguage),
    ].join(' ');

    const userPrompt = [
        `Position: ${position} Developer.`,
        `Technology: ${technology}.`,
        `Candidate level: ${level}.`,
        `Difficulty: ${difficulty}.`,
        'Evaluate these answers:',
        JSON.stringify(answers.map((answer) => ({
            answerId: answer.answerId,
            questionText: answer.questionText,
            answerText: answer.answerText,
        }))),
    ].join('\n');

    const data = await callAiJson({
        systemPrompt,
        userPrompt,
        temperature: 0.2,
    });

    if (!Array.isArray(data.results)) {
        const error = new Error('AI khong tra ve results hop le');
        error.statusCode = 502;
        throw error;
    }

    return data.results.map((result) => ({
        answerId: Number(result.answerId),
        isCorrect: Boolean(result.isCorrect),
        score: Number(result.score) || 0,
        technicalScore: Number(result.technicalScore) || 0,
        communicationScore: Number(result.communicationScore) || 0,
        comment: result.comment || result.feedback || '',
        feedback: result.feedback || result.comment || '',
        correctComment: result.correctComment || '',
        incorrectComment: result.incorrectComment || '',
        missingPoints: result.missingPoints || result.missing || '',
        missing: result.missing || result.missingPoints || '',
        suggestedAnswer: result.suggestedAnswer || '',
        needFollowUp: Boolean(result.needFollowUp),
        followUpQuestion: result.followUpQuestion || '',
    }));
};

const summarizeInterview = async ({
    position,
    technology,
    level,
    difficulty,
    interviewLanguage = 'vi',
    totalScore,
    technicalScore,
    communicationScore,
    goodAnswerCount,
    weakAnswerCount,
    items,
}) => {
    const systemPrompt = [
        'You are a senior interview coach.',
        'Summarize the finished interview and give improvement advice.',
        'Return only valid JSON with this shape:',
        '{"strengths":"...","weaknesses":"...","improvementAdvice":"...","overallFeedback":"..."}',
        'Mention concrete technical areas when possible.',
        getLanguageInstruction(interviewLanguage),
    ].join(' ');

    const userPrompt = [
        `Position: ${position} Developer.`,
        `Technology: ${technology}.`,
        `Candidate level: ${level}.`,
        `Difficulty: ${difficulty}.`,
        `Average score: ${totalScore}/10.`,
        `Technical score: ${technicalScore}/10.`,
        `Communication score: ${communicationScore}/10.`,
        `Good answers: ${goodAnswerCount}.`,
        `Weak answers: ${weakAnswerCount}.`,
        'Interview details:',
        JSON.stringify(items.map((item) => ({
            questionText: item.questionText,
            answerText: item.answerText,
            score: item.score,
            feedback: item.feedback,
            missing: item.missing,
        }))),
    ].join('\n');

    const data = await callAiJson({
        systemPrompt,
        userPrompt,
        temperature: 0.3,
    });

    return {
        strengths: data.strengths || '',
        weaknesses: data.weaknesses || '',
        improvementAdvice: data.improvementAdvice || '',
        overallFeedback: data.overallFeedback || '',
    };
};

module.exports = {
    analyzeCvPdf,
    analyzeJobDescription,
    generateInterviewQuestion,
    evaluateInterviewAnswer,
    evaluateInterviewAnswers,
    summarizeInterview,
};
