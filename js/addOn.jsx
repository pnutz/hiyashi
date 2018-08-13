let app = app || {};

(function() {
    'use strict';
    
    class AddOn extends React.Component {    
        render() {
            return (
                <div className="add-on">{ this.props.label } { this.props.state }</div>
            );
        }
    }
    
    app.AddOn = AddOn;
})();