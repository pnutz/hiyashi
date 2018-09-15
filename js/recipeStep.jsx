let app = app || {};

(function() {
    'use strict';
    
    class RecipeStep extends React.PureComponent { 
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
            if (!this.state.active && this.props != prevProps) {
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
    
    app.RecipeStep = RecipeStep;
})();