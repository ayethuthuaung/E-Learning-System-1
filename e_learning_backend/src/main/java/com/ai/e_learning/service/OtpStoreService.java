package com.ai.e_learning.service;

import org.springframework.stereotype.Service;

@Service
public class OtpStoreService {
  private int storedData;


  public void storeData(int data) {
    this.storedData = data;
  }

  public int retrieveData() {
    return storedData;
  }

  public void clearData() {
    this.storedData = 0; // Clear data
  }
}
