import React, {PureComponent} from 'react'

import './AddOn.css'

class AddOn extends PureComponent { 
    render() {
        /* icon if this.props.required?
        *
        * TODO: functionality (custom input)
        * icon to toggle input to set custom amount
        */
        
        const icon = '/icons/' + this.props.icon
        const nextValue = this.getNextValue(this.props.value, this.props.required)
        
        return (
            <div className="add-on-container">
                <div
                    className="add-on"
                    data-value={this.props.value}
                    data-next-value={nextValue}
                    onClick={this.handleClick}>
                    <img className="icon" src={icon} alt=""></img>
                </div>
                <div className="add-on-label">{this.props.label}</div>
            </div>
        )
    }
    
    handleClick = () => {
        const nextValue = this.getNextValue(this.props.value, this.props.required)
        this.props.onAddOnChange(this.props.category, this.props.addon, nextValue)
    }
    
    getNextValue(value, required) {
        switch (value) {
            case 0:
                value = 1
                break
            case 1:
                value = 0.5
                break
            case 0.5:
                value = 2
                break
            case 2:
            default:
                value = (required) ? 1 : 0
                break
        }
        
        return value
    }
}

export default AddOn