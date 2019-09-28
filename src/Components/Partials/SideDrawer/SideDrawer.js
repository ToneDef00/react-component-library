import React from 'react';
import './SideDrawer.css';
import NavLinks from '../../NavLinks';
import Userinfo from '../../Userinfo/Userinfo';

const sideDrawer = props => {
    
    let drawerClasses = 'side-drawer';
    if (props.show) {
        drawerClasses = 'side-drawer open';
    }
    return (
        <nav className= {drawerClasses}>
            <ul>
                <Userinfo />
                <li> USER NAME</li>
                <li><a href="/">Home</a></li>
                <li><a href="/">MAP</a></li>
                <li><a href="/">STREAMER</a></li>
                <li><NavLinks /></li>
            </ul>
        </nav>
    );
};

export default sideDrawer;
