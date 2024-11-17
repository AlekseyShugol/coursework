import React,{Component} from 'react';

class MainFrame extends Component{
    constructor(props){
        super(props)
        this.id = props.id
        this.name = props.name
        this.type = props.type
        this.parrent_id = props.parrent_id
        this.url = props.url
        this.description = props.description
        this.element_position = props.element.position

        console.log(`MAINFRAME CLASS:\n\
            ID: ${this?.id}
            NAME: ${this?.name}\n
            TYPE: ${this?.type}\n
            PID: ${this?.parrent_id}\n
            URL: ${this?.url}\n,
            DESCRIPTION: ${this?.description}\n
            POSITION: ${this?.element_position}  `
        )
    }
    render(){
        return (
            <div className="image1-container">
                <img src={this.url} alt={this.name} style={{pointerEvents: 'none'}}/> {/* Картинка некликабельная */}
            </div>
        )
    }
    
}

export default MainFrame;