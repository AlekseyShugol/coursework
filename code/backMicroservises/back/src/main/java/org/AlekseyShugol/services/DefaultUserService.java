package org.AlekseyShugol.services;

import jakarta.transaction.Transactional;
import org.AlekseyShugol.dao.NodeRepository;
import org.AlekseyShugol.dao.UserRepository;
import org.AlekseyShugol.dto.request.AuthRequest;
import org.AlekseyShugol.dto.request.UserRequest;
import org.AlekseyShugol.dto.response.AuthResponse;
import org.AlekseyShugol.dto.response.UserResponse;
import org.AlekseyShugol.entity.User;
import org.AlekseyShugol.exeptions.NodeNotFoundException;
import org.AlekseyShugol.exeptions.UserNotFoundException;
import org.AlekseyShugol.mappers.NodeMapper;
import org.AlekseyShugol.mappers.UserMapper;
import org.AlekseyShugol.passwordUtil.PasswordUtil;
import org.AlekseyShugol.services.interfaces.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.StreamSupport;

@Transactional
@Service
public class DefaultUserService implements UserService {

    private final UserRepository repository;
    private final UserMapper mapper;

    public DefaultUserService(UserRepository repository, UserMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }
    @Override
    public UserResponse getUserById(Long id) {
        var userEntity = repository.findById(id).orElseThrow(()->new UserNotFoundException("There is no element with this id: "+id));
        System.out.println(userEntity.getId());
        return mapper.EntityToResponse(userEntity);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return repository.findAll()
                .stream()
                .map((mapper::EntityToResponse))
                .toList();
    }

    @Override
    public UserResponse addUser(UserRequest userRequest) {
        String hashed = PasswordUtil.hashPassword(userRequest.getPassword());
        userRequest.setPassword(hashed);
        var userEntity = mapper.RequestToEntity(userRequest);
        repository.save(userEntity);
        return  mapper.EntityToResponse(userEntity);
    }

    @Override
    public UserResponse updateUser(Long id, UserRequest userRequest) {
        var existingUser = repository.findById(id).orElseThrow(()->new UserNotFoundException("There is no users with id: " + id));
        mapper.updateUserFromRequest(userRequest,existingUser);
        var updatedUser = repository.save(existingUser);
        return mapper.EntityToResponse(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        repository.deleteById(id);
    }

    @Override
    public AuthResponse authUser(AuthRequest authRequest) {
        var userEntity = repository.findUserByLogin(authRequest.getLogin()).orElseThrow(()->new UserNotFoundException("There is no element with this id: "+authRequest.getLogin()));
        //authRequest.setLogin(authRequest.getLogin().hash())
//        String hashed = PasswordUtil.hashPassword(userEntity.getPassword());
//        authRequest.setPassword(hashed);
        if( PasswordUtil.checkPassword(authRequest.getPassword(), userEntity.getPassword()) ){
            return new AuthResponse(true);
        }
        return new AuthResponse(false);
    }
}
