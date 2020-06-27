import React, { useEffect } from 'react';
import InfoBar from '../../../Components/InfoBar';
import MemberCards from '../../../Containers/MemberCards';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setBooking } from '../../../store/actions/booking';

const Checkout = ({ info, setBooking }) => {
    const history = useHistory();
    useEffect(() => {
        setBooking(`redirectTo`, '')
    }, [])
    return (
        <div>
            <MemberCards classes='mb-3' edit={false} />
            <InfoBar type="info" items={info} />
        </div>
    )
}

const mapStateToProps = state => {
    return ({
        info: state.booking.info.checkout
    })
}
const mapDispatchToProps = {
    setBooking
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);