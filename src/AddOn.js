import React, { PureComponent } from 'react';

import './AddOn.css';

class AddOn extends PureComponent { 
    constructor(props) {
        super(props);
        
        this.handleClick = this.handleClick.bind(this);
    }
    
    render() {
        /* icon if this.props.required?
        *
        * TODO: functionality (custom input)
        * icon to toggle input to set custom amount
        */
        
        let icon = '/icons/' + this.props.icon;
        
        return (
            <div className="add-on-container">
                <div
                    className="add-on"
                    data-value={this.props.value}
                    data-next-value={this.getNextValue(this.props.value, this.props.required)}
                    onClick={this.handleClick}>
                    <img className="icon" src={icon} alt=""></img>
                </div>
                <div className="add-on-label">{ this.props.label }</div>
            </div>
        );
    }
    
    handleClick() {
        let value = this.getNextValue(this.props.value, this.props.required);
        this.handleChange(value);
    }
    
    handleChange(value) {
        this.props.onAddOnChange(this.props.category, this.props.addon, value);
    }
    
    getNextValue(value, required) {
        switch (value) {
            case 0:
                value = 1;
                break;
            case 1:
                value = 0.5;
                break;
            case 0.5:
                value = 2;
                break;
            case 2:
            default:
                value = (required) ? 1 : 0;
                break;
        }
        
        return value;
    }
}

export default AddOn;