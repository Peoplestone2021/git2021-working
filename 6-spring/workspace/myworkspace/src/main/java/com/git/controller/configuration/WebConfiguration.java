package com.git.controller.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfiguration implements WebMvcConfigurer {
	// CORS(cross origin resource sharing)�� ����
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry
     // ���� ��å�� ������ ���ҽ�
        	.addMapping("/**") //** -> ��ü ���ҽ��� ��� (/todos, /contacts, ...)
//        	������å�� ����� ������ ���
//        	origin: html������ ������ ������ �ּ�
//        	html��������
        	
        	.allowedOrigins(
        			"http://localhost:3000", 
        			"http://127.0.0.1:5500",
        			"http://ec2-13-125-218-233.ap-northeast-2.compute.amazonaws.com:8080")
        	.allowedMethods("*");
    }
}
