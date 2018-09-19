import React, { PureComponent } from 'react';

class RecipeStep extends PureComponent { 
    constructor(props) {
        super(props);
        
        this.state = {
            active: true
        };
        
        this.handleClick = this.handleClick.bind(this);
    }
    
    render() {
        let className = 'recipe-step';
        
        if (!this.state.active) {
            // text-decoration: line-through;
            className += ' inactive';
        }
    
        return (
            <li
                className={className}
                onClick={this.handleClick}>
                { this.props.content }
            </li>
        );
    }
    
    componentDidUpdate(prevProps) {
        if (!this.state.active && this.props !== prevProps) {
            this.setState({
                active: true
            });
        }
    }
    
    handleClick() {
        this.setState({
            active: !this.state.active
        });
    }
}

export default RecipeStep;