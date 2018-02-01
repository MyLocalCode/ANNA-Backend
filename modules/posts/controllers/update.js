'use strict';

const findRoot = require('find-root');
const root = findRoot(__dirname);
const path = require('path');
const db = require(path.join(root, './modules'));
const policy = require('../post_policy');

/**
 *
 * Updates an existing post.
 *
 * @param {obj} req     - The user request.
 * @param {obj} res     - The response to be sent.
 * @param {obj} handle  - The error handling function.
 *
 * @returns {Object} Promise.
 *
 */

module.exports = function (req, res, handle) {
    if (isNaN(parseInt(req.params.postId, 10))) {
        throw res.boom.badRequest();
    }
    const postId = parseInt(req.params.postId, 10);

    return policy.filterUpdate(req.session.auth)
        .then(() => db.Post.update(req.body, {where: {id: postId}}))
        .then((post) => {
            if (post.length === 1) {
                return res.status(200).json(post[0]);
            } else if (post.length === 0) {
                throw res.boom.notFound();
            } else {
                console.log(`Multiple posts edited ! (${post.length})`);
                throw res.boom.badImplementation();
            }
        })
        .catch(db.Sequelize.ValidationError, () => res.boom.badRequest())
        .catch((err) => handle(err));
};
