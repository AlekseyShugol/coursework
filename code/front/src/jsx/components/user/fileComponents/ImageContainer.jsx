import React, {Component} from "react";

class ImageContainer extends Component {
    constructor(props) {
        super(props);
        this.description = props.description;
        this.url = props.url;
        this.name = props.name;
    }
    render(){
        return (
            <div className="image-container">
                <p className={`description ${this.description?.length > 50 ? 'left' : 'center'}`}>
                    {this.description}
                </p>
                <img src={this.url} alt={this.name} style={{pointerEvents: 'none'}}/> {/* Картинка некликабельная */}
            </div>
        )
    }
}
export default ImageContainer;