import React, { PureComponent } from 'react';

class IngredientList extends PureComponent {
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

export default IngredientList;