import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Button = ({ label, icon, classes, loading, ...rest }) => (
    <button className={`btn ${classes}`} type="button" {...rest}>
        {label} {loading ?
            <FontAwesomeIcon icon={faSpinner} pulse /> :
            icon?<FontAwesomeIcon icon={icon} />:null}
    </button>
)
export default Button;