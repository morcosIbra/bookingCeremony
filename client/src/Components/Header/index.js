import React, { useState } from "react"
import Link from "../Link";
import sty from './index.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChurch } from "@fortawesome/free-solid-svg-icons";
import { startBooking, pastBooking } from "../../utilies/constants";
const Header = () => {
    const [menuStatus, setMenuStatus] = useState('initial')

    const toggleMenuStatus = () => {
        menuStatus !== 'show' ? setMenuStatus('show') : setMenuStatus('collapse')

    }
    const navItems = (<ul className={`navbar-nav ${sty.navbarNav}`}>
        <li className="nav-item" >
            <Link to='/booking/checkevents' classes="nav-link pr-2 pl-2">
                {pastBooking}
            </Link>
        </li>
        <li className="nav-item " >
            <Link to='/booking/members' classes="nav-link pr-2 pl-2">
                {startBooking}
            </Link>
        </li>
    </ul>
    )

    return (
        <>
            <nav className={`${sty.navbar} navbar navbar-expand-lg navbar-light bg-light  `}>
                <div className={` navbar-collapse flex-row-reverse d-flex`}>
                    <Link exact to='/' classes="nav-link pr-2 pl-2">
                        <FontAwesomeIcon icon={faChurch} />
                    </Link>
                    {navItems}
                </div>

                {/* {navItems} */}


                {/* <Link to='/' >
                    {logo} <FontAwesomeIcon icon={faChurch} />
                </Link>

                <Link to='/booking' classes="nav-link">
                    {startBooking}
                </Link>
                <Link to='/booking' classes="nav-link">
                    {startBooking}
                </Link> */}

            </nav>
        </>
    )
}
export default Header;