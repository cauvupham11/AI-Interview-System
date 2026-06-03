const { EntitySchema } = require('typeorm');
const { baseColumns } = require('./base.entities');

module.exports = new EntitySchema({
    name: 'AiFeedbacks',
    tableName: 'ai_feedbacks',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        answerId: {
            type: 'int',
            nullable: false,
        },
        score: {
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
        isCorrect: {
            type: 'boolean',
            default: false,
        },
        comment: {
            type: 'text',
            nullable: true,
        },
        feedback: {
            type: 'text',
            nullable: true,
        },
        correctComment: {
            type: 'text',
            nullable: true,
        },
        incorrectComment: {
            type: 'text',
            nullable: true,
        },
        missingPoints: {
            type: 'text',
            nullable: true,
        },
        missing: {
            type: 'text',
            nullable: true,
        },
        suggestedAnswer: {
            type: 'text',
            nullable: true,
        },
        needFollowUp: {
            type: 'boolean',
            default: false,
        },
        followUpQuestion: {
            type: 'text',
            nullable: true,
        },
        ...baseColumns
    },
    relations: {
        answer: {
            type: 'one-to-one',
            target: 'InterviewAnswers',
            joinColumn: {
                name: 'answerId'
            },
            inverseSide: 'feedback'
        }
    }
});
