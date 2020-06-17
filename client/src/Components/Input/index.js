import React from 'react';
import sty from './index.module.scss'
import ValidationMsg from '../ValidationMsg'
const Input = ({ validationMsg, children, classes, ...rest }) => {

    return (
        <>
            <div className={`input-group ${classes}`} >
                <input type="text" className={`form-control ${sty.dirRtl}`} {...rest} />
                {children && <div className="input-group-prepend">
                    <span className="input-group-text">{children}</span>
                </div>}
            </div>
            {validationMsg && <ValidationMsg msg={validationMsg} />}
        </>
    )
}


export default Input