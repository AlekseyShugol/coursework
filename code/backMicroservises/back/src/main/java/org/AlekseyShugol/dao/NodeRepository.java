package org.AlekseyShugol.dao;

import org.AlekseyShugol.entity.Node;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NodeRepository extends JpaRepository<Node,Long> {
    List<Node> findByParentId(Long parentId);
    Node findFirstByParentIdIsNull();
}
