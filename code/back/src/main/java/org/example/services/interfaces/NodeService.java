package org.example.services.interfaces;

import org.example.dto.request.NodeRequest;
import org.example.dto.response.NodeResponse;

import java.util.List;

public interface NodeService {
    NodeResponse getNodeById(Long id);

    List<NodeResponse> getAllNodes();
    NodeResponse addNode(NodeRequest nodeRequest);
    NodeResponse updateNode(Long id, NodeRequest nodeRequest);
    void deleteNode(Long id);
}
