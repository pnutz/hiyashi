import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

import styles from './List.module.css'

class Ingredient extends PureComponent { 
    constructor(props) {
        super(props)
        
        this.state = { active: true }
    }
    
    render() {
        const activeClass = (!this.state.active) ? styles.inactive : ''
        const label = this.getIngredientLabel()

        return (
            <li
                className={styles.item + ' ' + activeClass}
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