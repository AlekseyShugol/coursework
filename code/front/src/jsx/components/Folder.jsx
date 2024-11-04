import React, { Component } from 'react';

class Folder extends Component{
  constructor(props){
    super(props)
  }
  render(){
    const { node, isActive, onClick, onDelete } = this.props

    return (
      <li>
        <div>
          <button
            className={`root-button ${isActive ? 'active' : ''}`}
            onClick={onClick}
          >
            {node.name}
          </button>
          {/* <button
            onClick={onDelete}
            style={{ marginLeft: '10px', color: 'red' }}
          >
            Удалить
          </button> */}
        </div>
      </li>
    )
  }
}
export default Folder;