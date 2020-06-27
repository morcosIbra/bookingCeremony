
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
  let neededSeats = req.query.neededSeats;
  if(isAdmin == undefined)
    isAdmin = "false";
  if(neededSeats == undefined)
    neededSeats = 0;
  const activephase = await Phase.getActivePhase();
  
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
                id:1,
                remainingSeats : 1        
            }
           }
    ]);
   
       
    
    result.then(data=> {
      data.forEach(item=> item.remainingSeats = item.seats - item.reservedSeats.length);
      data = data.filter(hm=> hm.remainingSeats >= neededSeats);
      if(isAdmin == "true")
        res.send(data);
      else{
      data.forEach(item=> item.reservedSeats = []);        
        res.send(data);
    }
  }
      )
    .catch(error => { console.log(error); res.send(error);});
        
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
  let result = [];
  const activephase = await Phase.getActivePhase();
  for (let index = 0; index < bookingList.length; index++) {
    const element = await bookAMember(bookingList[index], activephase);
    result.push(element);
  }
  res.send(result);  
};

async function bookAMember(item, activephase)
{    
    const churchMember = await db.ChurchMember.findOne({_id : item.memberId});
    const holymass = await Holymass.findOne({_id : item.holymassId});
    let bookingId = Math.max.apply(Math, holymass.reservedSeats.map(function(o) { return o.bookingId; })) + 1;
    console.log(bookingId);
    if(bookingId == undefined || bookingId == null || bookingId == -Infinity)
      bookingId = 1;
    const Reservation = {
      memberId: item.memberId,
      nationalId: churchMember.nationalId,
      fullName: churchMember.fullName,
      mobile: churchMember.mobile,
      bookingId:bookingId};
    holymass.reservedSeats.push(Reservation);
    holymass.save();
    
    var value = await db.ChurchMember.findOneAndUpdate({nationalId: churchMember.nationalId}, {$set : {lastBooking : {
      holymassId : item.holymassId,
      date : holymass.date,
      bookingId : bookingId
    }}},
    function(error, chmem)
    {
      console.log("error: " + error);
      console.log("chmem: " + chmem);
    }
    ).then(x=> console.log(x));

    const reservationResponse = {
      memberId: item.memberId,
      nationalId: churchMember.nationalId,
      fullName: churchMember.fullName,
      mobile: churchMember.mobile,
      booking : {holymassId : item.holymassId,
        date : holymass.date,
        bookingId : bookingId}
    };
    
    return reservationResponse;
    
} 

export const cancelSeat =async (req,res) =>{
  let holymassId = req.body.holymassId; 
  let churchMemberId = req.body.churchMemberId;
  const holymass = await Holymass.findById(holymassId);
  
  const member = holymass.reservedSeats.findOne({memberId : churchMemberId});
  if(member != null)
    {
      member.remove();
      holymass.save();
      res.send(true);
    }
    else{
      res.status(404).send();
    }
};
