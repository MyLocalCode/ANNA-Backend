'use strict';


/**
 * @file Defines a model for 'Data' table in database and its associations with the other tables
 * @see {@link module:data}
 */

/**
 * @module data
 */

require('dotenv').config();

const repo = require('../repository');
const dataRep = require('../repository/data');


/**
 * @constant computeValues
 * @param {Object} data - Data.
 * @implements {getPath}
 * @returns {Promise} The promise to retur data path or an error.
 */
const computeValues = (data) => {
    const typeP = data.getPath()
        .then((dataPath) => repo.computeType(dataPath))
        .then((type) => {
            data.type = type;

            return true;
        })
        .catch(() => {
            data.type = '';

            return true;
        });

    const sizeP = data.getPath()
        .then((dataPath) => repo.computeSize(dataPath))
        .then((size) => {
            data.size = size;

            return true;
        })
        .catch(() => {
            data.size = -1;

            return true;
        });

    return Promise.all([
        sizeP,
        typeP
    ]);
};

/**
 * @function exports
 *
 * @param {Object} sequelize - The Sequelize object.
 * @param {Object} DataTypes - DataTypes.
 *
 * @returns {Object} Returns Data.
 *
 */
module.exports = (sequelize, DataTypes) => {

    /**
     * Defines a mapping between model and table 'Data'
     * @function Data
     *
     * @param {Obect} Data The table defined by the function
     *
     * @implements {name}
     * @implements {type}
     * @implements {size}
     * @implements {exists}
     * @implements {fileId}
     * @implements {dirId}
     * @implements {ownerId}
     * @implements {rightsId}
     * @implements {groupId}
     * @implements {isDir}
     * @implements {children}
     * @implements {timestamps}
     * @implements {hooks}
     * @implements {freezeTableName}
     *
     */
    const Data = sequelize.define('Data', {

        /**
         * @var {STRING} name
         */
        name: {
            allowNull: false,
            type: DataTypes.STRING
        },

        /**
         * @var {STRING} type
         */
        type: {
            allowNull: true,
            type: DataTypes.STRING
        },

        /**
         * @var {INTEGER} size
         */
        size: {
            allowNull: true,
            type: DataTypes.INTEGER
        },

        /**
         * @var {BOOLEAN} exists
         */
        exists: {
            allowNull: false,
            defaultValue: true,
            type: DataTypes.BOOLEAN
        },

        /**
         * @var {INTEGER} fileId
         */
        fileId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },

        /**
         * @var {INTEGER} dirId
         */
        dirId: {
            allowNull: false,
            defaultValue: 1,
            type: DataTypes.INTEGER
        },

        /**
         * @var {INTEGER} ownerId
         */
        ownerId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },

        /**
         * @var {INTEGER} rightsId
         */
        rightsId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },

        /**
         * @var {INTEGER} groupId
         */
        groupId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },

        /**
         * @var {BOOLEAN} hidden
         */
        hidden: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        timestamps: true,
        paranoid: true,
        hooks: {
            beforeCreate: computeValues,
            beforeUpdate: computeValues
        },
        freezeTableName: true
    });


    /**
     * Associates Data to other tables.
     *
     * @function associate
     * @param {obj} db2 - The database.
     * @returns {Promise} The promise to create associations.
     */
    Data.associate = function (db2) {

        /**
         * Creates singular association with table 'File'
         * @function belongsToFile
         */
        Data.belongsTo(db2.File, {
            foreignKey: 'fileId',
            as: 'file',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        });

        /**
         * Creates singular association with table 'User'
         * @function belongsToUser
         */
        Data.belongsTo(db2.User, {
            foreignKey: 'ownerId',
            as: 'author',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        });

        /**
         * Creates singular association with table 'Right'
         * @function belongsToRight
         */
        Data.belongsTo(db2.Right, {
            foreignKey: 'rightsId',
            as: 'rights',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        });

        /**
         * Createssingular  association with table 'Group'
         * @function belongsToGroup
         */
        Data.belongsTo(db2.Group, {
            foreignKey: 'groupId',
            as: 'group',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        });

        /**
         * Creates singular association with table 'Data'
         * @function belongsToData
         */
        Data.belongsTo(db2.Data, {
            foreignKey: 'dirId',
            as: 'directory',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        });

        /**
         * Creates plural associations with table 'Data'
         * @function hasManyData
         */
        Data.hasMany(db2.Data, {
            foreignKey: 'dirId',
            as: 'files',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        });

        dataRep.setupPrototype(Data, sequelize);
    };


    return Data;
};
