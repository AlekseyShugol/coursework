import React, { Component } from 'react';
//import './FillSection.css';

class FillSection extends Component {
    render() {
        return (
            <div className="fill-section">
                <h2>Заполнить раздел</h2>
                <p>Здесь вы можете заполнить существующий раздел.</p>
                <button onClick={this.props.onBack}>Назад</button>
            </div>
        );
    }
}

export default FillSection;