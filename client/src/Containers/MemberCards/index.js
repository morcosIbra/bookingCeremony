import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { removeBooking, setBooking } from '../../store/actions/booking';
import { setCommon } from '../../store/actions/common'; 
import InfoBar from '../../Components/InfoBar';
import Card from '../../Components/Card';
import MemberDetailsForm from '../../Components/MemberDetailsForm';
import { noPersonsAdded, notFoundMemberMsg, notFoundMemberLink, goOn, bookingExist, eventDateFormat, bookingNum, cantBook, dayMonthFormat, bookingCongestion, notChangeBooking, holymass, eveningPrayer } from '../../utilies/constants';
import { validateField } from '../../utilies/memberForm';
import sty from './index.module.scss';
import { faUserMinus } from "@fortawesome/free-solid-svg-icons";
import Button from '../../Components/Button';

const MemberCards = ({ values, order, regions, edit, selectedCeremony,isAdmin, isDeaconItems, currentPhaseEnd, currentPhaseStart, validationMsgs, setCommon, setBooking, removeBooking, classes, ref }) => {
    const didMountRef = useRef(false);
    const notFoundMemberAction = (id)=>(
        <div>
            <div>{notFoundMemberMsg}</div>
            <a href={notFoundMemberLink}>{notFoundMemberLink}</a>
            <div>
                <Button label={goOn} classes="float-right btn btn-primary" onClick={() => setCommon(`action`, { needed: false })} />
            </div>
        </div>
    )
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
            if (edit && member) {
                if(!isAdmin && !member._id){
                    removeMember(id)
                    let action = {
                        title: id,
                        needed: true,
                        fullBody: notFoundMemberAction(id)
                    }
                    setCommon(`action`, { ...action }) 
                } else if (member.active === false) {
                    removeMember(id)
                    let action = {
                        title: id,
                        needed: true,
                        body: [member.name]
                    }
                    action.buttons = {
                        primary: {
                            label: goOn,
                            callback: () => setCommon(`action`, { needed: false })
                        }
                    }
                    action.body.push(`${bookingCongestion}`)
                    setCommon(`action`, { ...action })
                } else {
                    const lastCeremony = selectedCeremony === 'holymass' ? 'booking' : 'lastEveningPrayer'
                    if (member[lastCeremony]?.id
                        && new Date(member[lastCeremony].date) > new Date(currentPhaseStart)
                        && new Date(member[lastCeremony].date) < new Date(currentPhaseEnd)
                        && new Date(member[lastCeremony].date) < new Date()
                        || new Date(member[lastCeremony].date).getDate() === new Date().getDate() + 1 && new Date().getHours() > 20) {
                        removeMember(id)
                        let action = {
                            title: id,
                            needed: true,
                            body: [member.name]
                        }
                        action.body.push(
                            `${bookingExist} ${eventDateFormat(member[lastCeremony].date)}`,
                            `${member[lastCeremony].id} : ${bookingNum}`
                        )
                        action.buttons = {
                            primary: {
                                label: goOn,
                                callback: () => setCommon(`action`, { needed: false })
                            }
                        }
                        action.body.push(`${cantBook} ${dayMonthFormat(currentPhaseEnd)}`)

                        setCommon(`action`, { ...action })
                    }
                }
            }
        }
        else
            didMountRef.current = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order.length]) 

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
                                ceremony={selectedCeremony === 'holymass' ? holymass : eveningPrayer}
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
        isDeaconItems: state.members.isDeacon,
        selectedCeremony: state.booking.member.values.ceremony,
        isAdmin: state.auth.isAdmin
    })
}

const mapDispatchToProps = {
    removeBooking, setBooking, setCommon
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberCards);