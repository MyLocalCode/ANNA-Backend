'use strict';

/**
 * @file
 * @see {@link module:event}
 */

/**
 * @module event
 */

/**
 * Get all events.
 *
 * @function filterIndex
 * @returns {Object} Returns all events.
 */
exports.filterIndex = () => Promise.resolve(true);

/**
 * Get a singular event.
 *
 * @function filterShow
 * @returns {Object} Returns one event.
 */
exports.filterShow = () => Promise.resolve(true);

/**
 * Filters users to keep only root.
 * Only root is allowed to create an event.
 *
 * @function filterStore
 *
 * @param {obj} db - The database.
 * @param {INTEGER} userId - The id of ther user verified by the function.
 *
 * @returns {boolean} Root user or error : 'Unauthorized'.
 *
 */
exports.filterStore = async (db, userId) => {
    const user = await db.User.findById(userId);

    if (user && await user.isRoot()) {
        return true;
    }

    return false;
};

/**
 * Filters users to keep only root.
 * Only root is allowed to update an event.
 *
 * @function filterUpdate
 *
 * @param {obj} db - The database.
 * @param {INTEGER} userId - The id of ther user verified by the function.
 *
 * @returns {boolean} Root user or error : 'Unauthorized'.
 *
 */
exports.filterUpdate = async (db, userId) => {
    const user = await db.User.findById(userId);

    if (user && await user.isRoot()) {
        return true;
    }

    return false;
};

/**
 * Filters users to keep only root.
 * Only root is allowed to delete an event.
 *
 * @function filterDelete
 *
 * @param {obj} db - The database.
 * @param {INTEGER} userId - The id of ther user verified by the function.
 *
 * @returns {boolean} Root user or error : 'Unauthorized'.
 *
 */
exports.filterDelete = async (db, userId) => {
    const user = await db.User.findById(userId);

    if (user && await user.isRoot()) {
        return true;
    }

    return false;
};

exports.filterStoreRegistered = async (db, eventId, targetId, userId) => {

    if (userId === targetId) {
        return true;
    }

    const user = await db.User.findById(userId);
    const userIsAdmin = await user.isRoot();

    if (userIsAdmin) {
        return true;
    }

    console.log('False !!!!!');

    return false;
};

exports.filterDeleteRegistered = async (db, eventId, targetId, userId) => {

    if (userId === targetId) {
        return true;
    }

    const user = await db.User.findById(userId);
    const userIsAdmin = await user.isRoot();

    if (userIsAdmin) {
        return true;
    }

    return false;
};
