import React, { Component } from 'react';
import '../../css/File.css'; // Импортируем CSS файл для стилизации

class File extends Component {
  constructor(props) {
    super(props);
    console.log('Current URL:', this.props.node?.url);
  }

  isFile(url) {
    return /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|gif)$/.test(url);
  }

  isYouTubeLink(url) {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(url);
  }

  render() {
    const { node, onDelete } = this.props;

    // Проверяем, существует ли node и его свойства
    if (!node || !node.url) {
      return null; // Если node или его url не существует, ничего не отображаем
    }

    return (
      <li className="file-item">
        {this.isYouTubeLink(node.url) ? (
          node.url.includes('embed/') ? (
            <div className="video-container">
              <p className={`description ${node.description?.length > 50 ? 'left' : 'center'}`}>
                {node.description}
              </p>
              <iframe
                src={node.url}
                title={node.name}
                frameBorder="0"
                allowFullScreen
              />
            </div>
          ) : (
            <a href={node.url} target="_blank" rel="noopener noreferrer">
              {node.name} (YouTube)
            </a>
          )
        ) : this.isFile(node.url) ? (
          <div className="file-container">
            <a href={node.url} target="_blank" rel="noopener noreferrer">
              {node.name} (Файл)
            </a>
            <p className={`description ${node.description?.length > 50 ? 'left' : 'center'}`}>
              {node.description}
            </p>
          </div>
        ) : (
          <div className="image-container">
            <img src={node.url} alt={node.name} />
          </div>
        )}
        {/* <button onClick={onDelete} className="delete-button">
          Удалить
        </button> */}
      </li>
    );
  }
}

export default File;