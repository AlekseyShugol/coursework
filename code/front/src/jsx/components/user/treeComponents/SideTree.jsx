import React from 'react';
import Folder from '../folderComponents/Folder';
import File from '../fileComponents/File';
import '../../../../css/SideTree.css'; // Импортируем стили

const SideTree = ({ data, currentFolder, onFolderClick, onDelete }) => {
    const renderTree = (nodes) => {
        const sortedNodes = nodes.sort((a, b) => a.element_position - b.element_position);

        return sortedNodes.map(node => {
            const children = data.filter(item => item.parentId === node.id);
            return (
                <React.Fragment key={node.id}>
                    {node.type === 'FOLDER' ? (
                        <Folder
                            node={node}
                            isActive={currentFolder === node.id}
                            onClick={() => onFolderClick(node.id)}
                            onDelete={() => onDelete(node.id)}
                        >
                            {children.length > 0 && renderTree(children)}
                        </Folder>
                    ) : (
                        <File
                            node={node}
                            onDelete={() => onDelete(node.id)}
                        />
                    )}
                </React.Fragment>
            );
        });
    };

    const rootFolders = data.filter(item => item.parentId === null);

    return (
        <div className="side-tree">
        
            <ul>
                {renderTree(rootFolders)}
            </ul>
        </div>
    );
};

export default SideTree;