package com.nju.zhihu.Dao;

import com.nju.zhihu.Entity.Admin;
import com.nju.zhihu.Entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;


@Mapper//加上该注解才能使用@MapperScan扫描到
public interface UserDao {

    void addUser(@Param("user") User user);
    User getUserById(@Param("id") String token);


}