let app = app || {};

(function() {
    'use strict';
    
    let Ingredient = app.Ingredient;
    
    class IngredientList extends React.PureComponent {
        render() {
            let category = this.props.category;
            
            return (
                <div className="category">
                    <h2 className="label">{ category }</h2>
                    <ul className="ingredient-list">
                        { this.props.children }
                    </ul>
                </div>
            );
        }
    }
    
    app.IngredientList = IngredientList;
})();