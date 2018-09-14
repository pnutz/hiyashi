let app = app || {};

(function() {
    'use strict';
    
    class AddOn extends React.PureComponent { 
        constructor(props) {
            super(props);
            
            this.handleClick = this.handleClick.bind(this);
        }
        
        render() {
            /* TODO: styles
            * color based on data-value (selected add-on vs add-on)
            * hover opacity and display next value / hide actual value
            * content: attr(data-value); OR data-next
            *
            * icon if this.props.required?
            *
            * TODO: functionality (custom input)
            * icon to toggle input to set custom amount
            */
            
            return (
                <div
                    className="add-on"
                    data-value={this.props.value}
                    data-next-value={this.getNextValue(this.props.value, this.props.required)}
                    onClick={this.handleClick}>
                    { this.props.label } { this.props.value /*TODO: remove rendered value after style */ }
                </div>
            );
        }
        
        handleClick() {
            let value = this.getNextValue(this.props.value, this.props.required);
            this.handleChange(value);
        }
        
        handleChange(value) {
            this.props.onAddOnChange(this.props.category, this.props.addon, value);
        }
        
        getNextValue(value, required) {
            switch (value) {
                case 0:
                    value = 1;
                    break;
                case 1:
                    value = 0.5;
                    break;
                case 0.5:
                    value = 2;
                    break;
                case 2:
                default:
                    value = (required) ? 1 : 0;
                    break;
            }
            
            return value;
        }
    }
    
    app.AddOn = AddOn;
})();