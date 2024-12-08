package org.AlekseyShugol.mappers;

import org.AlekseyShugol.dto.request.NodeRequest;
import org.AlekseyShugol.dto.request.UserRequest;
import org.AlekseyShugol.dto.response.UserResponse;
import org.AlekseyShugol.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User RequestToEntity(UserRequest request);

    UserRequest EntityToRequest(User user);

    User ResponseToEntity(UserResponse response);

    UserResponse EntityToResponse(User user);

    void updateUserFromRequest(UserRequest request, @MappingTarget User user);

}
