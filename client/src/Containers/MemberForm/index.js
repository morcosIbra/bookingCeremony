import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setBooking, addMember } from '../../store/actions/booking';
import Button from '../../Components/Button';
import Input from '../../Components/Input';
import { faIdCard, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inputText, compInfo, addPerson } from '../../utilies/constants';
import { validateField, validateOnSubmit } from '../../utilies/memberForm';
import Dropdown from '../../Components/Dropdown';

const MemberForm = ({ id, ceremony, redirectTo, members, loading, setBooking, ceremonies, addMember, classes, ref }) => {

    useEffect(() => { resetForm() }, [])

    const resetMembersList = () => {
        setBooking(`members.values`, {})
        setBooking(`members.order`, {})
    }

    const resetForm = () => {
        ['id', 'ceremony'].map(field => {
            if (redirectTo !== 'members' && field === 'ceremony') {
                setBooking(`member.values.${field}`, '')
                setBooking(`member.validationMsgs.${field}`, '')
            }
        });
    }

    const changeHandle = (type, value) => {
        const field = validateField(type, value)
        setBooking(`member.values.${type}`, field.value)
        setBooking(`member.validationMsgs.${type}`, field.validationMsg)
        if (type === 'ceremony')
            resetMembersList()
    }
    const submit = () => {
        if (!loading) {
            const field = validateOnSubmit(id.value, id.validationMsg, members)
            setBooking(`member.validationMsgs.id`, field.validationMsg)
            if (!field.validationMsg) {
                addMember(field.value, true)
                setBooking(`member.values.id`, '')
            }
        }

    }
    return (
        <div className={classes} ref={ref}>
            <Dropdown classes='mb-2'
                {...ceremony}
                onChange={(e) => changeHandle('ceremony', e.target.value)}
                items={ceremonies} rtl />
            <h5>
                {addPerson}
            </h5>

            <Input {...id} disabled={!ceremony.value}
                onChange={(e) => changeHandle('id', e.target.value)}
                classes="mb-2">
                <FontAwesomeIcon icon={faIdCard} />
            </Input>
            <div className="text-left">
                <Button classes='btn-success btn-sm btn-block' label={compInfo} loading={loading}
                    onClick={submit} disabled={!ceremony.value} icon={faInfoCircle} />
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    id: {
        value: state.booking.member.values.id,
        validationMsg: state.booking.member.validationMsgs.id,
        placeholder: inputText.id
    },
    ceremony: {
        value: state.booking.member.values.ceremony,
        validationMsg: state.booking.member.validationMsgs.ceremony,
    },
    members: state.booking.members.values,
    ceremonies: state.booking.ceremonies,
    redirectTo: state.booking.redirectTo,
    loading: state.booking.loading

})

const mapDispatchToProps = {
    setBooking, addMember
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberForm);