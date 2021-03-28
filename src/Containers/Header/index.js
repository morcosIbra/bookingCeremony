import React from "react"
import Link from "../../Components/Link";
import sty from './index.module.scss';
import stgeorge from '../../images/st-george.jpg';
import { pastBooking, newBooking, login, admin, logout, editMember } from "../../utilies/constants";
import Login from "../Login";
import { connect } from "react-redux";
import { setCommon } from '../../store/actions/common';
import { setAuth } from "../../store/actions/auth";

const Header = ({ isAdmin, setAuth, setCommon }) => {
    const openLogin = () => {
        setCommon(`action`, {
            needed: true,
            fullBody: <Login />, title: login
        })
    }
    const logoutHandle = () => setAuth('isAdmin', false)
    const navItems = (<ul className={`navbar-nav ${sty.navbarNav}`}>
        {isAdmin ? <>
            <li className="nav-item" >
                <Link onClick={logoutHandle} classes="nav-link pr-2 pl-2">
                    {logout}
                </Link>
            </li>
            <li className="nav-item" >
                <Link to='/editMember' classes="nav-link pr-2 pl-2">
                    {editMember}
                </Link>
            </li>
        </> : <li className="nav-item" >
                <Link onClick={openLogin} classes="nav-link pr-2 pl-2">
                    {admin}
                </Link>
            </li>}
        <li className="nav-item" >
            <Link to='/booking/checkevents' classes="nav-link pr-2 pl-2">
                {pastBooking}
            </Link>
        </li>
        <li className="nav-item" >
            <Link to='/booking/members' classes="nav-link pr-2 pl-2">
                {newBooking}
            </Link>
        </li>
    </ul>
    )

    return (
        <>
            <nav className={`${sty.navbar} navbar navbar-expand-lg navbar-light bg-light  `}>
                <div className={` navbar-collapse flex-row-reverse d-flex`}>
                    <Link exact to='/' classes={`nav-link pr-2 pl-2 ${sty.logoWidth}`}>
                        <img src={stgeorge} className="rounded-circle img-fluid" alt="..." />
                    </Link>
                    {navItems}
                </div>
            </nav>
        </>
    )
}
const mapStateToProps = state => ({
    isAdmin: state.auth.isAdmin,
})
const mapDispatchToProps = {
    setCommon, setAuth
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);