const { EntitySchema } = require('typeorm');
const { baseColumns } = require('./base.entities');

module.exports = new EntitySchema({
    name: 'InterviewQuestions',
    tableName: 'interview_questions',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        sessionId: {
            type: 'int',
            nullable: false,
        },
        questionText: {
            type: 'text',
            nullable: false,
        },
        questionType: {
            type: 'varchar',
            default: 'main',
            comment: 'main, follow_up'
        },
        orderIndex: {
            type: 'int',
            default: 1,
        },
        parentQuestionId: {
            type: 'int',
            nullable: true,
            comment: 'Dùng cho câu hỏi follow-up'
        },
        ...baseColumns
    },
    relations: {
        session: {
            type: 'many-to-one',
            target: 'InterviewSessions',
            joinColumn: {
                name: 'sessionId'
            },
            inverseSide: 'questions'
        },
        answer: {
            type: 'one-to-one',
            target: 'InterviewAnswers',
            inverseSide: 'question'
        }
    }
});
