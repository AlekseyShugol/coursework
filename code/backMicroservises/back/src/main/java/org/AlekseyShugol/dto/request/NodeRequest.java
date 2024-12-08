package org.AlekseyShugol.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "This is request to DB with folders")
public class NodeRequest {

    @NotBlank(message = "The name must not be empty")
    @Size(min = 1, max = 16384, message = "The name must be more than zero characters")
    private String name;

    @Schema(description = "type of content", example = "FOLDER, FILE, URL")
    private String type;

    @Positive(message = "The parent ID must be a positive number")
    private Long parent_id;

    @Schema(description = "url to file or internet video")
    private String url;

    @Schema(description = "file description")
    private String description;

    @Schema(description = "position of elements")
    private Long element_position;
}
