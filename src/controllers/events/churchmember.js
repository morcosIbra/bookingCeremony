import i18n from '../../localization';
import ChurchMember from '../../db/models/churchMember';
import Holymass from '../../db/models/holyMass';
import downloadResource from '../../utils/csvHelper';

exports.find = (req, res) => {
    // const id = req.params.id;
    console.log(req.query)
    ChurchMember.findOne({ ...req.query })
        .then(data => {
            console.log(data);

            if (!data)
                res.status(404).send({
                    message: i18n.__('objectNotExists')
                });
            else res.send(data);
        })
        .catch(err => {
            console.log(err);

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
    // console.log(req.body);
    let result = [];
    for (var i = 0; i < members.length; i++) {
        const query = members[i].nationalId ? { nationalId: members[i].nationalId }
            : { _id: members[i]._id };
        console.log('query= ', query);

        result.push(await ChurchMember.findOneAndUpdate(query, { ...members[i] }, options,
            function (error, member) {
                console.log('result= ' + error, member);

                if (error) return res.status(404).send({
                    message: i18n.__('generalError')
                });
                updateInfoInReservation(member);
                return member;
                // do something with the document
            }));

    };
    console.log(result);
    return res.send(result);


};
exports.delete = async (req, res) => {
    console.log(req.params);
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
    }

    ChurchMember.findByIdAndRemove(id)
        .then(data => {
            console.log(data);
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
    console.log(req.query);
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
            label: 'Last Booking',
            value: 'lastBooking'
        }
    ];

    ChurchMember.find({ createdAt: { $gte: createdAtDate } })
        .then(data => {
            console.log(data);

            if (!data)
                res.status(404).send({
                    message: i18n.__('objectNotExists')
                });
            else {
                if (req.query.export == "csv") {

                    console.log("download2");
                    downloadResource(res, 'churchMembers_' + req.query.createDate, exportFields, data);
                } else
                    res.status(200).send(data);
            }
        }
        )
        .catch(err => {
            console.log(err);

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
}