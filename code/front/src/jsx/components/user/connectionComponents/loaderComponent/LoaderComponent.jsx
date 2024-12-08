// src/Loader.js
import React from 'react';
import '../../../../../css/Loader.css';

class Loader extends React.Component {
    state = {
        dotCount: 0
    };

    componentDidMount() {
        this.dotInterval = setInterval(() => {
            this.setState(prevState => ({
                dotCount: (prevState.dotCount + 1) % 4 // Сброс до 0 после 3
            }));
        }, 1000); // Каждую секунду

    }

    componentWillUnmount() {
        clearInterval(this.dotInterval); // Очищаем интервал при размонтировании
    }

    render() {
        const { dotCount } = this.state;
        const dots = '.'.repeat(dotCount); // Создаем строки с точками

        return (
            <div className="loader-container">
                <div className="loader"></div>
                <div className="loading-text">
                    Загрузка{dots}
                </div>
            </div>
        );
    }
}

export default Loader;