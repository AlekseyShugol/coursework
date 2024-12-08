package org.AlekseyShugol.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRequest {
    @NotBlank(message = "Login must not be empty")
    @Size(min = 1, message = "Login  must be more than zero characters")
    private String login;

    @NotBlank(message = "Password must not be empty")
    @Size(min = 1, message = "Password  must be more than zero characters")
    private String password;

    @NotBlank(message = "Role must not be empty")
    private String role;
}
