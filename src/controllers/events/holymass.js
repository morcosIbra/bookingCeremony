
import i18n from '../../localization';
const db = require("../../db");
const Holymass = db.Holymass;
const Phase = require('./phase');


export const create = async (req, res) => {
  
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

export const findAll = async (req, res) => {
  const activephase = await Phase.getActivePhase();
   const result =  Holymass .aggregate(
    [
       {
        $project : {
            reservedSeats: 1,
            seats: 1,
            date: 1,                
        }
       }
    ]
    )
    .append([
      {
            $match : {
               date : { $gte : new Date(activephase.Startdate) , $lte : new Date(activephase.Enddate) } 
            }},
            {$sort: { date: 1 } 
          }
    ]);
   
    
    result.then(data=> {
      data.forEach(item=> item.remainingSeats = item.seats - item.reservedSeats.length);
      res.send(data);
    }
      )
    .catch(error => { console.log(error); res.send(error);});
    //.find()    
    // .then(data => {   
  
    //         res.send(data);
    //       }).catch(err => {
    //           console.log(err);
    //         res
    //             .status(404)
    //             .send({
    //                 message: i18n.__("objectNotExists")
    //             });
    //     });
   // res.send(result);
        
};

export const findOne = (req, res) => {
    const id = req.params.id;

    Holymass.findById(id)
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

export const update = async (req, res) => {
    
    const holymass= await Holymass.findById(req.body.id);
    console.log(holymass);
    holymass.date =req.body.date;
    holymass.seats =req.body.seats;
    holymass.save();
    return res.status(200).send(holymass);

};

export const deleteOne = (req, res) => {
    const id = req.params.id;
    
    Holymass.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: i18n.__("objectNotExists")
        });
      } else {
        res.send({
          message: "event was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete event with id=" + id
      });
    });
};

export const bookSeat = async (req, res) =>{  
  let holymassId = req.param.holymassId; 
  let churchMember = req.body;
  const holymass = await Holymass.findById(holymassId);
  holymass.reservedSeats.push(churchMember);
  holymass.save();
};

export const cancelSeat =async (req,res) =>{
  let holymassId = req.param.holymassId; 
  let churchMemberId = req.param.churchMemberId;
  const holymass = await Holymass.findById(holymassId);
  const member = holymass.reservedSeats.id(churchMemberId);
  member.remove();
  holymass.save();
};
