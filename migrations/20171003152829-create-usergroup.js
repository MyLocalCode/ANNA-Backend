'use strict';

/**
 * Creates table 'UserGroup'
 * @module createUsergroup
 * @implements {up}
 * @implements {down}
 */

module.exports = {
  /**
   * Sets the table 'UserGroup'
   * @function up
   * @implements {id}
   * @implements {userId}
   * @implements {groupId}
   */
    up: (queryInterface, Sequelize) => queryInterface.createTable('UserGroup', {
      /**
       * The id of the UserGroup
       * @var id
       */
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        /**
         * The userId of the user who belongs to a group
         * @var userId
         */
        userId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            references: {
                model: 'Users',
                key: 'id'
            }

        },
        /**
         * The groupId to which the user belongs
         * @var groupId
         */
        groupId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            references: {
                model: 'Groups',
                key: 'id'
            }
        }
    }),
    /**
     * Resets the table 'UserGroup'
     * @function down
     */
    down: (queryInterface) => queryInterface.dropTable('UserGroup')
};
