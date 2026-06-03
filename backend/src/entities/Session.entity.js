const { EntitySchema } = require('typeorm');
const { baseColumns } = require('./base.entities');

module.exports = new EntitySchema({
    name: 'InterviewSessions',
    tableName: 'interview_sessions',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        accountId: {
            type: 'int',
            nullable: false,
        },
        position: {
            type: 'varchar',
            nullable: false,
            comment: 'Frontend Developer, Backend Developer...'
        },
        technology: {
            type: 'varchar',
            nullable: false,
            comment: 'ReactJS, NodeJS, Java, Vue...'
        },
        level: {
            type: 'varchar',
            nullable: false,
            comment: 'Fresher, Junior, Middle'
        },
        difficulty: {
            type: 'varchar',
            nullable: false,
            default: 'medium',
            comment: 'easy, medium, hard'
        },
        questionCount: {
            type: 'int',
            default: 10,
        },
        interviewType: {
            type: 'varchar',
            default: 'general',
            comment: 'general, cv, jd'
        },
        interviewLanguage: {
            type: 'varchar',
            default: 'vi',
            comment: 'vi, en'
        },
        sourceContent: {
            type: 'longtext',
            nullable: true,
        },
        status: {
            type: 'varchar',
            default: 'in_progress',
            comment: 'in_progress, completed, cancelled'
        },
        totalScore: {
            type: 'float',
            default: 0,
        },
        technicalScore: {
            type: 'float',
            default: 0,
        },
        communicationScore: {
            type: 'float',
            default: 0,
        },
        goodAnswerCount: {
            type: 'int',
            default: 0,
        },
        weakAnswerCount: {
            type: 'int',
            default: 0,
        },
        strengths: {
            type: 'text',
            nullable: true,
        },
        weaknesses: {
            type: 'text',
            nullable: true,
        },
        improvementAdvice: {
            type: 'text',
            nullable: true,
        },
        overallFeedback: {
            type: 'text',
            nullable: true,
        },
        ...baseColumns
    },
    relations: {
        account: {
            type: 'many-to-one',
            target: 'Accounts',
            joinColumn: {
                name: 'accountId'
            },
            inverseSide: 'interviewSessions'
        },
        questions: {
            type: 'one-to-many',
            target: 'InterviewQuestions',
            inverseSide: 'session'
        }
    }
});
