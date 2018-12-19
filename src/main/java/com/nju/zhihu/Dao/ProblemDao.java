package com.nju.zhihu.Dao;

import com.nju.zhihu.Entity.Problem;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;


@Mapper//加上该注解才能使用@MapperScan扫描到
public interface ProblemDao {
    //查询该用户关注的用户
    List<Problem> getProblemByUserid(@Param("id") String token);

}