'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Files', [{
            isDir: true
        }])
      .then(() => queryInterface.bulkInsert('Rights', [{
                    groupWrite: true,
                    groupRead: true,
                    ownerWrite: true,
                    ownerRead: true,
                    allWrite: true,
                    allRead: true
                  }])
      )
      .then(() => queryInterface.bulkInsert('Data', [{
                    name: 'root',
                    size: 0,
                    type: 'Folder',
                    fileId: 1,
                    dirId: 1,
                    ownerId: 1,
                    groupId: 1,
                    rightsId: 1,
                    createdAt: new Date(Date.now()),
                    updatedAt: new Date(Date.now())
                  }])
      )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};