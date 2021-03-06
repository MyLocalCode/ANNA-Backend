'use strict';

/**
 *
 * Creates a new group and stores it.
 *
 * @param {Object} req - The user request.
 * @param {Object} res - The response to be sent.
 *
 * @returns {Object} Promise.
 *
 */

module.exports = (db) => async function (req, res) {
    if (typeof req.body.name !== 'string') {

        throw res.boom.badRequest();
    }

    /*
     * To lower case to avoid security problems
     * (users trying to create 'auTHOrs' group to gain rights)
     */
    req.body.name = req.body.name.toLowerCase();

    const group = await db.Group.create(req.body);

    try {
        return res.status(201).json(group);
    } catch (err) {
        if (err instanceof db.Sequelize.ValidationError) {
            return res.boom.badRequest(err);
        }

        throw err;
    }
};
