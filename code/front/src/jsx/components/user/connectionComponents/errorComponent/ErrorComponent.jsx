import React, { Component } from 'react';
import Cross from './CrossComponent';
import '../../../../../css/Error.css';

class ErrorComponent extends Component {
    render() {
        return (
            <div className="error-message" style={styles.errorContainer}>
                <p>{this.props.text}</p>
                <Cross isVisible={true} />
            </div>
        );
    }
}

const styles = {
    errorContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh', // Занимает всю высоту экрана
        textAlign: 'center',
    },
};

export default ErrorComponent;