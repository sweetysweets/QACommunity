package com.nju.zhihu.Controller;

import com.nju.zhihu.Dao.UserDao;
import com.nju.zhihu.Entity.FollowUser;
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

    //此方法与上面的/focus_users方法功能一致，不过我用的是List<User>，也是查询所有关注的用户列表
    //@Author: wsx
    @RequestMapping(value ="/getallmyfollowusers")
    public List<User> getAllmyFollowUsers(@RequestParam("userid") int userid){
        String userid_str = String.valueOf(userid);
        return userDao.getFollowUserById(userid_str);
    }

    //请求插入关注用户数据
    @RequestMapping(value = "/insertmyfollowuser")
    public int insertMyFollowUser(@RequestParam("userid") int userid , @RequestParam("userfollowedid") int userfollowedid){
        userDao.insertMyFollowUser(userid,userfollowedid);
        return 0;
    }

    //取消关注该用户（答主），删除数据
    @RequestMapping(value = "/cancelmyfollowuser")
    public int cancelMyFollowUser(@RequestParam("userid") int userid , @RequestParam("userfollowedid") int userfollowedid){
        FollowUser fu = userDao.getFollowUserId(userid,userfollowedid);
        System.out.println(fu.getFuid());

        userDao.cancelFollowUser(fu.getFuid());
        return 0;
    }
}
