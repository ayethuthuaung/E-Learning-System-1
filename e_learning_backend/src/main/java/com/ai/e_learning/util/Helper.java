package com.ai.e_learning.util;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Random;

@Service
public class Helper {
    public static LocalDate convertLongToLocalDate(Long milliseconds){
        if (milliseconds == null) {
            throw new IllegalArgumentException("Milliseconds cannot be null");
        }

        Instant instant = Instant.ofEpochMilli(milliseconds);
        return instant.atZone(ZoneId.systemDefault()).toLocalDate();
    }

  public static String generateOTPCode() {
    // Create an instance of the Random class
    Random random = new Random();

    // Define the range for a 6-digit number
    int min = 100000;
    int max = 999999;

    // Generate a 6-digit random number
    int randomNumber = random.nextInt(max - min + 1) + min;

    // Format the number to ensure it has 6 digits with leading zeros if necessary
    return String.format("%06d", randomNumber);
  }
}
