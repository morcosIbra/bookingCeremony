import i18n from '../../localization';
import dowloadCsv from '../../utils/csvHelper';
import dowloadPdf from '../../utils/PdfHelper';
import moment from 'moment';
const db = require("../../db");
const Pascha = db.Pascha;
var ObjectID = require('mongodb').ObjectID;

const Phase = require('./phase');


export const create = async (req, res) => {
  const pascha = new Pascha({
    seats: req.body.seats,
    date: req.body.date,
    description: req.body.description,
  });

  var result = await pascha.save()

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
  if (isAdmin == undefined)
    isAdmin = "false";
  if (neededSeats == undefined)
    neededSeats = 0;
  const activephase = await Phase.getActivePhase();
  const result = Pascha.aggregate(
    [{
      $project: {
        reservedSeats: 1,
        seats: 1,
        date: 1,
        description: 1
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
        description: 1,
        _id: 0,
        id: 1,
        remainingSeats: 1
      }
    }
    ]);

  result.then(data => {
    data.forEach(item => item.remainingSeats = item.seats - item.reservedSeats.filter(a => a.adminSeat == undefined || a.adminSeat == false).length);

    data = data.filter(hm => hm.remainingSeats >= neededSeats);
    if (isAdmin == "true")
      res.send(data);
    else {
      data.forEach(item => item.reservedSeats = []);
      res.send(data);
    }
  })
    .catch(error => {
      res.send(error);
    });

};

