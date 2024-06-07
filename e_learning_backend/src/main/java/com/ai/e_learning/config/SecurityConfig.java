package com.ai.e_learning.config;

import java.io.IOException;
import java.util.Set;


import com.ai.e_learning.security.OurUserDetailService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;



import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final OurUserDetailService userDetailService;

    @Bean
    public static PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filter(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
//                .cors(Customizer.withDefaults())
//                .httpBasic(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // to test
                        .requestMatchers("/user/login", "/user/register").permitAll()
                        .requestMatchers("/assets/**", "/homeassets/**").permitAll()
                        .requestMatchers("/admin/**").hasAuthority("admin")
                        .anyRequest().authenticated()
                )
                .exceptionHandling(
                        (exceptionHandling) -> exceptionHandling
                                .accessDeniedPage("/accessDenied")
                )
                .formLogin(form -> form
                        .loginPage("/user/login")
                        .loginProcessingUrl("/signIn")
                        /*.defaultSuccessUrl("/vinnnm/home")
                        .successHandler(
                                (((request, response, authentication) -> {
                                    response.sendRedirect("/vinnnm/home");
                                }))
                        )*/
                        .successHandler(customAuthenticationSuccessHandler())
                        .failureHandler(authenticationFailureHandler())
                        .permitAll()
                ).logout(
                        logout -> logout
                                .logoutUrl("/signOut")
                                .logoutSuccessUrl("/login")
                                .logoutSuccessHandler(
                                        (((request, response, authentication) -> {
                                            response.sendRedirect("/login");
                                        }))
                                )
                                .invalidateHttpSession(true)
                                .permitAll()
                );
        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService(){
        return new OurUserDetailService();
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, authException) -> {
            response.sendRedirect("/login");
        };
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        System.out.println("out");
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();

        daoAuthenticationProvider.setUserDetailsService(userDetailService);
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        return daoAuthenticationProvider;
    }

    @Bean
    public AuthenticationFailureHandler authenticationFailureHandler() {
        return (request, response, exception) -> {
            String errorMessage = "Incorrect username or password.";
            request.getSession().setAttribute("errorMessage", errorMessage);
            response.sendRedirect("/login?error");
        };
    }

    @Bean
    public AuthenticationSuccessHandler customAuthenticationSuccessHandler() {
        return new AuthenticationSuccessHandler() {
            @Override
            public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                                org.springframework.security.core.Authentication authentication)
                    throws IOException, ServletException {
                System.out.println("Hi");
                Set<String> authorities = AuthorityUtils.authorityListToSet(authentication.getAuthorities());

                if (authorities.contains("admin")) {
                    response.sendRedirect("/admin/dashboard");
                } else if (authorities.contains("user")) {
                    response.sendRedirect("/user/home");
                } else {
                    response.sendRedirect("/home");
                }
            }
        };
    }
}
