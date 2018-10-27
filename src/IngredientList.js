import React, {PureComponent} from 'react'

class IngredientList extends PureComponent {
    render() {
        return <div className="category">
            <h2 className="label">{this.props.category}</h2>
                <ul className="ingredient-list">
                    {this.props.children}
                </ul>
            </div>;
    }
}

export default IngredientList