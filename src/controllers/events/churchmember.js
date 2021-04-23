import i18n from '../../localization';
import ChurchMember from '../../db/models/churchMember';
import Holymass from '../../db/models/holyMass';
import Pascha from '../../db/models/pascha';
import downloadResource from '../../utils/csvHelper';
import EveningPrayer from '../../db/models/eveningPrayer';

exports.find = (req, res) => {
    // const id = req.params.id;
    ChurchMember.findOne({ ...req.query })
        .then(data => {
          
            if (!data)
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

exports.findOne = (req, res) => {
    const id = req.params.id;

    ChurchMember.findById(id)
        .then(data => {
            if (!data)
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
exports.putInfo = async (req, res) => {
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const members = req.body.data;
     let result = [];
    for (var i = 0; i < members.length; i++) {
        const query = members[i].nationalId ? { nationalId: members[i].nationalId }
            : { _id: members[i]._id };
         // break
        delete members[i].lastEveningPrayer;
        delete members[i].lastPascha;
        result.push(await ChurchMember.findOneAndUpdate(query, { ...members[i] }, options,
            function (error, member) {
              
                if (error) return res.status(404).send({
                    message: i18n.__('generalError')
                });
                updateInfoInReservation(member);
                return member;
                // do something with the document
            }));

    };
    return res.send(result);


};
exports.delete = async (req, res) => {
    const id = req.params.id;

    var churchMember = await ChurchMember.findById(id);
    if (churchMember != null) {
        if (churchMember.lastBooking != null && churchMember.lastBooking != undefined) {
            if (new Date(churchMember.lastBooking.date) > new Date()) {
                var holymass = await Holymass.findById(churchMember.lastBooking.holymassId);
                var reservedSeats_filtered = holymass.reservedSeats.filter(function (el) {
                    return el.memberId != churchMember.id;
                });
                holymass.reservedSeats = reservedSeats_filtered;
                holymass.save();
            }
        }
        if (churchMember.lastPascha != null && churchMember.lastPascha != undefined) {
            if (new Date(churchMember.lastPascha.date) > new Date()) {
                var pascha = await Pascha.findById(churchMember.lastPascha.id);
                var reservedSeats_filtered = pascha.reservedSeats.filter(function (el) {
                    return el.memberId != churchMember.id;
                });
                pascha.reservedSeats = reservedSeats_filtered;
                pascha.save();
            }
        }
        if (churchMember.lastEveningPrayer != null && churchMember.lastEveningPrayer != undefined) {
            if (new Date(churchMember.lastEveningPrayer.date) > new Date()) {
                var eveningPrayer = await EveningPrayer.findById(churchMember.lastEveningPrayer.id);
                var reservedSeats_filtered = eveningPrayer.reservedSeats.filter(function (el) {
                    return el.memberId != churchMember.id;
                });
                eveningPrayer.reservedSeats = reservedSeats_filtered;
                eveningPrayer.save();
            }
        }
    }

    ChurchMember.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    message: i18n.__('objectNotExists')
                })
            }
            res.status(200).send({ message: "Deleted " })
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NoteFound') {
                return res.status(404).send({ message: i18n.__('objectNotExists') })
            }
            return res.status(500).send({ message: i18n.__('generalError') })
        })

}

exports.search = (req, res) => {
    // const id = req.params.id;
    let createdAtDate = req.query.createDate;
    if (createdAtDate == undefined)
        createdAtDate = new Date().setHours(0, 0, 0, 0);
    else
        createdAtDate = new Date(createdAtDate).setHours(0, 0, 0, 0);

    const exportFields = [
        {
            label: 'Full Name',
            value: 'fullName'
        },
        {
            label: 'National Id',
            value: 'nationalId'
        }, {
            label: 'Mobile',
            value: 'mobile'
        },
        {
            label: 'Building',
            value: 'building'
        },
        {
            label: 'Street',
            value: 'street'
        },
        {
            label: 'Floor',
            value: 'floor'
        }, {
            label: 'Apartment',
            value: 'apartment'
        },
        {
            label: 'Region',
            value: 'region'
        }, {
            label: 'Last Booking Holymass',
            value: 'lastBooking'
        }, {
            label: 'Last Booking Vesper',
            value: 'lastEveningPrayer'
        },{
            label: 'Last Booking Pascha',
            value: 'lastPascha'
        }, {
            label: 'Active',
            value: 'active'
        }, {
            label: 'Deacon',
            value: 'isDeacon'
        }
    ];

    ChurchMember.find({ createdAt: { $gte: createdAtDate } })
        .then(data => {
           
            if (!data)
                res.status(404).send({
                    message: i18n.__('objectNotExists')
                });
            else {
                if (req.query.export == "csv") {

                    downloadResource(res, 'churchMembers_' + req.query.createDate, exportFields, data);
                } else
                    res.status(200).send(data);
            }
        }
        )
        .catch(err => {
           
            res.status(404).send({
                message: i18n.__("objectNotExists")
            });
        });
};

async function updateInfoInReservation(member) {
    if (member.lastBooking != null && member.lastBooking != undefined) {
        if (new Date(member.lastBooking.date) > new Date()) {
            var holymass = await Holymass.findById(member.lastBooking.holymassId);
            let objIndex = holymass.reservedSeats.findIndex((obj => obj.memberId == member.id));
            if (objIndex != null && objIndex != undefined) {
                holymass.reservedSeats[objIndex].nationalId = member.nationalId;
                holymass.reservedSeats[objIndex].fullName = member.fullName;
                holymass.reservedSeats[objIndex].mobile = member.mobile;
                holymass.save();
            }
        }
    }
    if (member.lastEveningPrayer != null && member.lastEveningPrayer != undefined) {
        if (new Date(member.lastEveningPrayer.date) > new Date()) {
            const eveningPrayer = await EveningPrayer.findById(member.lastEveningPrayer.id);
            let objIndex = eveningPrayer.reservedSeats.findIndex((obj => obj.memberId == member.id));
            if (objIndex != null && objIndex != undefined) {
                eveningPrayer.reservedSeats[objIndex].nationalId = member.nationalId;
                eveningPrayer.reservedSeats[objIndex].fullName = member.fullName;
                eveningPrayer.reservedSeats[objIndex].mobile = member.mobile;
                eveningPrayer.save();
            }
        }
    }
    if (member.lastPascha != null && member.lastPascha != undefined) {
        if (new Date(member.lastPascha.date) > new Date()) {
            const pascha = await Pascha.findById(member.lastPascha.id);
            let objIndex = pascha.reservedSeats.findIndex((obj => obj.memberId == member.id));
            if (objIndex != null && objIndex != undefined) {
                pascha.reservedSeats[objIndex].nationalId = member.nationalId;
                pascha.reservedSeats[objIndex].fullName = member.fullName;
                pascha.reservedSeats[objIndex].mobile = member.mobile;
                pascha.save();
            }
        }
    }
}