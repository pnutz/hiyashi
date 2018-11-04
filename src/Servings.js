import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

import './Servings.css'

class Servings extends PureComponent {
    render() {
        return (
            <div className="servings">
                <input
                    id="servings-input"
                    className="servings-input"
                    name="servings-input"
                    type="text"
                    maxLength="5"
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

Servings.propTypes = {
    value: PropTypes.number.isRequired,
    onServingsChange: PropTypes.func.isRequired
}

export default Servings