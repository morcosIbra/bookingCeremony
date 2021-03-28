import React from 'react';
import sty from './index.module.scss'
import ValidationMsg from '../ValidationMsg'
const Dropdown = ({ validationMsg, classes = '', rtl, items, placeholder, ...rest }) => {

    return (
        <div className={`${classes} form-row`}>
            <div className="col-md-12">
                <select className={`form-control ${rtl && sty.dirRtl}`} {...rest}>
                    {items.map((item, index) => <option key={index} value={item.value}
                        {...item.attr}>
                        {item.label}</option>)}

                </select>
                {validationMsg && <ValidationMsg msg={validationMsg} />}
            </div>

        </div>
    )
}


export default Dropdown;