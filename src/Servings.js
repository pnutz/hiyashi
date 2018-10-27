import React, {PureComponent} from 'react'

import './Servings.css'

class Servings extends PureComponent {
    render() {
        return (
            <div className="servings">
                <input
                    id="servings-input"
                    className="servings-input"
                    name="servings-input"
                    type="number"
                    min="0"
                    value={this.props.value}
                    onChange={this.handleChange} />
                <label htmlFor="servings-input" className="label">Servings</label>
            </div>
        )
    }
    
    handleChange = (event) => {
        this.props.onServingsChange(event.target.value)
    }
}

export default Servings