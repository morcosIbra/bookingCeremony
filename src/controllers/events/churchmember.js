import i18n from '../../localization';
import ChurchMember from '../../db/models/churchMember'


exports.findOne = (req,res)=>{
    const id = req.params.id;

    ChurchMember.findById(id)
        .then(data => {
            if(!data)
                res.status(404).send({
                    message: i18n.__('objectNotExists')
                });
            else res.send(data);
        })
        .catch(err => {
            res.status(404).send({
                    message: i18n.__("objectNotExists")
                });
        });
};

exports.delete = (req,res)=>{
    const id = req.params.id;
    ChurchMember.findByIdAndRemove(id)
    .then(data =>{
        if(!data){
            return res.status(404).send({
                message: i18n.__('objectNotExists')
            })
        }
        res.status(200).send({message: "Deleted "})
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NoteFound'){
        return res.status(404).send({message: i18n.__('objectNotExists')})
        }
        return res.status(500).send({message: i18n.__('generalError')})
    })
    
}