export const findOne = (req, res) => {

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
  Pascha.findOne(query)
    .then(data => {
      if (!data)
        res.status(404).send({
          message: i18n.__("objectNotExists")
        });
      else {

        if (req.query.export) {

          const filename = `${moment(data.date.toISOString().replace('Z', ''))
            .format('LLL')}`
          if (req.query.export === 'csv') {
            const reservations = data.reservedSeats.map(reserved => {
              reserved.bookDate.setHours(reserved.bookDate.getHours() + 2);
              //  reserved.bookDate = moment(reserved.bookDate).format('LLLL') + '';
             

              return reserved;
            })


            dowloadCsv(res, filename, exportFields, reservations);
          } else
            dowloadPdf(res, filename, 'table', exportFields, data.reservedSeats);
        } else
          res.status(200).send(data);
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

export const update = async (req, res) => {

  const pascha = await Pascha.findById(req.body.id);
  pascha.date = req.body.date;
  pascha.seats = req.body.seats;
  pascha.description = req.body.description;
  pascha.save();
  return res.status(200).send(pascha);

};

export const deleteOne = (req, res) => {
  const id = req.params.id;

  Pascha.findByIdAndRemove(id, {
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
  if (isAdmin == undefined || isAdmin == null || isAdmin === 'false')
    isAdmin = false;
  let result = [];
  const activephase = await Phase.getActivePhase();
  const pascha = await Pascha.findOne({
    _id: bookingList[0].id
  });
  if (!!isAdmin || (pascha.seats - pascha.reservedSeats.filter(a => a.adminSeat == undefined || a.adminSeat == false).length >= bookingList.length)) {
    for (let index = 0; index < bookingList.length; index++) {
      const element = await bookAMember(bookingList[index], activephase, !!isAdmin);
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
  const churchMember = await db.ChurchMember.findOne({
    _id: item.memberId
  });
  if (churchMember != null) {
    if (churchMember.lastPascha != null && churchMember.lastPascha != undefined) {
      if (!isAdmin && new Date(churchMember.lastPascha.date) < new Date()
        && churchMember.lastPascha.date >= activephase.startDate
        && churchMember.lastPascha.date <= activephase.endDate
      ) {
        const reservationError = { error: i18n.__("generalError") };
        return reservationError;
      }
      var id = churchMember.lastPascha.id;
      if (id) {
        const pascha = await db.Pascha.findById(id);
        var reservedSeats_filtered = pascha.reservedSeats.filter(function (el) {
          return el.memberId != item.memberId;
        });
        if (reservedSeats_filtered == undefined)
          reservedSeats_filtered = [];
        pascha.reservedSeats = reservedSeats_filtered;
        await pascha.save();
      }

    }
  }

  const pascha = await Pascha.findOne({
    _id: item.id
  });
  let bookingId = Math.max.apply(Math, pascha.reservedSeats.map(function (o) {
    return o.bookingId;
  })) + 1;

  if (bookingId == undefined || bookingId == null || bookingId == -Infinity) {
    bookingId = 1;
  }

  const Reservation = {
    memberId: item.memberId,
    nationalId: churchMember.nationalId,
    fullName: churchMember.fullName,
    mobile: churchMember.mobile,
    isDeacon: churchMember.isDeacon,
    bookingId: bookingId,
    bookDate: new Date(),
    adminSeat: isAdmin
  };
  pascha.reservedSeats.push(Reservation);
  await pascha.save();
  var value = await db.ChurchMember.findOneAndUpdate({
    nationalId: churchMember.nationalId
  }, {
    $set: {
      lastPascha: {
        id: item.id,
        date: pascha.date,
        bookingId: bookingId,
        description: pascha.description
      }
    }
  },
    function (error, chmem) {
    }
  ).then(x => {});

  const reservationResponse = {
    memberId: item.memberId,
    nationalId: churchMember.nationalId,
    fullName: churchMember.fullName,
    mobile: churchMember.mobile,
    booking: {
      id: item.id,
      date: pascha.date,
      bookingId: bookingId,
      description: pascha.description
    }
  };

  return reservationResponse;

}

export const cancelSeat = async (req, res) => {
  let isAdmin = req.header("isAdmin");
  if (isAdmin == undefined || isAdmin == null || isAdmin === 'false')
    isAdmin = false;
  let churchMemberId = req.body.churchMemberId;
  const churchMember = await db.ChurchMember.findById(churchMemberId);
  const bookingDate = churchMember.lastPascha.date
  const nowDate = new Date();
  if (isAdmin || bookingDate > nowDate && (bookingDate.getDate() - nowDate.getDate() > 1 ||
    bookingDate.getDate() - nowDate.getDate() === 1 && nowDate.getHours() < 21)){
    if (churchMember != null) {
      if (churchMember.lastPascha != null && churchMember.lastPascha != undefined) {
        var id = churchMember.lastPascha.id;
        const pascha = await db.Pascha.findById(id);
        if (pascha != null) {
          await db.ChurchMember.findOneAndUpdate({
            _id: churchMemberId
          }, {
            $set: {
              lastPascha: {}
            }
          },
            function (error, chmem) {
            }
          ).then(x => {});
          var reservedSeats_filtered = pascha.reservedSeats.filter(function (el) {
            return el.memberId != churchMemberId;
          });
          if (reservedSeats_filtered == undefined)
            reservedSeats_filtered = [];
          pascha.reservedSeats = reservedSeats_filtered;
          await pascha.save();
          res.status(200).send();
        }
      }
    } else {
      res.status(404).send();
    }              
  }else {
    res.status(404).send();
  }

};

export const exportPascha = (req, res) => {
  const id = req.params.id;

  Pascha.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({
          message: i18n.__("objectNotExists")
        });

      else {
        var reservations = data.reservedSeats;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader("Content-Disposition", 'attachment; filename=pascha-' + data.date + ".csv");
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

export const searchPascha = async (req, res) => {
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;

  startDate = startDate ? new Date(startDate) : new Date();
  endDate = startDate ? new Date(endDate) : new Date();
  const result = Pascha.aggregate(
    [{
      $project: {
        reservedSeats: 1,
        seats: 1,
        date: 1,
        description: 1
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
        description: 1,
        remainingSeats: 1
      }
    }
    ]);



  result.then(data => {
    data.forEach(item => item.remainingSeats = item.seats - item.reservedSeats.filter(a => a.adminSeat == undefined || a.adminSeat == false).length);
    data.forEach(item => item.reservedSeats = []);
    res.send(data);

  })
    .catch(error => {
      res.send(error);
    });

};