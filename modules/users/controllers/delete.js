'use strict';

const findRoot = require('find-root');
const root = findRoot(__dirname);
const path = require('path');
const db = require(path.join(root, './modules'));

/**
 *
 * Deletes an existing user.
 *
 * @param {Object} req - The user request.
 * @param {Object} res - The response to be sent.
 *
 * @returns {Object} Promise.
 *
 */

module.exports = async function (req, res) {
    if (isNaN(parseInt(req.params.userId, 10))) {
        throw res.boom.badRequest();
    }
    const userId = parseInt(req.params.userId, 10);

    try {
        await db.UserGroup.destroy({where: {userId}});
        await db.User.destroy({where: {id: userId}});

        return res.status(204).send();
    } catch (err) {
        if (err instanceof db.Sequelize.ValidationError) {
            throw res.boom.badRequest();
        }
        throw err;
    }
};
