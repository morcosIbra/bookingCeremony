import React from 'react';
import sty from './index.module.scss'
import Overlay from '../Overlay';
import Card from '../Card';

const Popup = ({ title, body, buttons }) => (
    <>
        <Overlay />
        <div className={sty.popUp}>
            <Card title={title}>
                <ul className="list-group list-group-flush mb-1">
                    <li className={`list-group-item pr-0 pl-0 pt-0 pb-0`}>
                        {body.map((msg, index) => <p key={index} className="card-text">{msg}</p>)}
                    </li>
                </ul>
                <div>
                    <button className="float-right btn btn-primary" onClick={buttons.primary.callback}>{buttons.primary.label}</button>
                    {
                        buttons.secondary &&
                        <button className="float-left btn btn-secondary" onClick={buttons.secondary.callback}>{buttons.secondary.label}</button>
                    }
                </div>
            </Card>
            {/* <div className="card">
                {title && <h5 className="card-header">{title}</h5>}
                <div className="card-body">
                    {body.map((msg, index) => <p key={index} className="card-text">{msg}</p>)}
                    <div>
                        <button className="float-right btn btn-primary" onClick={buttons.primary.callback}>{buttons.primary.label}</button>
                        {
                            buttons.secondary &&
                            <button className="float-left btn btn-secondary" onClick={buttons.secondary.callback}>{buttons.secondary.label}</button>
                        }
                    </div>
                </div>
            </div> */}
        </div>
    </>
)
export default Popup