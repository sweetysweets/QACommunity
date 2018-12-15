package com.nju.zhihu.Dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface QuestionDao {
    void deleteQuestionById(@Param("id") int id);
}
