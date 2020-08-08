import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { removeBooking, setBooking, removeSeat } from '../../store/actions/booking';
import { setCommon } from '../../store/actions/common';
import InfoBar from '../../Components/InfoBar';
import Card from '../../Components/Card';
import MemberDetailsForm from '../../Components/MemberDetailsForm';
import { noPersonsAdded, bookWillChange, changeBooking, goOn, bookingExist, eventDateFormat, bookingNum, cantBook, dayMonthFormat, bookingCongestion, notChangeBooking } from '../../utilies/constants';
import { validateField } from '../../utilies/memberForm';
import sty from './index.module.scss';
import { faUserMinus } from "@fortawesome/free-solid-svg-icons";

const MemberCards = ({ values, order, regions, edit, isDeaconItems,currentPhaseEnd,currentPhaseStart, validationMsgs, setCommon, setBooking, removeBooking, removeSeat, classes, ref }) => {
    const didMountRef = useRef(false);
console.log(values,validationMsgs);
    useEffect(() => {
        return () => {
            if (!edit) {
                setBooking(`members.values`, {})
                setBooking(`members.order`, {})
            }
        }
    }, [setBooking, edit])
    useEffect(() => {
        if (didMountRef.current) {
            const id = order[0];
            const member = values[id]
            console.log(member);
            if (edit) {
                if (member?.active === false) {
                    let action = {
                        title: id,
                        needed: true,
                        body: [member.name]
                    }
                    action.buttons = {
                        primary: {
                            label: goOn,
                            callback: () => rejectMember(id)
                        }
                    }
                    action.body.push(`${bookingCongestion}`)
                    setCommon(`action`, { ...action })
                } else if (member?.booking?.id && 
                    new Date(member.booking.date) > new Date(currentPhaseStart) && 
                    new Date(member.booking.date) < new Date(currentPhaseEnd)
                    ) {

                    let action = {
                        title: id,
                        needed: true,
                        body: [member.name]
                    }
                    action.body.push(
                        `${bookingExist} ${eventDateFormat(member.booking.date)}`,
                        `${member.booking.id} : ${bookingNum}`
                    )

                    if (new Date(member.booking.date) > new Date()) {
                        action.buttons = {
                            primary: {
                                label: changeBooking,
                                callback: () => acceptMember(member._id)
                            }, secondary: {
                                label: notChangeBooking,
                                callback: () => rejectMember(id)
                            }
                        }
                        action.body.push(bookWillChange)
                    } else if (new Date(member.booking.date) <= new Date()) {
                        action.buttons = {
                            primary: {
                                label: goOn,
                                callback: () => rejectMember(id)
                            }
                        }
                        action.body.push(`${cantBook} ${dayMonthFormat(currentPhaseEnd)}`)
                    }
                    setCommon(`action`, { ...action })
                }
            }
        }
        else
            didMountRef.current = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order.length])

    const acceptMember = id => {
        removeSeat(id, false)
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
                        <Card key={id} classes='mb-2' title={id} edit={edit}
                            remove={{ onClick: () => removeMember(id), icon: faUserMinus }}>
                            <MemberDetailsForm id={id} values={values[id]} validationMsgs={validationMsgs[id]}
                                isDeaconItems={isDeaconItems}
                                edit={edit} changeHandle={changeHandle} regions={regions}>
                            </MemberDetailsForm>
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
        regions: state.booking.regions,
        currentPhaseEnd: state.common.currentPhase.end,
        currentPhaseStart: state.common.currentPhase.start,
        isDeaconItems:state.members.isDeacon
    })
}

const mapDispatchToProps = {
    removeBooking, setBooking, setCommon, removeSeat
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberCards);