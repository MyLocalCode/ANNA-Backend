'use strict';

const db = require('../models');
const bcrypt = require('bcrypt');

/**
 *
 * Logs in a user
 *
 * @param {obj} req     the user request
 * @param {obj} res     the response to be sent
 * @param {obj} handle  the error handling function
 *
 * @returns {obj} promise
 *
 */
exports.login = (req, res, handle) => {
    db.User.findOne({
        where: {'username': req.body.username},
        include: ['groups']
    })
        .then((user) => {
            if (!user) {
                throw res.boom.notFound('Bad username');
            }

            return user;
        })
        .then((user) =>
            bcrypt.compare(req.body.password, user.password)
            // Check password
                .then((accept) => {
                    if (!accept) {
                        throw res.boom.unauthorized('Bad password');
                    }

                    return true;
                })
            // Set user session variables
                .then(() => {
                    req.session.auth = user.id;

                    return true;
                })
            // Send response
                .then(() => res.status(200).json({
                    id: user.id,
                    username: user.username,
                    groups: user.groups
                })))
        .catch((err) => handle(err));
};


/*
 *
 * Logs out a user
 *
 * @param {obj} req     the user request
 * @param {obj} res     the response to be sent
 * @param {obj} handle  the error handling function
 *
 * @returns {obj} promise
 *
 */
exports.logout = (req, res) => {
    req.session.auth = null;
    res.status(200).json({});
};


/*
 *
 * Checks a user is connected
 *
 * @param {obj} req     the user request
 * @param {obj} res     the response to be sent
 * @param {obj} handle  the error handling function
 *
 * @returns {obj} promise
 *
 */
exports.check = (req, res, handle) => {
    if (req.session.auth) {
        db.User.findOne({
            where: {id: req.session.auth},
            include: ['groups']
        })
            .then((user) => {
                if (user) {
                    return res.json({
                        id: user.id,
                        username: user.username,
                        groups: user.groups
                    });

                }
                throw res.boom.notFound();

            })
            .catch((err) => handle(err));
    } else {
        throw res.boom.unauthorized();
    }
};
