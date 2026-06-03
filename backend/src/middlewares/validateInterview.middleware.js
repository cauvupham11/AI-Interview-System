const interviewOptions = {
    positions: ['Frontend', 'Backend', 'Fullstack'],
    technologies: ['React', 'NodeJS', 'Java', 'Vue', 'MySQL'],
    levels: ['Fresher', 'Junior', 'Middle', 'Senior'],
    difficulties: ['easy', 'medium', 'hard'],
    questionCounts: [5, 10, 15],
    interviewLanguages: ['vi', 'en'],
};

const aliases = {
    positions: {
        'frontend developer': 'Frontend',
        frontend: 'Frontend',
        'backend developer': 'Backend',
        backend: 'Backend',
        'fullstack developer': 'Fullstack',
        fullstack: 'Fullstack',
    },
    technologies: {
        reactjs: 'React',
        react: 'React',
        node: 'NodeJS',
        nodejs: 'NodeJS',
        'node.js': 'NodeJS',
        java: 'Java',
        vue: 'Vue',
        vuejs: 'Vue',
        mysql: 'MySQL',
    },
    levels: {
        fresher: 'Fresher',
        junior: 'Junior',
        middle: 'Middle',
        senior: 'Senior',
    },
    difficulties: {
        de: 'easy',
        easy: 'easy',
        'trung binh': 'medium',
        medium: 'medium',
        kho: 'hard',
        hard: 'hard',
    },
};

const normalizeText = (value) => {
    if (typeof value !== 'string') {
        return '';
    }

    return value.trim();
};

const removeVietnameseAccents = (value) => {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\u0111/g, 'd')
        .replace(/\u0110/g, 'D');
};

const normalizeByAlias = (value, aliasMap) => {
    const normalizedValue = normalizeText(value);
    const key = removeVietnameseAccents(normalizedValue).toLowerCase();

    return aliasMap[key] || normalizedValue;
};

const normalizeQuestionCount = (value) => {
    if (typeof value === 'number') {
        return value;
    }

    if (typeof value === 'string') {
        const matchedNumber = value.match(/\d+/);
        return matchedNumber ? Number(matchedNumber[0]) : NaN;
    }

    return NaN;
};

const isAllowed = (value, allowedValues) => {
    return allowedValues.includes(value);
};

const normalizeInterviewLanguage = (value) => {
    const normalizedValue = removeVietnameseAccents(normalizeText(value)).toLowerCase();

    if (['en', 'english', 'tieng anh'].includes(normalizedValue)) {
        return 'en';
    }

    if (['vi', 'vn', 'vietnamese', 'tieng viet'].includes(normalizedValue)) {
        return 'vi';
    }

    return 'vi';
};

const validateCreateInterviewSession = (req, res, next) => {
    const position = normalizeByAlias(req.body.position, aliases.positions);
    const technology = normalizeByAlias(req.body.technology, aliases.technologies);
    const level = normalizeByAlias(req.body.level, aliases.levels);
    const difficulty = normalizeByAlias(req.body.difficulty, aliases.difficulties);
    const questionCount = normalizeQuestionCount(req.body.questionCount);
    const interviewLanguage = normalizeInterviewLanguage(req.body.interviewLanguage || req.body.language);

    if (!position || !technology || !level || !difficulty || !questionCount) {
        return res.status(400).json({
            message: 'Vui long chon day du vi tri, cong nghe, cap do, do kho va so luong cau hoi',
        });
    }

    if (!isAllowed(position, interviewOptions.positions)) {
        return res.status(400).json({
            message: 'Vi tri khong hop le',
            allowedValues: interviewOptions.positions,
        });
    }

    if (!isAllowed(technology, interviewOptions.technologies)) {
        return res.status(400).json({
            message: 'Cong nghe khong hop le',
            allowedValues: interviewOptions.technologies,
        });
    }

    if (!isAllowed(level, interviewOptions.levels)) {
        return res.status(400).json({
            message: 'Cap do khong hop le',
            allowedValues: interviewOptions.levels,
        });
    }

    if (!isAllowed(difficulty, interviewOptions.difficulties)) {
        return res.status(400).json({
            message: 'Do kho khong hop le',
            allowedValues: interviewOptions.difficulties,
        });
    }

    if (!interviewOptions.questionCounts.includes(questionCount)) {
        return res.status(400).json({
            message: 'So luong cau hoi khong hop le',
            allowedValues: interviewOptions.questionCounts,
        });
    }

    req.body.position = position;
    req.body.technology = technology;
    req.body.level = level;
    req.body.difficulty = difficulty;
    req.body.questionCount = questionCount;
    req.body.interviewLanguage = interviewLanguage;

    return next();
};

const validateCreateJdSession = (req, res, next) => {
    const jdText = typeof req.body.jdText === 'string'
        ? req.body.jdText.trim()
        : '';

    if (!jdText) {
        return res.status(400).json({
            message: 'jdText la bat buoc',
        });
    }

    req.body.jdText = jdText;
    req.body.questionCount = 15;
    req.body.difficulty = 'adaptive';
    req.body.interviewLanguage = normalizeInterviewLanguage(req.body.interviewLanguage || req.body.language);

    return next();
};

const prepareCvUploadBody = (req, res, next) => {
    if (!Buffer.isBuffer(req.body) || !req.body.length) {
        return res.status(400).json({
            message: 'File CV PDF la bat buoc',
        });
    }

    const pdfSignature = req.body.subarray(0, 4).toString();

    if (pdfSignature !== '%PDF') {
        return res.status(400).json({
            message: 'CV phai la file PDF',
        });
    }

    req.cvPdfBuffer = req.body;
    req.body = {
        questionCount: 15,
        difficulty: 'adaptive',
        interviewLanguage: normalizeInterviewLanguage(req.headers['x-interview-language']),
    };

    return next();
};

module.exports = {
    interviewOptions,
    validateCreateInterviewSession,
    validateCreateJdSession,
    prepareCvUploadBody,
};
