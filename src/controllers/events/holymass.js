import i18n from '../../localization';
import dowloadCsv from '../../utils/csvHelper';
import dowloadPdf from '../../utils/PdfHelper';
import moment from 'moment';
const db = require("../../db");
const Holymass = db.Holymass;
var ObjectID = require('mongodb').ObjectID;

const Phase = require('./phase');


export const create = async (req, res) => {

  const holymass = new Holymass({
    seats: req.body.seats,
    date: req.body.date,
    description: req.body.description,
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
  console.log('in all');
  let isAdmin = req.query.isadmin;
  let neededSeats = req.query.neededSeats;
  if (isAdmin == undefined)
    isAdmin = "false";
  if (neededSeats == undefined)
    neededSeats = 0;
  const activephase = await Phase.getActivePhase();
  console.log(activephase);

  const result = Holymass.aggregate(
    [{
      $project: {
        reservedSeats: 1,
        seats: 1,
        date: 1,
        description:1
      }
    }]
  )
    .append([{
      $match: {
        date: {
          $gte: new Date(activephase.startDate) > new Date() ?
            new Date(activephase.startDate) : new Date(),
          $lte: new Date(activephase.endDate)
        }
      }
    },
    {
      $sort: {
        date: 1
      }
    },
    {
      $addFields: {
        id: "$_id",
        remainingSeats: "$seats - $reservedSeats.length"
      }
    },
    {
      $project: {
        reservedSeats: 1,
        seats: 1,
        date: 1,
        description:1,
        _id: 0,
        id: 1,
        remainingSeats: 1
      }
    }
    ]);


console.log('result= ',result);
  result.then(data => {
    data.forEach(item => item.remainingSeats = item.seats - item.reservedSeats.filter(a=> a.adminSeat == undefined || a.adminSeat == false).length);
    console.log(data);

    data = data.filter(hm => hm.remainingSeats >= neededSeats);
    if (isAdmin == "true")
      res.send(data);
    else {
      data.forEach(item => item.reservedSeats = []);
      res.send(data);
    }
  })
    .catch(error => {
      console.log(error);
      res.send(error);
    });

};

export const findOne = (req, res) => {
  console.log(req.query, req.params);

  const exportFields = [
    {
      label: 'Booking Id',
      value: 'bookingId'
    },
    {
      label: 'National Id',
      value: 'nationalId'
    },
    {
      label: 'Full Name',
      value: 'fullName'
    },
    {
      label: 'Mobile',
      value: 'mobile'
    },
    {
      label: 'Is Deacon',
      value: 'isDeacon'
    },
    {
      label: 'Booking Date',
      value: 'bookDate'
    },
    {
      label: 'Admin Seat',
      value: 'adminSeat'
    }
  ];
  let query = {}
  if (req.params && req.params.id) {
    query = { _id: req.params.id }
  } else {
    query = { date: new Date(req.query.date + 'Z') }
  }
  // const id = req.params.id;
  Holymass.findOne(query)
    .then(data => {
      if (!data)
        res.status(404).send({
          message: i18n.__("objectNotExists")
        });
      else {
        console.log(req.query.export);

        if (req.query.export) {

          const filename = `${moment(data.date.toISOString().replace('Z', ''))
            .format('LLL')}`
          if (req.query.export === 'csv') {
            const reservations = data.reservedSeats.map(reserved => {
              reserved.bookDate.setHours(reserved.bookDate.getHours() + 2);
              //  reserved.bookDate = moment(reserved.bookDate).format('LLLL') + '';
              console.log(reserved);

              return reserved;
            })
            console.log(reservations);


            dowloadCsv(res, filename, exportFields, reservations);
          } else
            dowloadPdf(res, filename, 'table', exportFields, data.reservedSeats);
        } else
          res.status(200).send(data);
      }
    })
    .catch(err => {
      console.log(err);

      res
        .status(404)
        .send({
          message: i18n.__("objectNotExists")
        });
    });
};

export const update = async (req, res) => {

  const holymass = await Holymass.findById(req.body.id);
  console.log(holymass);
  holymass.date = req.body.date;
  holymass.seats = req.body.seats;
  holymass.description = req.body.description;
  holymass.save();
  return res.status(200).send(holymass);

};

export const deleteOne = (req, res) => {
  const id = req.params.id;

  Holymass.findByIdAndRemove(id, {
    useFindAndModify: false
  })
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

export const bookSeat = async (req, res) => {
  let bookingList = req.body;
  let isAdmin = req.header("isAdmin");
  console.log("admin header : " + isAdmin);
  if(isAdmin == undefined || isAdmin == null)
      isAdmin= false;
  let result = [];
  const activephase = await Phase.getActivePhase();
  const holymass = await Holymass.findOne({
    _id: bookingList[0].holymassId
  });
  if (isAdmin || (holymass.seats - holymass.reservedSeats.filter(a=> a.adminSeat == undefined || a.adminSeat == false).length >= bookingList.length)) {
    for (let index = 0; index < bookingList.length; index++) {
      const element = await bookAMember(bookingList[index], activephase, isAdmin);
      result.push(element);
    }
  }
  else {
    result.push({ error: i18n.__("NotEnoughSeats") });
    res.status(400);
  }
  res.send(result);
};

async function bookAMember(item, activephase, isAdmin) {
  console.log("admin headerin booking : " + isAdmin);
  const churchMember = await db.ChurchMember.findOne({
    _id: item.memberId
  });
console.log('churchMember= ',churchMember);
  if (churchMember != null) {
    if (churchMember.lastBooking != null && churchMember.lastBooking != undefined) {
      if(!isAdmin && (churchMember.lastBooking.date >= activephase.startDate && churchMember.lastBooking.date <= activephase.endDate))
      {
        const reservationError= { error: i18n.__("generalError")};
        return reservationError;
      }
    }
  }

  const holymass = await Holymass.findOne({
    _id: item.holymassId
  });
  let bookingId = Math.max.apply(Math, holymass.reservedSeats.map(function (o) {
    return o.bookingId;
  })) + 1;
  
  if (bookingId == undefined || bookingId == null || bookingId == -Infinity)
  {
      bookingId = 1;
  }
  
  const Reservation = {
    memberId: item.memberId,
    nationalId: churchMember.nationalId,
    fullName: churchMember.fullName,
    mobile: churchMember.mobile,
    isDeacon : churchMember.isDeacon,
    bookingId: bookingId,
    bookDate: new Date(),
    adminSeat : isAdmin
  };
  console.log(Reservation);
  holymass.reservedSeats.push(Reservation);
  holymass.save();
console.log(holymass.description);
  var value = await db.ChurchMember.findOneAndUpdate({
    nationalId: churchMember.nationalId
  }, {
    $set: {
      lastBooking: {
        holymassId: item.holymassId,
        date: holymass.date,
        bookingId: bookingId,
        description: holymass.description
      }
    }
  },
    function (error, chmem) {
      console.log("error: " + error);
      console.log("chmem: " + chmem);
    }
  ).then(x => console.log(x));

  const reservationResponse = {
    memberId: item.memberId,
    nationalId: churchMember.nationalId,
    fullName: churchMember.fullName,
    mobile: churchMember.mobile,
    booking: {
      holymassId: item.holymassId,
      date: holymass.date,
      bookingId: bookingId,
      description: holymass.description
    }
  };

  return reservationResponse;

}

export const cancelSeat = async (req, res) => {
  //let holymassId = req.body.holymassId; 
  let churchMemberId = req.body.churchMemberId;
  const churchMember = await db.ChurchMember.findById(churchMemberId);
  if (churchMember != null) {
    if (churchMember.lastBooking != null && churchMember.lastBooking != undefined) {
      var holymassId = churchMember.lastBooking.holymassId;
      const holymass = await db.Holymass.findById(holymassId);
      if (holymass != null) {
        await db.ChurchMember.findOneAndUpdate({
          _id: churchMemberId
        }, {
          $set: {
            lastBooking: {}
          }
        },
          function (error, chmem) {
            console.log("error: " + error);
            console.log("chmem: " + chmem);
          }
        ).then(x => console.log(x));

        console.log("reservedSeats: ");
        console.log(holymass.reservedSeats);
        var reservedSeats_filtered = holymass.reservedSeats.filter(function (el) {
          return el.memberId != churchMemberId;
        });
        console.log("reservedSeats_filtered: ");

        console.log(holymass.reservedSeats_filtered);
        if (reservedSeats_filtered == undefined)
          reservedSeats_filtered = [];
        holymass.reservedSeats = reservedSeats_filtered;
        holymass.save();
        res.status(200).send();
      }
    }
  } else {
    res.status(404).send();
  }



};

export const exportHolymass = (req, res) => {
  const id = req.params.id;

  Holymass.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({
          message: i18n.__("objectNotExists")
        });

      else {
        var reservations = data.reservedSeats;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader("Content-Disposition", 'attachment; filename=holymass-' + data.date + ".csv");
        res.csv(reservations, true);
        //res.send(data);
      }
    })
    .catch(err => {
      res
        .status(404)
        .send({
          message: i18n.__("objectNotExists")
        });
    });
};

export const searchHolymass = async (req, res) => {
  console.log("in search");
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;

  startDate = startDate ? new Date(startDate) : new Date();
  endDate = startDate ? new Date(endDate) : new Date();
console.log(startDate,endDate);
  const result = Holymass.aggregate(
    [{
      $project: {
        reservedSeats: 1,
        seats: 1,
        date: 1,
        description:1
      }
    }]
  )
    .append([{
      $match: {
        date: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $sort: {
        date: 1
      }
    },
    {
      $addFields: {
        id: "$_id",
        remainingSeats: "$seats - $reservedSeats.length"
      }
    },
    {
      $project: {
        reservedSeats: 1,
        seats: 1,
        date: 1,
        _id: 0,
        id: 1,
        description:1,
        remainingSeats: 1
      }
    }
    ]);



  result.then(data => {
    data.forEach(item => item.remainingSeats = item.seats - item.reservedSeats.filter(a=> a.adminSeat == undefined || a.adminSeat == false).length);
    data.forEach(item => item.reservedSeats = []);
    res.send(data);

  })
    .catch(error => {
      console.log(error);
      res.send(error);
    });

};