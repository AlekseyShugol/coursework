package org.AlekseyShugol.services.interfaces;

import org.AlekseyShugol.dto.request.NodeRequest;
import org.AlekseyShugol.dto.response.NodeResponse;

import java.util.List;

public interface NodeService {

    NodeResponse getNodeById(Long id);

    List<NodeResponse> getAllNodes();

    NodeResponse addNode(NodeRequest nodeRequest);

    NodeResponse updateNode(Long id, NodeRequest nodeRequest);

    void deleteNode(Long id);
}
