package com.ai.e_learning.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ImageResponse {
    private int status;
    private String message;
    private String url;


}