package org.AlekseyShugol.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data

public class AuthRequest {

    @NotBlank(message = "The login must not be empty")
    private String login;

    @NotBlank(message = "The password must be not empty")
    private String password;
}
