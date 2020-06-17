import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { removeBooking, setBooking } from '../../store/actions/booking';
import { setCommon } from '../../store/actions/common';
import InfoBar from '../../Components/InfoBar';
import Card from '../../Components/Card';
import MemberContent from '../../Components/MemberContent';
import { noPersonsAdded, bookWillChange, changeBooking, goOn, bookingExist, eventDateFormat, bookingNum, canceling, cantBook, dayMonthFormat, bookingCongestion } from '../../utilies/constants';
import { validateField } from '../../utilies/memberForm';
import sty from './index.module.scss';

const MemberCards = ({ values, order, edit, currentPhaseEnd, validationMsgs, setCommon, setBooking, removeBooking, classes, ref }) => {
    useEffect(() => {
        return () => {
            if (!edit) {
                setBooking(`members.values`, {})
                setBooking(`members.order`, {})
            }
        }
    }, [setBooking, edit])
    useEffect(() => {
        const id = order[0];
        const member = values[id]
        console.log(member);

        if (member?.active === false && edit) {
            let action = {
                title: id,
                needed: true,
                body: [member.name]
            }
            if (member.booking?.id) {
                action.body.push(
                    `(${member.booking.id} : ${bookingNum}) ${bookingExist} ${eventDateFormat(member.booking.date)}`
                )
                if (member.booking.date > new Date()) {
                    action.buttons = {
                        primary: {
                            label: changeBooking,
                            callback: () => acceptMember(id)
                        }, secondary: {
                            label: canceling,
                            callback: () => rejectMember(id)
                        }
                    }
                    action.body.push(bookWillChange)
                } else if (member.booking.date <= new Date()) {
                    action.buttons = {
                        primary: {
                            label: goOn,
                            callback: () => rejectMember(id)
                        }
                    }
                    action.body.push(`${cantBook} ${dayMonthFormat(currentPhaseEnd)}`)
                }
            } else {
                action.buttons = {
                    primary: {
                        label: goOn,
                        callback: () => rejectMember(id)
                    }
                }
                action.body.push(`${bookingCongestion}`)
            }
            setCommon(`action`, { ...action })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order.length])

    const acceptMember = id => {
        setBooking(`members.values.${id}.active`, true)
        setCommon(`action`, { needed: false })
    };
    const rejectMember = id => {
        removeMember(id)
        setCommon(`action`, { needed: false })
    }
    const removeMember = id => {
        removeBooking(`members.values.${id}`)
        removeBooking(`members.order.${id}`)
        removeBooking(`member.validationMsgs.${id}`)
    }

    const changeHandle = (id, type, value) => {
        const field = validateField(type, value)
        setBooking(`members.values.${id}.${type}`, field.value)
        setBooking(`members.validationMsgs.${id}.${type}`, field.validationMsg)
    }

    return (
        <div className={classes} ref={ref}>
            {
                order.length ?
                    order.map(id => (
                        <Card key={id} classes='mb-2' title={id} edit={edit} remove={() => removeMember(id)}>
                            <MemberContent id={id} values={values[id]} validationMsgs={validationMsgs[id]}
                                edit={edit} changeHandle={changeHandle}>
                            </MemberContent>
                        </Card>
                    )
                    ) : <div className='mt-5'>
                        <InfoBar classes={`${sty.centerInfo} text-center m-auto`} type='warning' items={[noPersonsAdded]} />
                    </div>

            }
        </div >
    )
}

const mapStateToProps = state => {
    const order = state.booking.members.order;
    return ({
        order: Object.keys(order)
            .sort((a, b) => order[b] - order[a]),
        validationMsgs: state.booking.members.validationMsgs,
        values: state.booking.members.values,
        currentPhaseEnd: state.common.currentPhase.end
    })
}

const mapDispatchToProps = {
    removeBooking, setBooking, setCommon
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberCards);