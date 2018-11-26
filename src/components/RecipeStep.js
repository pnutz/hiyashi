import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

import styles from './List.module.css'

class RecipeStep extends PureComponent { 
    constructor(props) {
        super(props)
        
        this.state = { active: true }
    }
    
    render() {
        const activeClass = (!this.state.active) ? styles.inactive : ''
        return (
            <li
                className={styles.item + ' ' + activeClass}
                onClick={this.handleClick}>
                {this.props.content}
            </li>
        )
    }
    
    handleClick = () => {
        this.setState({ active: !this.state.active })
    }
    
    componentDidUpdate(prevProps) {
        if (!this.state.active && this.props !== prevProps) {
            this.setState({ active: true })
        }
    }
}

RecipeStep.propTypes = {
    content: PropTypes.string.isRequired
}

export default RecipeStep