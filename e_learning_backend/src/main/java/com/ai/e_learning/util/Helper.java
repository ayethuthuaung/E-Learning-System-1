package com.ai.e_learning.util;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

@Service
public class Helper {
    public static LocalDate convertLongToLocalDate(Long milliseconds){
        if (milliseconds == null) {
            throw new IllegalArgumentException("Milliseconds cannot be null");
        }

        Instant instant = Instant.ofEpochMilli(milliseconds);
        return instant.atZone(ZoneId.systemDefault()).toLocalDate();
    }
}