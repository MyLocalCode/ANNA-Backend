'use strict';

const db = require('../../models');
const policy = require('../../policies/post_policy');


/**
 *
 * Get all existing posts.
 * Can get altered with scopes to filter publishing.
 *
 * @example GET /posts?published=true  -> return all published posts
 * @example GET /posts?published=false -> return all drafter posts
 *
 * @param {obj} req     - The user request.
 * @param {obj} res     - The response to be sent.
 * @param {obj} handle  - The error handling function.
 *
 * @returns {Object} Promise.
 *
 */
exports.index = function (req, res, handle) {
    let posts = db.Post;

    if (req.query.published) {
        if (req.query.published === 'true') {
            posts = posts.scope('published');
        } else if (req.query.published === 'false') {
            posts = posts.scope('draft');
        }
    }

    return posts.findAll({
        include: ['author'],
        order: [
            [
                'createdAt',
                'DESC'
            ]
        ]
    })
        .then((postsResponse) => policy.filterIndex(postsResponse, req.session.auth))
        .then((postsFiltered) => res.status(200).json(postsFiltered))
        .catch((err) => handle(err));
};

/**
 *
 * Get an existing post.
 *
 * @param {obj} req     - The user request.
 * @param {obj} res     - The response to be sent.
 * @param {obj} handle  - The error handling function.
 *
 * @returns {Object} Promise.
 *
 */
exports.show = function (req, res, handle) {
    if (isNaN(parseInt(req.params.postId, 10))) {
        throw res.boom.badRequest();
    }
    const postId = parseInt(req.params.postId, 10);

    return db.Post.findOne({
        where: {id: postId},
        include: ['author']
    })
        .then((post) => {
            if (!post) {
                throw res.boom.notFound();
            }

            return post;
        })
        .then((post) => policy.filterShow(post, req.session.auth))
        .then((post) => res.status(200).json(post))
        .catch((err) => handle(err));
};

/**
 *
 * Create and store a new post.
 *
 * @param {Object} req - The user request.
 * @param {Object} res - The response to be sent.
 * @param {Object} handle - The error handling function.
 *
 * @returns {Object} Promise.
 *
 */
exports.store = function (req, res, handle) {
    return policy.filterStore(req.session.auth)
        .then(() => db.Post.create(req.body))
        .then((post) => res.status(201).json(post))
        .catch((err) => {
            if (err instanceof db.Sequelize.ValidationError) {
                res.boom.badRequest(err);
            }
            throw err;
        })
        .catch((err) => handle(err));
};

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
exports.update = function (req, res, handle) {
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

/**
 *
 * Deletes an existing post.
 *
 * @param {obj} req     - The user request.
 * @param {obj} res     - The response to be sent.
 * @param {obj} handle  - The error handling function.
 *
 * @returns {Object} Promise.
 *
 */
exports.delete = function (req, res, handle) {
    if (isNaN(parseInt(req.params.postId, 10))) {
        throw res.boom.badRequest();
    }
    const postId = parseInt(req.params.postId, 10);

    return policy.filterDelete(req.session.auth)
        .then(() => db.Post.destroy({where: {id: postId}}))
        .then(() => res.status(204).json({}))
        .catch(db.Sequelize.ValidationError, () => res.boom.badRequest())
        .catch((err) => handle(err));
};