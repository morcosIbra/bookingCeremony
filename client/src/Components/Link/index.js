import React from 'react';
import { NavLink } from 'react-router-dom';
import sty from './index.module.scss';

const Link = ({ children, classes, to, ...rest }) => (
    to ? <NavLink className={`${classes} ${sty.link}`} to={to} {...rest}>{children}</NavLink>
        : <a className={`${classes} ${sty.link}`}  {...rest}>{children}</a>
)
export default Link