import React from 'react';
import { connect } from 'react-redux';
import { setAuth } from '../../store/actions/auth';
import { setCommon } from '../../store/actions/common';
import Button from '../../Components/Button';
import Input from '../../Components/Input';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ticket, inputText, register, canceling } from '../../utilies/constants';
import { validateField, validateOnSubmit } from '../../utilies/authForm';

const Login = ({ username, password, rightCredentials, setAuth, setCommon, classes }) => {
    const changeHandle = (type, value) => {
        const field = validateField(type, value)
        setAuth(type, field)
    }

    const submit = () => {
        const errorResponse = validateOnSubmit(username.value, password.value, rightCredentials)
        if (errorResponse.length) {
            setCommon(`response`, errorResponse)
            setTimeout(() => setCommon(`response`, []), 5000)
            setAuth('isAdmin', false)
        } else {
            setAuth('isAdmin', true)
            setAuth('username', {})
            setAuth('password', {})
            setCommon(`action`, { needed: false })
        }
    }
    const cancel = () => {
        setAuth('username', {})
        setAuth('password', {})
        setCommon(`action`, { needed: false })
    }
    return (
        <div className={classes}>
            <Input type="text" {...username} placeholder={inputText.passwordPlaceholder}
                onChange={(e) => changeHandle('username', e.target.value)}
                classes="mb-2">
                <FontAwesomeIcon icon={faUser} />
            </Input>
            <Input type="password" {...password} placeholder={inputText.usernamePlaceholder}
                onChange={(e) => changeHandle('password', e.target.value)}
                classes="mb-2">
                <FontAwesomeIcon icon={faLock} />
            </Input>
            <div>
                <Button label={register} classes="float-right btn btn-primary" onClick={submit} />
                <Button label={canceling} classes="float-left btn btn-secondary" onClick={cancel} />
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    username: state.auth.username,
    password: state.auth.password,
    rightCredentials: state.auth.rightCredentials
})

const mapDispatchToProps = {
    setAuth, setCommon
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);