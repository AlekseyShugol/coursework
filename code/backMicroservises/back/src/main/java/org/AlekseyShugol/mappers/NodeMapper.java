package org.AlekseyShugol.mappers;

import org.AlekseyShugol.dto.request.NodeRequest;
import org.AlekseyShugol.dto.response.NodeResponse;
import org.AlekseyShugol.entity.Node;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

//convert response and request to entity
@Mapper(componentModel = "spring")
public interface NodeMapper {
    Node RequestToEntity(NodeRequest request);

    NodeRequest EntityToRequest(Node node);

    Node ResponseToEntity(NodeResponse response);

    NodeResponse EntityToResponse(Node node);

    void updateNodeFromRequest(NodeRequest request, @MappingTarget Node node);
}
