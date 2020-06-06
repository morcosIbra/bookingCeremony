
import i18n from '../../localization';
const db = require("../../db");
const Holymass = db.Holymass;

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

export const findAll = (req, res) => {
   const result =  Holymass
    .aggregate(
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
              date : {$gt : new Date()}
            }}
    ]);
    console.log(result);
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

export const bookSeat =(req,res) =>{
  

};

export const cancelSeat =(req,res) =>{
  
};
