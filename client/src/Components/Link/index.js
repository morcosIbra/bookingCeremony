import React from 'react';
import { NavLink } from 'react-router-dom';

const Link = ({ children, classes, ...rest }) => (
    <NavLink className={classes} {...rest}>{children}</NavLink>
)
export default Link