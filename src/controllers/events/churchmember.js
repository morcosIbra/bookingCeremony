import i18n from '../../localization';
const db = require("../../db");


export const findOne = (req,res)=>{
    const id = req.params.id;

   db.ChurchMember.findById(id)
        .then(data => {
            if(!data)
                res.status(404).send({
                    message: i18n.__('objectNotExists')
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