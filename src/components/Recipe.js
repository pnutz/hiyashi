import React, {PureComponent} from 'react'

class Recipe extends PureComponent {
    render() {
        return (
            <div className="recipe">
                <h2 className="label">Recipe</h2>
                <ul className="recipe-steps">
                    {this.props.children}
                </ul>
            </div>
        )
    }
}

export default Recipe