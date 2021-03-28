import React, { useEffect, useRef } from 'react';
import InfoBar from '../../../Components/InfoBar';
import List from '../../../Containers/Events';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { postBooking, setBooking } from '../../../store/actions/booking';
import { setCommon } from '../../../store/actions/common';
import Footer from '../../../Components/Footer';
import BookingFooter from '../../../Containers/Footer/Booking';
import { inputText, bookingDeleteWarning, canceling, accepted } from '../../../utilies/constants';

const Events = ({ info, redirectTo, selected, setBooking, setCommon,postBooking, loadingPage }) => {
    const history = useHistory();
    const refForm = useRef();

    useEffect(() => {
        if (redirectTo === 'checkout' || redirectTo === 'members')
            history.push(redirectTo)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [redirectTo])
    const startBooking = () => {
        setCommon(`action`, { needed: false })
        if (selected)
            postBooking(selected)
        else {
            setBooking(`events.validationMsg`, inputText.event)
            refForm.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }
    const showWarningPopup = () => {
        let action = {
            needed: true,
            body: [bookingDeleteWarning]
        }
        action.buttons = {
            primary: {
                label: accepted,
                callback: startBooking
            },
            secondary: {
                label: canceling,
                callback: () => setCommon(`action`, { needed: false })
            }
        }
        setCommon(`action`, { ...action })
    }

    const goToCheckout = () => {
         if (!loadingPage) {
            showWarningPopup()
        }
    }
    const goToMembers = () => {
        if (!loadingPage) {
            setBooking(`events.list`, [])
            setBooking(`events.values.selected`, '')
            setBooking(`redirectTo`, 'members')
        }

    }

    const footer = {
        rightButton: {
            label: 'احجز الان',
            onClick: goToCheckout
        },
        leftButton: {
            label: 'اضافه اشخاص',
            onClick: goToMembers
        }
    }
    return (
        <div>
            <div className='mb-5'>
                <InfoBar type="info" items={info} classes='mb-3' />
                <div ref={refForm}>
                    <List classes='mb-3' />
                </div>
            </div>
            <Footer classes='fixed-bottom'>
                <BookingFooter {...footer} />
            </Footer>
        </div>
    )
}

const mapStateToProps = state => ({
    info: state.booking.info.events,
    selected: state.booking.events.values.selected,
    redirectTo: state.booking.redirectTo,
    loadingPage: state.common.loadingPage
})
const mapDispatchToProps = {
    setBooking, postBooking, setCommon
};

export default connect(mapStateToProps, mapDispatchToProps)(Events);