package com.ai.e_learning.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailSenderService {

  private JavaMailSender javaMailSender;
  public MailSenderService (JavaMailSender javaMailSender) {
    this.javaMailSender = javaMailSender;
  }


  public void sendMail(String toMail, String subject, String text) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom("code.codecollector@gmail.com");
    message.setTo(toMail);
    message.setSubject(subject);
    message.setText(text);
    this.javaMailSender.send(message);
  }
  public void sendEmail(String toMail, String subject, String body) {
    this.sendMail(toMail,subject,body);
  }
}
