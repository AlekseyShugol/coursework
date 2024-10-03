package org.example.mappers;

import org.example.dto.request.NodeRequest;
import org.example.dto.response.NodeResponse;
import org.example.entity.Node;
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
