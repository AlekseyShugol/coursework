import React, {Component} from "react";

class FileContainer extends Component {
    constructor(props) {
        super(props);
        this.name = props.name;
        this.description = props.description;
        this.url = props.url;
        this.downloadFile = this.downloadFile.bind(this);
    }
    downloadFile(){
        const { node } = this.props;
        if (!node || !node.url) return;

        fetch(node.url)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", node.name || 'download'); // Используем node.name или по умолчанию
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url); // Освобождаем объект URL
            })
            .catch(error => console.error('Ошибка скачивания:', error));
    }

    render() {
        return (
            <div className="file-container">
                <p className="file-name">
                    <b>{this.name}</b>
                </p>
                <p className={`description ${this.description?.length > 50 ? 'left' : 'center'}`}>
                    {this.description}
                </p>
                <button onClick={this.downloadFile} className="download-button">Скачать</button>
            </div>
        )
    }
}
export default FileContainer;