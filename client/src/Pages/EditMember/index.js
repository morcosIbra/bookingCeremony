import React from 'react';
import FindMember from '../../Containers/FindMember';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import SaveMemberForm from '../../Containers/SaveMemberForm';

const EditMember = () => {
    return (
        <>
            <FindMember classes='mb-3' />

             <SaveMemberForm classes='mb-3' /> 
        </>
    )
}



export default EditMember;