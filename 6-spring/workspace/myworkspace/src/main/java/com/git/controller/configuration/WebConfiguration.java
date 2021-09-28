package com.git.controller.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfiguration implements WebMvcConfigurer {
	// CORS(cross origin resource sharing)을 설정
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry
     // 공유 정책을 적용할 리소스
        	.addMapping("/**") //** -> 전체 리소스를 허용 (/todos, /contacts, ...)
//        	공유정책을 허용할 오리진 목록
//        	origin: html문서를 배포한 서버의 주소
//        	html문서에서
        	
        	.allowedOrigins(
        			"http://localhost:3000", 
        			"http://127.0.0.1:5500",
        			"http://ec2-13-125-218-233.ap-northeast-2.compute.amazonaws.com:8080")
        	.allowedMethods("*");
    }
}
