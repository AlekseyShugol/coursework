package org.AlekseyShugol.controller;


import jakarta.validation.Valid;
import org.AlekseyShugol.dto.request.AuthRequest;
import org.AlekseyShugol.dto.request.UserRequest;
import org.AlekseyShugol.dto.response.AuthResponse;
import org.AlekseyShugol.dto.response.UserResponse;
import org.AlekseyShugol.services.interfaces.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public UserResponse getUser(@PathVariable Long id){
        return userService.getUserById(id);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<UserResponse> getAllUsers(){
        return userService.getAllUsers();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse addUser(@RequestBody @Valid UserRequest request){
        return userService.addUser(request);
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public AuthResponse loginUser(@RequestBody @Valid AuthRequest request){
        return userService.authUser(request);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public UserResponse updateUser(@PathVariable Long id, @RequestBody @Valid UserRequest request){
        return  userService.updateUser(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteNode(@PathVariable Long id){
        userService.deleteUser(id);
    }
}
