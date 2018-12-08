package com.nju.zhihu.Controller;

import com.nju.zhihu.Dao.AdminDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.nju.zhihu.Entity.*;

@RestController
public class HelloController {

    @Autowired(required = false)
    private AdminDao adminDao;

    @RequestMapping("/hello")
    public Admin hello(){
        Admin user = adminDao.getUserById(1);
        System.out.println(user);
        return user;
    }

}
