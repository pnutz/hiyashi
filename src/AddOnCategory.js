import React, { PureComponent } from 'react';

import Utils from './Utils';

class AddOnCategory extends PureComponent {
    render() {
        let category = this.props.category;
        
        return (
            <div className="category">
                <h2 className="label">{ Utils.capitalize(category) }</h2>
                <div>
                    { this.props.children }
                </div>
            </div>
        );
    }
}

export default AddOnCategory;