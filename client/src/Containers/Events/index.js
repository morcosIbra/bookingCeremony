import { connect } from "react-redux";
import React, { useEffect } from "react";
import Card from "../../Components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import EventsList from "../../Components/EventsList";
import { setBooking, getEvents } from "../../store/actions/booking";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Dropdown from "../../Components/Dropdown";
import { availableCeremonies } from "../../utilies/constants";


const Events = ({ isAdmin, selected, selectedCeremony, classes, loading, getEvents, events, pastEvents, validationMsg, setBooking }) => {
    const history = useHistory();
    useEffect(() => {
        return () => {
            setBooking(`events.list`, [])
            setBooking(`events.values.selected`, '')
        }
    }, [])
    useEffect(() => {
        if (!events.length) {
            setBooking(`redirectTo`, 'members');
            history.push(`/booking/members`);
        }
    }, [events, history])

    const selectEvent = id => {

        setBooking('events.values.selected', id)
        setBooking('events.validationMsg', '')
    }
    const filterChange = (type, value) => {
        if (type === 'pastEvents')
            getEvents(value)
    }
    return (

        < div className={classes} >
            {isAdmin && <Dropdown classes='mb-2' items={pastEvents} rtl onChange={(e) => filterChange('pastEvents', e.target.value)} />}
            <Card title={
                <span>{availableCeremonies(selectedCeremony)} {loading && <FontAwesomeIcon icon={faSpinner} pulse />} </span>}>
                {events.length ?
                    <EventsList events={events} selected={selected}
                        selectEvent={selectEvent} validationMsg={validationMsg} />
                    : null}
            </Card>

        </div >
    )
}

const mapStateToProps = state => {
    const events = state.booking.events.list
    return ({
        memberslen: Object.keys(state.booking.members.order).length,
        events: events.sort((a, b) => a.date - b.date),
        pastEvents: state.booking.pastEvents,
        loading: state.booking.events.loading,
        selected: state.booking.events.values.selected,
        validationMsg: state.booking.events.validationMsg,
        selectedCeremony: state.booking.member.values.ceremony,
        isAdmin: state.auth.isAdmin
    })
}

const mapDispatchToProps = {
    setBooking, getEvents
};

export default connect(mapStateToProps, mapDispatchToProps)(Events);