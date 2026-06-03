const baseColumns = {
    createdAt: {
        type: 'timestamp',
        createDate: true,
    },
    updatedAt: {
        type: 'timestamp',
        updateDate: true,
    },
    deletedAt: {
        type: 'timestamp',
        deleteDate: true,
        nullable: true,
    }
};

module.exports = {
    baseColumns
};
