package org.AlekseyShugol.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

public record NodeResponse(
        @Schema(description = "folder id")
        Long id,

        @Schema(description = "name of folder or file")
        String name,

        @Schema(description = "type of content", example = "FOLDER, FILE, URL")
        String type,

        @Schema(example = "parent elements id")
        Long parentId,

        @Schema(description = "url to file or internet video")
        String url,

         @Schema(description = "file description")
         String description,

        @Schema(description = "position of elements")
        Long element_position

){}