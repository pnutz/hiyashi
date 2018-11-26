import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

import styles from './Servings.module.css'

class Servings extends PureComponent {
    render() {
        return (
            <div>
                <input
                    id="servings-input"
                    className={styles.input}
                    name="servings-input"
                    type="text"
                    maxLength="5"
                    value={this.props.value}
                    onChange={this.handleChange} />
                <label htmlFor="servings-input" className={styles.label}>Servings</label>
            </div>
        )
    }
    
    handleChange = (event) => {
        this.props.onServingsChange(event.target.value)
    }
}

Servings.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onServingsChange: PropTypes.func.isRequired
}

export default Servings