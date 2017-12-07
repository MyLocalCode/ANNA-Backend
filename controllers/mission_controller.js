'use strict';

const db = require('../models');

exports.index = function (req, res, handle) {
    db.Missions.findAll().
        then((missions) => res.status(200).json(missions)).
        catch((err) => handle(err));
};

exports.show = function (req, res, handle) {
    db.Missions.findOne({
        where: {id: req.params.missionId},
        rejectOnEmpty: true
    }).
        then((mission) => {
            if (mission) {
                return res.status(200).json(mission);
            }
            throw res.boom.notFound();

        }).
        catch((err) => handle(err));
};

exports.store = function (req, res, handle) {
    db.Missions.create(req.body).
        then((mission) => res.status(201).json(mission)).
        catch(db.Sequelize.ValidationError, () => res.boom.badRequest()).
        catch((err) => handle(err));
};

exports.update = function (req, res, handle) {
    db.Missions.update(req.body, {where: {id: req.params.missionId}}).
        then(() => res.status(204).json({})).
        catch(db.Sequelize.ValidationError, () => res.boom.badRequest()).
        catch((err) => handle(err));
};

exports.delete = function (req, res, handle) {
    db.Missions.destroy({where: {id: req.params.missionId}}).
        then(() => res.status(204).json({})).
        catch((err) => handle(err));
};
