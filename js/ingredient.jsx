let app = app || {};

(function() {
    'use strict';
    
    class Ingredient extends React.PureComponent { 
        constructor(props) {
            super(props);
            
            this.state = {
                active: true
            };
            
            this.handleClick = this.handleClick.bind(this);
        }
        
        render() {
            console.log('rerender', this.state);
            let className = 'ingredient';
            
            if (!this.state.active) {
                // text-decoration: line-through;
                className += ' inactive';
            }
        
            return (
                <li
                    className={className}
                    onClick={this.handleClick}>
                    { this.props.label } { this.props.quantity } { this.props.unit }
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
    
    app.Ingredient = Ingredient;
})();