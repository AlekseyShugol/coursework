import {Component} from "react";
import "../../../../../css/Error.css"


class Cross extends Component {
    render() {
        const { isVisible } = this.props;
        return (
            <div className={`cross ${isVisible ? 'visible' : ''}`}>
                <div className={`line line1 ${isVisible ? 'animate' : ''}`}></div>
                <div className={`line line2 ${isVisible ? 'animate' : ''}`}></div>
            </div>
        );
    }
}

export default Cross;