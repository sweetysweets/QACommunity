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
//    public List<Question> getMyfocus(@RequestParam("userid") String userid){
////        int user_id = Integer.parseInt(userid);
////        User user = userDao.getUserById(userid);
//
//        List<User> users = userDao.getFollowUserById(userid);
////        System.out.println(user.getAvater())
//        List<Question> questions = new ArrayList<Question>();
//        for( int i = 0 ; i < users.size() ; i ++ ){//用循环来获取获得的所有关注用户的相关问题
//            List<Question> tempQuestionsList = userDao.getQuestionByUserId(String.valueOf(users.get(i).getToken()));
//            for( int j = 0 ; j < tempQuestionsList.size() ; j++){
//                questions.add(tempQuestionsList.get(j));
//            }
//        }
//
//        System.out.println(questions.get(0).getContent());
////         = ;
//        //根据上面获得所有我的关注的人
//        return questions;
    }
