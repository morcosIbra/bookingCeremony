import Joi from 'joi';
import i18n from '../../localization';
const db = require("../../db");
const Holymass = db.Holymass;

export const create = async (req, res) => {
    const {
        error
    } = validateHolyMass(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const holymass = new Holymass({
        seats: req.body.seats,
        date: req.body.date,
    });

    var result = await holymass.save()

        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

export const findAll = (req, res) => {
    console.log("findall")
    res.sendStatus(200);
};

export const findOne = (req, res) => {
    const id = req.params.id;

    db.Holymass.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({
                    message: i18n.__("objectNotExists")
                });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(404)
                .send({
                    message: i18n.__("objectNotExists")
                });
        });
};

export const update = (req, res) => {
    const {
        error
    } = validateHolyMass(req.body);
    if (error) return res.status(400).send(error.details[0].message);
};

export const deleteOne = (req, res) => {

};


function validateHolyMass(holymass) {
    const schema = {
        seats: Joi.number().required().error(() => {
            return {
                message: i18n.__('seatsRequired')
            };
        }),
        date: Joi.date().required().error(() => {
            return {
                message: i18n.__('dateRequired')
            };
        }),
    };

    return Joi.validate(holymass, schema);
}