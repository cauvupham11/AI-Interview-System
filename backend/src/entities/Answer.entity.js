const { EntitySchema } = require('typeorm');
const { baseColumns } = require('./base.entities');

module.exports = new EntitySchema({
    name: 'InterviewAnswers',
    tableName: 'interview_answers',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        questionId: {
            type: 'int',
            nullable: false,
        },
        answerText: {
            type: 'text',
            nullable: false,
        },
        answerType: {
            type: 'varchar',
            default: 'text',
            comment: 'text, voice'
        },
        timeSpent: {
            type: 'int',
            nullable: true,
            comment: 'Thời gian trả lời, tính bằng giây'
        },
        ...baseColumns
    },
    relations: {
        question: {
            type: 'one-to-one',
            target: 'InterviewQuestions',
            joinColumn: {
                name: 'questionId'
            },
            inverseSide: 'answer'
        },
        feedback: {
            type: 'one-to-one',
            target: 'AiFeedbacks',
            inverseSide: 'answer'
        }
    }
});
