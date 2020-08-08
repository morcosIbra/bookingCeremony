import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setMember, updateMember, deleteMember } from '../../store/actions/members';
import { setCommon } from '../../store/actions/common';
import Card from '../../Components/Card';
import MemberDetailsForm from '../../Components/MemberDetailsForm';
import { yes, no, removeBookingConfirm, canceling, edit, removeMemberConfirm } from '../../utilies/constants';
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { noBookingExist } from '../../utilies/constants';
import { validateField, membersValidation } from '../../utilies/memberForm';
import Button from '../../Components/Button';
import { validateOnUpdateMember } from '../../utilies/findMember';

const SaveMemberForm = ({ values, title, id, regions, activeItems, isDeaconItems, validationMsgs, loadingPage,
    setMember, updateMember, deleteMember, setCommon, classes }) => {
    console.log(values, activeItems);

    useEffect(() => {
        return () => {
            setMember(`member.values`, {})
            setMember(`member.validationMsgs`, {})
        }
    }, [])
    const changeHandle = (id, type, value) => {
        const field = validateField(type, value)
        setMember(`member.values.${type}`, field.value)
        setMember(`member.validationMsgs.${type}`, field.validationMsg)
    }
    const updateMemberHandle = () => {
        if (!loadingPage) {
            const valid = validateOnUpdateMember(validationMsgs);
            if (valid)
                updateMember(values)
        }

    }
    const cancelHandle = () => {
        setMember(`member.values`, {})
        setMember(`member.validationMsgs`, {})
    }
    const removeMember = () => {
        console.log('remove');
        const action = {
            needed: true,
            body: []
        }
        action.body.push(removeMemberConfirm);
        action.buttons = {
            primary: {
                label: yes,
                callback: () => {
                    console.log(values);
                    deleteMember(values._id)
                    setCommon(`action`, { needed: false })
                }
            }, secondary: {
                label: no,
                callback: () => {
                    setCommon(`action`, { needed: false })
                }
            }
        }
        console.log(action);
        setCommon(`action`, { ...action });
    }
    return (
        <div className={classes} >
            {id &&
                <Card classes='mb-2' title={title} edit={true}
                    remove={{ onClick: () => removeMember(), icon: faTrashAlt }}>
                    <MemberDetailsForm values={values} validationMsgs={validationMsgs} edit isAdminEdit activeItems={activeItems}
                        isDeaconItems={isDeaconItems}
                        regions={regions} changeHandle={changeHandle} id={id} />
                </Card >
            }
            {id && <>
                <Button label={canceling} classes="btn-secondary mr-2" onClick={cancelHandle} />
                <Button label={edit} classes='btn-success' onClick={updateMemberHandle} />

            </>
            }

        </div >
    )
}

const mapStateToProps = state => {


    return ({
        id: state.members.member.values.id,
        values: state.members.member.values,
        validationMsgs: state.members.member.validationMsgs,
        title: state.members.member.values.id,
        activeItems: state.members.active,
        isDeaconItems: state.members.isDeacon,
        regions: state.booking.regions,
        loadingPage: state.common.loadingPage
    })
}

const mapDispatchToProps = {
    setMember, setCommon, updateMember, deleteMember
};

export default connect(mapStateToProps, mapDispatchToProps)(SaveMemberForm);