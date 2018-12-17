package com.nju.zhihu.Dao;

import com.nju.zhihu.Entity.Question;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface QuestionDao {
    void deleteQuestionById(@Param("id") int id);
    Question queryQuestionById(@Param("id") int id);
    void addQuestionByid(@Param("id") int id);
}
