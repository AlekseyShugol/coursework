// File.jsx
import React, { Component } from 'react';
import '../../css/File.css'; // Импортируем CSS файл для стилизации
import { isFile, isYouTubeLink } from '../../js/functions/checker';

class File extends Component {
  constructor(props) {
    super(props);
    console.log(`FILE CLASS:\n\
            ID: ${this.props.node?.id}
            NAME: ${this.props.node?.name}\n
            TYPE: ${this.props.node?.type}\n
            PID: ${this.props.node?.parent_id}\n
            URL: ${this.props.node?.url}\n,
            DESCRIPTION: ${this.props.node?.description}\n
            POSITION: ${this.props.node?.element_position}
            `
    );
  }

  render() {
    const { node, onDelete } = this.props;

    // Проверяем, существует ли node и его свойства
    if (!node || !node.url) {
      return null; // Если node или его url не существует, ничего не отображаем
    }

    return (
      <li className="file-item">
        {isYouTubeLink(node.url) ? (
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
        ) : isFile(node.url) ? (
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
            <img src={node.url} alt={node.name} style={{ pointerEvents: 'none' }} /> {/* Картинка некликабельная */}
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