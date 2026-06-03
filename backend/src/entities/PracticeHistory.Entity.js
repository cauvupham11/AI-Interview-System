const { EntitySchema } = require('typeorm');
const { baseColumns } = require('./base.entities');

module.exports = new EntitySchema({
    name: 'PracticeHistories',
    tableName: 'practice_histories',
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
        sessionId: {
            type: 'int',
            nullable: true,
        },
        technology: {
            type: 'varchar',
            nullable: false,
        },
        position: {
            type: 'varchar',
            nullable: false,
        },
        level: {
            type: 'varchar',
            nullable: false,
        },
        interviewType: {
            type: 'varchar',
            default: 'general',
        },
        totalQuestions: {
            type: 'int',
            default: 0,
        },
        answeredQuestions: {
            type: 'int',
            default: 0,
        },
        averageScore: {
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
        note: {
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
            inverseSide: 'practiceHistories'
        },
        session: {
            type: 'many-to-one',
            target: 'InterviewSessions',
            joinColumn: {
                name: 'sessionId'
            }
        }
    }
});
