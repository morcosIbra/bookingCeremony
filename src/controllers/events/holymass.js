
import i18n from '../../localization';
import { boolean } from 'joi';
const db = require("../../db");
const Holymass = db.Holymass;
var ObjectID = require('mongodb').ObjectID;   

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
  let isAdmin = req.query.isadmin;
  if(isAdmin == undefined)
    isAdmin = "false";
  const activephase = await Phase.getActivePhase();
  console.log(activephase);
  console.log(activephase.enddate);
  console.log(activephase.startDate);
   const result =  Holymass.aggregate(
    [
       {
        $project : {
            reservedSeats: 1,
            seats: 1,
            date: 1       
        }
       }
    ]
    )
    .append([
      {
            $match : {
               date : { $gte : new Date(activephase.startDate) , $lte : new Date(activephase.endDate) } 
            }},
            {$sort: { date: 1 } 
          },
          { 
            $addFields: { id: "$_id", remainingSeats : "$seats - $reservedSeats.length" }
          },
          {
            $project : {
                reservedSeats: 1,
                seats: 1,
                date: 1,  
                _id: 0,
                id:1        
            }
           }
    ]);
   
       
    
    result.then(data=> {
      data.forEach(item=> item.remainingSeats = item.seats - item.reservedSeats.length);
      if(isAdmin == "true")
        res.send(data);
      else{
      data.forEach(item=> item.reservedSeats = []);        
        res.send(data);
    }
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
  let bookingList = req.body;
  bookingList.forEach(bookAMember);  
};

async function bookAMember(item)
{
    let memberId = item.memberId; 
    let holymassId = item.holymassId; 
    const churchMember = await db.ChurchMember.find({_id : item.memberId});
    const holymass = await Holymass.find({_id : item.holymassId});
    console.log("churchMemberid : " + churchMember + "  holymassId : "+ holymass);
    const Reservation = {
      Id: memberId,
      nationalId: churchMember.nationalId,
      fullName: churchMember.fullName,
      mobile: churchMember.mobile,
      bookingId:holymass.reservedSeats.length + 1};
    holymass.reservedSeats.push(Reservation);
    holymass.save();
    // add last booking objects
} 

export const cancelSeat =async (req,res) =>{
  let holymassId = req.param.holymassId; 
  let churchMemberId = req.param.churchMemberId;
  const holymass = await Holymass.findById(holymassId);
  const member = holymass.reservedSeats.id(churchMemberId);
  member.remove();
  holymass.save();
};
