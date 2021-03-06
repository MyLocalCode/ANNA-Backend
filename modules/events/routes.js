/* eslint new-cap: 0 */

'use strict';


module.exports = (db) => {
    const router = require('express').Router();
    const eventController = require('./controllers')(db);

    router.route('/')
        .get(eventController.list)
        .post(eventController.store);

    router.route('/:eventId([0-9]+)')
        .get(eventController.show)
        .put(eventController.update)
        .delete(eventController.delete);

    router.route('/:eventId([0-9]+)/register/:userId([0-9]+)')
        .put(eventController.addAttendant)
        .delete(eventController.removeAttendant);

    router.route('/:eventId([0-9]+)/register')
        .put(eventController.addAttendant)
        .delete(eventController.removeAttendant);

    return router;
};
