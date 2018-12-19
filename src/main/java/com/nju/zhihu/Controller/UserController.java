package com.nju.zhihu.Controller;

import com.nju.zhihu.Dao.UserDao;
import com.nju.zhihu.Entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/user")
public class UserController {
    @Autowired(required = false)
    private UserDao userDao;

    @RequestMapping(value = "/focus_users")
    public Map<String,Object> listUser(@RequestParam("userid") String userid) {
        Map<String,Object> userMap = new HashMap<String,Object>();
        List<User> user = userDao.getFollowUserById(userid);
        userMap.put("userList",user);
        return userMap;
    }
    @RequestMapping(value = "/usersinfo")
    public Map<String,Object> Userinfo(@RequestParam("userid") String userid) {
        Map<String,Object> userMap = new HashMap<String,Object>();
        List<User> user = userDao.getUserById(userid);
        userMap.put("userInfo",user);
        return userMap;
    }
}
