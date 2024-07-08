package com.ai.e_learning.config;


import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {
    private final String CLOUD_NAME = "dshrtebct";
    private final String API_KEY = "341763891443694";
    private final String API_SECRET = "bFeY658mmqK5oOzguQsLp4JwnEY";

    @Bean
    public Cloudinary getCloudinary() {
        Map<String,String> config = new HashMap<>();
        config.put("cloud_name", CLOUD_NAME);
        config.put("api_key", API_KEY);
        config.put("api_secret", API_SECRET);

        return new Cloudinary(config);
    }

}