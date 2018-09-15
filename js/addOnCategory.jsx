let app = app || {};

(function() {
    'use strict';
    
    class AddOnCategory extends React.PureComponent {    
        render() {
            let category = this.props.category;
            
            return (
                <div className="category">
                    <h2 className="label">{ app.Utils.capitalize(category) }</h2>
                    <div>
                        { this.props.children }
                    </div>
                </div>
            );
        }
    }
    
    app.AddOnCategory = AddOnCategory;
})();