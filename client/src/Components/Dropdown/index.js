import React from 'react';
import sty from './index.module.scss'
import ValidationMsg from '../ValidationMsg'
const Dropdown = ({ validationMsg, classes, rtl, items, placeholder, ...rest }) => {
   
    return (
        <div className={`${classes} form-row`}>
            <div className="form-group col-md-12">
                <select className={`form-control ${rtl && sty.dirRtl}`} {...rest}>
                    {items.map(item => <option key={item.key} value={item.value}
                        {...item.attr}>
                        {item.value}</option>)}

                </select>
                {validationMsg && <ValidationMsg msg={validationMsg} />}
            </div>

        </div>
    )
}


export default Dropdown;