import React from 'react';

const Folder = ({ node, isActive, onClick, onDelete }) => {
  return (
    <li>
      <div>
        <button
          className={`root-button ${isActive ? 'active' : ''}`}
          onClick={onClick}
        >
          {node.name}
        </button>
        <button
          onClick={onDelete}
          style={{ marginLeft: '10px', color: 'red' }}
        >
          Удалить
        </button>
      </div>
    </li>
  );
};

export default Folder;