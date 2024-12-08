package org.AlekseyShugol.dto.response;

public record UserResponse(

        Long id,

        String login,

        String password,

        String role

) {}
