package org.AlekseyShugol.services;

import jakarta.transaction.Transactional;
import org.AlekseyShugol.dao.NodeRepository;
import org.AlekseyShugol.dto.request.NodeRequest;
import org.AlekseyShugol.dto.response.NodeResponse;
import org.AlekseyShugol.entity.Node;
import org.AlekseyShugol.exeptions.NodeNotFoundException;
import org.AlekseyShugol.mappers.NodeMapper;
import org.AlekseyShugol.services.interfaces.NodeService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.StreamSupport;


@Transactional
@Service
public class DefaultNodeService implements NodeService {
    private final NodeRepository repository;
    private final NodeMapper mapper;

    public DefaultNodeService(NodeRepository repository, NodeMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public NodeResponse getNodeById(Long id) {
        var nodeEntity = repository.findById(id).orElseThrow(()->new NodeNotFoundException("There is no element with this id: "+id));
        System.out.println(nodeEntity.getId());
        return mapper.EntityToResponse(nodeEntity);
    }

    @Override
    public List<NodeResponse> getAllNodes() {
        Iterable<Node> nodes = repository.findAll();
        return StreamSupport.stream(nodes.spliterator(),false).map((mapper::EntityToResponse)).toList();
    }

    @Override
    public NodeResponse addNode(NodeRequest nodeRequest) {
        var nodeEntity = mapper.RequestToEntity(nodeRequest);
        repository.save(nodeEntity);
        return mapper.EntityToResponse(nodeEntity);
    }

    @Override
    public NodeResponse updateNode(Long id, NodeRequest nodeRequest) {
        var existingNode = repository.findById(id).orElseThrow(()->new NodeNotFoundException("There is no element with this id: "+id));
        mapper.updateNodeFromRequest(nodeRequest,existingNode);
        var updatedNode = repository.save(existingNode);
        return mapper.EntityToResponse(updatedNode);
    }

    @Override
    public void deleteNode(Long id) {
        // Проверяем, существует ли узел с данным id
        if (!repository.existsById(id)) {
            throw new NodeNotFoundException("There is no element with this id: " + id);
        }

        // Находим все дочерние узлы с parent_id равным удаляемому id
        List<Node> childNodes = repository.findByParentId(id);

        // Удаляем все дочерние узлы
        for (Node child : childNodes) {
            deleteNode(child.getId());
        }

        // Удаляем сам узел
        repository.deleteById(id);
    }
}
