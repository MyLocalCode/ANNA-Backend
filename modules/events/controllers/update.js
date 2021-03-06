'use strict';

const policy = require('../event_policy');
const joi = require('joi');

const schema = joi.object().keys({
    name: joi.string(),
    markdown: joi.string(),
    maxRegistered: joi.number().integer(),
    startDate: joi.string(),
    endDate: joi.string()
});


/**
 * @param {obj} db - The databas.
 * @returns {Function} - The controller.
 */
module.exports = (db) =>

/**
 *
 * Updates an existing event.
 *
 * @param {Object} req - The user request.
 * @param {Object} res - The response to be sent.
 *
 * @returns {Object} Promise.
 *
 */
    async function (req, res) {
        if (isNaN(parseInt(req.params.eventId, 10))) {
            return res.boom.badRequest();
        }
        const eventId = parseInt(req.params.eventId, 10);

        // Validate user input
        const validation = joi.validate(req.body, schema);

        if (validation.error) {
            return res.boom.badRequest(validation.error);
        }

        /*
         * To lower case to avoid security problems
         * (users trying to create 'auTHOrs' group to gain rights)
         */
        if (req.body.name) {
            req.body.name = req.body.name.toLowerCase();
        }

        // Check authorization
        const authorized = await policy.filterUpdate(req.session.auth);

        if (!authorized) {
            return res.boom.unauthorized();
        }


        // Update event
        const event = await db.Event.findById(eventId);

        if (!event) {
            return res.boom.notFound();
        }

        await event.update(req.body);


        // Send response
        return res.status(204).json(event);


    };
