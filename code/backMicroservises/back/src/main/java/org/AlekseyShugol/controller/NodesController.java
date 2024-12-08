package org.AlekseyShugol.controller;

import jakarta.validation.Valid;
import org.AlekseyShugol.dto.request.NodeRequest;
import org.AlekseyShugol.dto.response.NodeResponse;
import org.AlekseyShugol.services.interfaces.NodeService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/nodes")
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "*")
public class NodesController {
    private final NodeService nodeService;

    public NodesController(NodeService nodeService) {
        this.nodeService = nodeService;
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public NodeResponse getNode(@PathVariable Long id) {
        return nodeService.getNodeById(id);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<NodeResponse> getAllNodes() {
        return nodeService.getAllNodes();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NodeResponse addNode(@RequestBody @Valid NodeRequest request) {
        return nodeService.addNode(request);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public NodeResponse updateNode(@PathVariable Long id, @RequestBody @Valid NodeRequest request) {
        return nodeService.updateNode(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteNode(@PathVariable Long id) {
        nodeService.deleteNode(id);
    }
}