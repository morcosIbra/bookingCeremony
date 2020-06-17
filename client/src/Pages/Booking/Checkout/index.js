import React from 'react';
import InfoBar from '../../../Components/InfoBar';
import MemberCards from '../../../Containers/MemberCards';
import { connect } from 'react-redux';

const Checkout = ({ info }) => (
    <div>
        <MemberCards classes='mb-3' />
        <InfoBar type="info" items={info} />
    </div>
)



const mapStateToProps = state => {
    return ({
        info: state.booking.info.checkout,
    })
}

export default connect(mapStateToProps)(Checkout);