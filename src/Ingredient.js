import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

import './List.css'

class Ingredient extends PureComponent { 
    constructor(props) {
        super(props)
        
        this.state = { active: true }
    }
    
    render() {
        let className = 'list-item ingredient'
        
        if (!this.state.active) {
            className += ' inactive'
        }
        
        const label = this.getIngredientLabel()
    
        return (
            <li
                className={className}
                onClick={this.onClick}>
                {label}
            </li>
        )
    }
    
    getIngredientLabel() {
        if (this.props.quantity) {
            if (this.props.unit) {
                return this.props.label + ' ' + this.props.quantity + ' ' + this.props.unit
            } else {
                return this.props.quantity + ' ' + this.props.label
            }
        } else {
            return this.props.label
        }
    }
    
    onClick = () => {
        this.setState({ active: !this.state.active})
    }
    
    componentDidUpdate(prevProps) {
        if (!this.state.active && this.props !== prevProps) {
            this.setState({ active: true })
        }
    }
}

Ingredient.propTypes = {
    category: PropTypes.string.isRequired,
    ingredient: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    quantity: PropTypes.number,
    unit: PropTypes.string
}

export default Ingredient