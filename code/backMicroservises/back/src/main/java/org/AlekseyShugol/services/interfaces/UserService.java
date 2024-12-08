package org.AlekseyShugol.services.interfaces;

import org.AlekseyShugol.dto.request.AuthRequest;
import org.AlekseyShugol.dto.request.UserRequest;
import org.AlekseyShugol.dto.response.AuthResponse;
import org.AlekseyShugol.dto.response.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse getUserById(Long id);

    List<UserResponse> getAllUsers();

    UserResponse addUser(UserRequest userRequest);

    UserResponse updateUser(Long id, UserRequest userRequest);

    void deleteUser(Long id);

    AuthResponse authUser(AuthRequest authRequest);
}
