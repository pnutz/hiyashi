import React, {PureComponent} from 'react'

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
    
        return (
            <li
                className={className}
                onClick={this.onClick}>
                {this.props.label} {this.props.quantity} {this.props.unit}
            </li>
        )
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

export default Ingredient