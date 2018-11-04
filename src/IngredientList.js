import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

class IngredientList extends PureComponent {
    render() {
        return <div className="ingredient-category">
            <h2 className="label">{this.props.category}</h2>
                <ul className="ingredient-list">
                    {this.props.children}
                </ul>
            </div>;
    }
}

IngredientList.propTypes = {
    category: PropTypes.string.isRequired
}

export default IngredientList