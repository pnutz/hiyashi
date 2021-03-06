import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

import styles from './AddOn.module.css'

class AddOn extends PureComponent { 
    render() {
        /*
        * TODO: functionality (custom input)
        * icon to toggle input to set custom amount
        */
        
        const nextValue = this.getNextValue(this.props.value, this.props.required, this.props.constant)
        
        const disclaimer = (this.props.required) ? <div className={styles.disclaimer}><small>*It wouldn't really be cold ramen if we forgot this, would it?</small></div> : '';
        
        return (
            <div className={styles.container}>
                <div
                    className={styles.addon}
                    data-value={this.props.value}
                    data-next-value={nextValue}
                    onClick={this.handleClick}>
                    <img className={styles.icon} src={this.props.icon} alt=""></img>
                </div>
                <div className={styles.label}>{this.props.label}{(this.props.required) ? '*' : ''}</div>
                {disclaimer}
            </div>
        )
    }
    
    handleClick = () => {
        const nextValue = this.getNextValue(this.props.value, this.props.required, this.props.constant)
        this.props.onAddOnChange(this.props.category, this.props.addon, nextValue)
    }
    
    getNextValue(value, required, constant) {
        switch (value) {
            case 0:
                value = 1
                break
            case 1:
                value = (constant) ? 0 : 0.5
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

AddOn.propTypes = {
    category: PropTypes.string.isRequired,
    addon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
    constant: PropTypes.bool,
    icon: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    onAddOnChange: PropTypes.func.isRequired
}

export default AddOn