import React from 'react';
import PropTypes from 'prop-types';

const ColorDisplayPanel = function(props){
    let styleClass = "rounded ";
    if(props.color){
        styleClass += `${props.color} `
    }
    if(props.textColor){
        styleClass += `${props.textColor} `
    }
    if(props.textAlign){
        styleClass += `${props.textAlign} `
    }
    if(props.classList){
        styleClass += `${props.classList} `
    }
        return (
            <div className={styleClass}>
                {props.children}
            </div>
        );
}

ColorDisplayPanel.propTypes = {
    color: PropTypes.string,
    textColor: PropTypes.string,
    textAlign: PropTypes.string
}



export default ColorDisplayPanel;
