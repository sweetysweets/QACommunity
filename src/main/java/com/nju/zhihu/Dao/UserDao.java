package com.nju.zhihu.Dao;

import com.nju.zhihu.Entity.Admin;
import com.nju.zhihu.Entity.User;
import com.nju.zhihu.Entity.Question;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;


@Mapper//加上该注解才能使用@MapperScan扫描到
public interface UserDao {

    void addUser(@Param("user") User user);
    User getUserById(@Param("id") String token);

    //查询该用户关注的用户
    List<User> getFollowUserById(@Param("id") String token);


    List<Question> getQuestionByUserId(@Param("id") String token );

}