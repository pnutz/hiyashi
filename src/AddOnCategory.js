import React, {PureComponent} from 'react'

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

export default AddOnCategory