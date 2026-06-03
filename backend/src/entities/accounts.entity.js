const { EntitySchema } = require('typeorm');
const {baseColumns} = require('./base.entities');

module.exports = new EntitySchema({
    name: 'Accounts',
    tableName: 'accounts',
    columns: {
        id:{
            type: 'int',
            primary: true,
            generated: true,
        },
        email:{
            type: 'varchar',
            unique: true,
        },
        password:{
            type: 'varchar',
        },
        refreshTokenHash:{
            type: 'varchar',
            length: 64,
            nullable: true,
        },
        fullname:{
            type: 'varchar',
            nullable: true,
        },
        avatar:{
            type: 'varchar',
            nullable: true,
        },
        role:{
            type: 'varchar',
             default: 'user',
        },
        relations: {
            type: 'varchar',
            nullable: true,
        },
        ...baseColumns
    },
    relations: {
        interviewSessions: {
            type: 'one-to-many',
            target: 'InterviewSessions',
            inverseSide: 'account'
        },
        practiceHistories: {
            type: 'one-to-many',
            target: 'PracticeHistories',
            inverseSide: 'account'
        }
    }
})