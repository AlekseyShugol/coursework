import React,{Component} from 'react';


class VideoContainer extends Component {
    constructor(props) {
        super(props);
        this.description = props.description;
        this.url = props.url;
        this.name = props.name;
    }
    render() {
        return (
            <div className="video-container">
                <p className={`description ${this.description?.length > 50 ? 'left' : 'center'}`}>
                    {this.description}
                </p>
                <iframe
                    src={this.url}
                    title={this.name}
                    frameBorder="0"
                    allowFullScreen
                />
            </div>
        )
    }
}

export default VideoContainer;