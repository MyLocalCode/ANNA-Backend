'use strict';

/**
 *
 * Get an existing group.
 *
 * @param {Object} req - The user request.
 * @param {Object} res - The response to be sent.
 *
 * @returns {Object} Promise.
 *
 */

module.exports = (db) => async function (req, res) {
    if (isNaN(parseInt(req.params.groupId, 10))) {
        throw res.boom.badRequest();
    }
    const groupId = parseInt(req.params.groupId, 10);


    const group = await db.Group.findOne({
        where: {id: groupId},
        include: ['users']
    });

    if (!group) {
        throw res.boom.notFound();
    }

    return res.status(200).json(group);
};
