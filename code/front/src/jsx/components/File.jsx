import React from 'react';

const File = ({ node, onDelete }) => {
  // Логируем URL при каждом рендере
  console.log('Current URL:', node.url);

  const isImage = (url) => {
    // Проверяем, является ли URL файлом
    return /\.(jpg|jpeg|png|)$/.test(url);
  };
  
  const isFile = (url) => {
    return /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|gif)$/.test(url);
  };

  const isYouTubeLink = (url) => {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(url);
  };

  return (
    <li>
      {isYouTubeLink(node.url) ? (
        node.url.includes('embed/') ? (
          <iframe
            width="420"
            height="315"
            src={node.url}
            title={node.name}
            frameBorder="0"
            allowFullScreen
          />
        ) : (
          <a href={node.url} target="_blank" rel="noopener noreferrer">
            {node.name} (YouTube)
          </a>
        )
      ) : isFile(node.url) ? (
        <a href={node.url} target="_blank" rel="noopener noreferrer">
          {node.name} (Файл)
        </a>
      ) : (
        <img src={node.url} alt={node.name} style={{ width: '200px', height: 'auto' }} />
      )}
      <button onClick={onDelete} style={{ marginLeft: '10px', color: 'red' }}>
        Удалить
      </button>
    </li>
  );
};

export default File;