package com.nju.zhihu.Controller;

import com.nju.zhihu.Dao.AdminDao;
import com.nju.zhihu.Dao.UserDao;
import com.nju.zhihu.Entity.Admin;
import com.nju.zhihu.Entity.User;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/login")
public class LoginController {

    @Autowired(required = false)
    private UserDao userDao;

    @RequestMapping("/addUser")
    public void addUser(@RequestParam("id")String id,@RequestParam("avater")String avater,@RequestParam("name")String name){
        User user =new User();
        user.setAvater(avater);
        user.setToken(id);
        user.setName(name);
        userDao.addUser(user);
    }


//    @RequestMapping("/getUserInfo")
//    public User getUserInfo(@RequestParam("id")String id){
//        User user = userDao.getUserById(id);
//        return user;
//    }



}
