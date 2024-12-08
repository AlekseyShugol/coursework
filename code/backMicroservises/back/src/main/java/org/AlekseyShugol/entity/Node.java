package org.AlekseyShugol.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.util.Objects;

@Data
@Entity
@Table(name = "nodes")
@ToString
public class Node {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //autogeneration
    @Column(nullable = false)
    private Long id;

    private String name;

    private String type;

    private Long parentId;

    private String url;

    private String description;

    private Long element_position;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Node that = (Node) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public final int hashCode() {
        return Objects.hash(id);
    }
}