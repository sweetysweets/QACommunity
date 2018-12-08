package com.nju.zhihu;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@MapperScan("com.nju.zhihu.Dao")
@SpringBootApplication
public class ZhihuApplication {

	public static void main(String[] args) {
		SpringApplication.run(ZhihuApplication.class, args);
	}
}
