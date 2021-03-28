import React from 'react';


const Footer = ({ classes, children }) => (
    <nav className={`navbar navbar-light bg-light ${classes}`} style={{zIndex:"1"}}>
        {children}
    </nav>
)
export default Footer;