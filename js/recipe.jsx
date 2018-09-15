let app = app || {};

(function() {
    'use strict';
    
    class Recipe extends React.PureComponent {
        render() {
            return (
                <div className="recipe">
                    <h2 className="label">Recipe</h2>
                    <ul className="recipe-steps">
                        { this.props.children }
                    </ul>
                </div>
            );
        }
    }
    
    app.Recipe = Recipe;
})();