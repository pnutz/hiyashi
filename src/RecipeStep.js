import React, {PureComponent} from 'react'

import './List.css'

class RecipeStep extends PureComponent { 
    constructor(props) {
        super(props)
        
        this.state = { active: true }
    }
    
    render() {
        let className = 'recipe-step'
        
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

export default RecipeStep