import React from 'react';
import Input from '../Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobile, faUser } from '@fortawesome/free-solid-svg-icons';
import { inputText, bookingNum, eventDateFormat, ceremony } from '../../utilies/constants';
import sty from './index.module.scss';

const MemberContent = ({ id, values, validationMsgs, bookingButton, edit, changeHandle }) => (
    <>
        <ul className="list-group list-group-flush">

            <li className={`${sty.listGroupItem} list-group-item pr-0 pl-0`}>
                {edit ? <>
                    <Input validationMsg={validationMsgs?.name} rtl
                        value={values?.name || ''} placeholder={inputText.name}
                        onChange={(e) => changeHandle(id, 'name', e.target.value)}
                        classes='mb-2'>
                        <FontAwesomeIcon icon={faUser} />
                    </Input>

                    <Input validationMsg={validationMsgs?.mobile}
                        value={values.mobile || ''} placeholder={inputText.mobilePlaceholder}
                        onChange={(e) => changeHandle(id, 'mobile', e.target.value)}
                        classes='mb-2'>
                        <FontAwesomeIcon icon={faMobile} />
                    </Input>

                    <Input validationMsg={validationMsgs?.street}
                        value={values.street || ''} placeholder={inputText.streetPlaceholder}
                        onChange={(e) => changeHandle(id, 'street', e.target.value)}
                        classes='mb-2'>
                        <FontAwesomeIcon icon={faMobile} />
                    </Input>

                    <Input validationMsg={validationMsgs?.building}
                        value={values.building || ''} placeholder={inputText.buildingPlaceholder}
                        onChange={(e) => changeHandle(id, 'building', e.target.value)}
                        classes='mb-2'>
                        <FontAwesomeIcon icon={faMobile} />
                    </Input>

                    <Input validationMsg={validationMsgs?.apartment}
                        value={values.apartment || ''} placeholder={inputText.apartmentPlaceholder}
                        onChange={(e) => changeHandle(id, 'apartment', e.target.value)}
                        classes='mb-2'>
                        <FontAwesomeIcon icon={faMobile} />
                    </Input>

                    <Input validationMsg={validationMsgs?.floor}
                        value={values.floor || ''} placeholder={inputText.floorPlaceholder}
                        onChange={(e) => changeHandle(id, 'floor', e.target.value)}
                        classes='mb-2'>
                        <FontAwesomeIcon icon={faMobile} />
                    </Input>

                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <select className="form-control" placeholder="المنطقة" value={values.region} onChange={(e) => changeHandle(id, 'region', e.target.value)}>
                                <option value="1" defaultValue>حمامات القبة</option>
                                <option value="2">كوبري القبة</option>
                                <option value="3"> سراي القبة</option>
                                <option value="4"> منشية البكري</option>
                                <option value="5"> الزيتون</option>
                                <option value="6">كنيسة العذراء و الانبا موسي </option>
                                <option value="7"> اخري</option>
                            </select>
                        </div>
                    </div>

                </> : <>
                        <p className="card-text ">
                            {values.name} < FontAwesomeIcon icon={faUser} /></p>
                        <p className="card-text ">
                            {values.mobile} <FontAwesomeIcon icon={faMobile} />
                        </p>
                        <p className="card-text ">
                            {values.street} <FontAwesomeIcon icon={faMobile} />
                        </p>
                        <p className="card-text ">
                            {values.building} <FontAwesomeIcon icon={faMobile} />
                        </p>
                        <p className="card-text ">
                            {values.apartment} <FontAwesomeIcon icon={faMobile} />
                        </p>
                        <p className="card-text ">
                            {values.floor} <FontAwesomeIcon icon={faMobile} />
                        </p>
                        <p className="card-text ">
                            {values.region} <FontAwesomeIcon icon={faMobile} />
                        </p>
                    </>
                }
            </li>
            {!edit && values.booking?.id &&
                <li className={`${sty.listGroupItem} list-group-item pr-0 pl-0`}>
                    <p className="card-text">{ceremony} {eventDateFormat(values.booking.date)} </p>

                    <p className="card-text">{values.booking.id} : {bookingNum} </p>

                </li>}

        </ul>
    </>
)

export default MemberContent;