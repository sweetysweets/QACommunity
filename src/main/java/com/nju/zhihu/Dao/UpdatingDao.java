package com.nju.zhihu.Dao;

import com.nju.zhihu.Entity.Admin;
import com.nju.zhihu.Entity.Answer;
import com.nju.zhihu.Entity.Updating;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;


@Mapper//加上该注解才能使用@MapperScan扫描到
public interface UpdatingDao {

    Admin getUserById(@Param("id") int id);
    List<Updating> getMyRelatedAnswer (@Param("userid") int userid);
    List<Updating> getMyFocusUserAnswer (@Param("userid") int userid);

    //将回答更新信息 写入Updating表里面
    void addAnswerToUpdating(@Param("answer1") Answer answer1);

//    int updateUser(@Param("user") Admin user);
//
//    int insertUser(@Param("user") Admin user);
//
//    int deleteUserById(@Param("id") int id);
}