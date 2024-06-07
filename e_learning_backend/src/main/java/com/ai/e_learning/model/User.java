package com.ai.e_learning.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

   @Column(nullable = false, length = 10)
    private String staffId;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 70)
    private String email;

    @Column(nullable = false, length = 10)
    private String doorLogNo;

    @Column(nullable = false, length = 70)
    private String team;

    @Column(nullable = false, length = 70)
    private String department;

    @Column(nullable = false, length = 70)
    private String division;

    @Column(nullable = false, length = 10)
    private String status;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String photo;

    @Column(nullable = false)
    private String password;

    private Long createdAt;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "user_has_role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    @JsonIgnore
    private Set<Role> roles;

    private boolean enabled;

 @PrePersist
 protected void onCreate() {
  this.createdAt = System.currentTimeMillis();
 }

}
