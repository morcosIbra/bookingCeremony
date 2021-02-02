import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { removeBooking, setBooking, removeSeat } from '../../store/actions/booking';
import { setCommon } from '../../store/actions/common';
import Card from '../../Components/Card';
import MemberDetailsForm from '../../Components/MemberDetailsForm';
import { yes, no, removeBookingConfirm, bookingNum, goOn, cantDeleteBooking, eveningPrayer, holymass } from '../../utilies/constants';
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { noBookingExist } from '../../utilies/constants';

const CheckoutMember = ({ values, isAdmin, title, id, edit, setCommon, setBooking, removeSeat, classes }) => {
    useEffect(() => {
        setBooking(`members.order`, {})
        setBooking(`members.values`, {})
        return () => {
            setBooking(`members.values`, {})
            setBooking(`members.order`, {})
        }
    }, [])
    const removeMemberBooking = ceremony => {
        let action = {
            needed: true,
            body: []
        }
        const canDeleteAction = {
            body: [removeBookingConfirm],
            buttons: {
                primary: {
                    label: yes,
                    callback: () => {
                        removeSeat(values._id, true, ceremony)
                        setCommon(`action`, { needed: false })
                    }
                }, secondary: {
                    label: no,
                    callback: () => {
                        setCommon(`action`, { needed: false })
                    }
                }
            }
        }
        if (isAdmin) {
            action = {
                ...action,
                ...canDeleteAction
            }
        } else {
            const bookingDate = new Date(values[ceremony].booking.date);
            const nowDate = new Date(); 
            if (bookingDate > nowDate) {
                if (bookingDate.getDate() === nowDate.getDate() ||
                     bookingDate.getDate() - 1 === nowDate.getDate() && nowDate.getHours() > 20) {
                    action.buttons = {
                        primary: {
                            label: goOn,
                            callback: () => setCommon(`action`, { needed: false })
                        }
                    }
                    action.body.push(cantDeleteBooking('late'));
                } else {
                    action = {
                        ...action,
                        ...canDeleteAction
                    }
                }
            } else {
                action.buttons = {
                    primary: {
                        label: goOn,
                        callback: () => setCommon(`action`, { needed: false })
                    }
                }
                action.body.push(cantDeleteBooking('past'));
            }
        }

        setCommon(`action`, { ...action });
    }
    return (
        <div className={classes} >
            {id &&
                <>
                    {values.holymass.booking?.id && <Card classes='mb-2' title={values.holymass.title} edit={edit}
                        remove={{ onClick: () => removeMemberBooking('holymass'), icon: faTrashAlt }}>
                        <MemberDetailsForm values={values.holymass} ceremony={holymass} />
                    </Card >}
                    {values.eveningPrayer.booking?.id && <Card classes='mb-2' title={values.eveningPrayer.title} edit={edit}
                        remove={{ onClick: () => removeMemberBooking('eveningPrayer'), icon: faTrashAlt }}>
                        <MemberDetailsForm values={values.eveningPrayer} ceremony={eveningPrayer} />
                    </Card >}
                </>
            }
        </div >
    )
}

const mapStateToProps = state => {
    const id = Object.keys(state.booking.members.order)[0];
    let values = { ...state.booking.members.values[id] } || {};
    let title = ''
    let edit = false;
    if (values?.booking?.id) {
        const id = values.booking.id
        values.holymass = {
            booking: values.booking,
            title: holymass,
            mobile: values.mobile,
            name: values.name
        }
        edit = true;
    } else {
        values.holymass = {
            title: noBookingExist
        }
    };
    if (values?.lastEveningPrayer?.id) {
        const id = values.lastEveningPrayer.bookingId
        values.eveningPrayer = {
            booking: values.lastEveningPrayer,
            title: eveningPrayer,
            mobile: values.mobile,
            name: values.name
        }
        edit = true;
    } else {
        values.eveningPrayer = {
            title: noBookingExist
        }
    };
    delete values.booking;
    delete values.lastEveningPrayer

    return ({
        id,
        values,
        title,
        edit,
        isAdmin: state.auth.isAdmin
    })
}

const mapDispatchToProps = {
    removeBooking, setBooking, setCommon, removeSeat
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutMember);