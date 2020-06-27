import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { removeBooking, setBooking, deleteBooking } from '../../store/actions/booking';
import { setCommon } from '../../store/actions/common';
import Card from '../../Components/Card';
import MemberContent from '../../Components/MemberContent';
import { yes, no, removeBookingConfirm, bookingNum } from '../../utilies/constants';
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import dotProp from 'dot-prop-immutable';
import { noBookingExist } from '../../utilies/constants';

const CheckoutMember = ({ values, title, id, setCommon, setBooking, deleteBooking, classes }) => {

    useEffect(() => {
        setBooking(`members.order`, {})
        setBooking(`members.values`, {})
        return () => {
            setBooking(`members.values`, {})
            setBooking(`members.order`, {})
        }
    }, [])
    const removeMemberBooking = () => {
        console.log(values);

        const action = {
            needed: true,
            body: [removeBookingConfirm],
            buttons: {
                primary: {
                    label: yes,
                    callback: () => {
                        deleteBooking(values._id)
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
        setCommon(`action`, { ...action })
    }

    return (
        <div className={classes} >
            {id &&
                <Card classes='mb-2' title={title} edit={true}
                    remove={{ onClick: () => removeMemberBooking(), icon: faTrashAlt }}>
                    <MemberContent values={values} />
                </Card >
            }
        </div >
    )
}

const mapStateToProps = state => {
    const id = Object.keys(state.booking.members.order)[0];
    let values = state.booking.members.values[id];
    let title = ''
    if (values?.booking?.id) {
        const id = values.booking.id
        title = `${id} : ${bookingNum}`;
        values = dotProp.delete(values, `booking.id`)
    } else {
        title = noBookingExist
    };

    return ({
        id,
        values,
        title
    })
}

const mapDispatchToProps = {
    removeBooking, setBooking, setCommon, deleteBooking
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutMember);