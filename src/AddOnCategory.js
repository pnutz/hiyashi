import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

class AddOnCategory extends PureComponent {
    render() {
        return (
            <div className="category">
                <h2 className="label">{this.props.category}</h2>
                <div>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

AddOnCategory.propTypes = {
    category: PropTypes.string.isRequired
}

export default AddOnCategory