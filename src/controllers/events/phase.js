import Joi from 'joi';
import i18n from '../../localization';
import Phase from '../../db/models/phase';

exports.find = (req,res) => {
    Phase.find({Active: true})
        .then(data => {
            if(!data)
                res.status(404).send({
                    message: i18n.__("objectNotExists")
                });
            else res.send(data);
        })
        .catch(err => {
            res.status(404).send({
                message: i18n.__('objectNotExists')
            })
        })
}
exports.update = (req,res) => {
    const {
        error
    } = validatePhase(req.body)
    if (error) return res.status(400).send(err.details[0].message)

    Phase.findByIdAndUpdate(req.params.id,{
        title: req.body.title,
        Startdate: req.body.Startdate,
        Enddate: req.body.Enddate,
        Active: req.body.Active
    },{new: true})
    .then(data => {
        if(!data)
            return res.status(404).send({message: i18n.__("objectNotExists")})
        res.send(data);
    })
    .catch(err => {
        res.status(404).send({
            message: i18n.__("objectNotExists")
        })
    })
}


exports.create = async(req,res) => {
    const {
        error
    } = validatePhase(req.body);
    if (error) return res.status(400).send(err.details[0].message)

    const phase = new Phase({
        title: req.body.title,
        Startdate: req.body.Startdate,
        Enddate: req.body.Enddate,
        Active: req.body.Active,
    })
    var result = await phase.save()
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
}


function validatePhase(phase) {
    const schema = {
        title: Joi.string().required().error(() => {
            return {
                message: i18n.__('tileRequired')
            };
        }),
        Startdate: Joi.date().required().error(() => {
            return {
                message: i18n.__('dateRequired')
            };
        }),
        Enddate: Joi.date().required().error(() => {
            return {
                message: i18n.__('dateRequired')
            };
        }),
        Active: Joi.boolean()

    };

    return Joi.validate(phase, schema);
}