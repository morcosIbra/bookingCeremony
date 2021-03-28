import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setMember, getMember } from '../../store/actions/members';
import Button from '../../Components/Button';
import Input from '../../Components/Input';
import { faIdCard, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inputText, compInfo, editMember } from '../../utilies/constants';
import { validateField } from '../../utilies/memberForm';
import { validateOnFindMember } from '../../utilies/findMember';

const FindMember = ({ id, loading, setMember, getMember, classes, ref }) => {
    useEffect(() => {
        return () => {
            setMember(`findMember.values`, {id:''})
            setMember(`findMember.validationMsgs`, {id:''})
        }
    }, [])
    const changeHandle = (type, value) => {
        const field = validateField(type, value)
        setMember(`findMember.values.${type}`, field.value)
        setMember(`findMember.validationMsgs.${type}`, field.validationMsg)
    }
    const submit = () => {
        if (!loading) {
            const field = validateOnFindMember(id.value, id.validationMsg)
            setMember(`findMember.validationMsgs.id`, field.validationMsg)
            if (!field.validationMsg) {
                getMember(field.value, true)
                setMember(`findMember.values.id`, '')
            }
        }

    }
    return (
        <div className={classes} ref={ref}>

            <h5>
                {editMember}
            </h5>
            <Input {...id} 
                onChange={(e) => changeHandle('id', e.target.value)}
                classes="mb-2">
                <FontAwesomeIcon icon={faIdCard} />
            </Input>
            <div className="text-left">
                <Button classes='btn-success btn-sm btn-block' label={compInfo} loading={loading}
                    onClick={submit} icon={faInfoCircle} />
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    id: {
        value: state.members.findMember.values.id,
        validationMsg: state.members.findMember.validationMsgs.id,
        placeholder: inputText.id
    },
    loading: state.members.loading

})

const mapDispatchToProps = {
    setMember, getMember
};

export default connect(mapStateToProps, mapDispatchToProps)(FindMember);