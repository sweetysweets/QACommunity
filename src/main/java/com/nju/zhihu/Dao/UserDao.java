package com.nju.zhihu.Dao;

import com.nju.zhihu.Entity.FollowUser;
import com.nju.zhihu.Entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;


@Mapper//加上该注解才能使用@MapperScan扫描到
public interface UserDao {

    void addUser(@Param("user") User user);

    //查询该用户关注的用户
    List<User> getFollowUserById(@Param("id") String token);
    //查询关注的用户的用户信息
    List<User> getUserById(@Param("id") String token);

    User getUserByToken(@Param("id") String token);

//    List<User> getAllmyFollowUsers(@Param("id") );

    //插入关注用户记录
    void insertMyFollowUser(@Param("userid") int userid , @Param("userfollowedid") int userfollowedid);

    //查询关注用户记录的 follow_id
    FollowUser getFollowUserId(@Param("userid") int userid , @Param("userfollowedid") int userfollowedid);

    //取消关注用户
    void cancelFollowUser(@Param("followuserid") int followuserid);

}