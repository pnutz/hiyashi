import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

import './List.css'

class RecipeStep extends PureComponent { 
    constructor(props) {
        super(props)
        
        this.state = { active: true }
    }
    
    render() {
        let className = 'list-item recipe-step'
        
        if (!this.state.active) {
            className += ' inactive'
        }
    
        return (
            <li
                className={className}
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