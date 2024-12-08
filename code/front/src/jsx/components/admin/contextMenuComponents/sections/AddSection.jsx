import React, { Component } from 'react';
//import './AddSection.css';

class AddSection extends Component {
    render() {
        return (
            <div className="add-section">
                <h2>Добавить раздел</h2>
                <p>Здесь вы можете добавить новый раздел.</p>
                <button onClick={this.props.onBack}>Назад</button>
            </div>
        );
    }
}

export default AddSection;