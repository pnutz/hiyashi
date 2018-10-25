import React, {PureComponent} from 'react'

import {capitalize} from './Utils'

class AddOnCategory extends PureComponent {
    render() {
        return (
            <div className="category">
                <h2 className="label">{capitalize(this.props.category)}</h2>
                <div>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default AddOnCategory