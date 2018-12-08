package com.nju.zhihu.Dao;

import com.nju.zhihu.Entity.Admin;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;


@Mapper//加上该注解才能使用@MapperScan扫描到
public interface AdminDao {

    Admin getUserById(@Param("id") int id);

//    int updateUser(@Param("user") Admin user);
//
//    int insertUser(@Param("user") Admin user);
//
//    int deleteUserById(@Param("id") int id);
}