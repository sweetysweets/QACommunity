package com.nju.zhihu.Dao;

import com.nju.zhihu.Entity.Question;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.sql.Timestamp;

@Mapper
public interface QuestionDao {
    void deleteQuestionById(@Param("id") int id);
    void addQuestion(@Param("question")Question question);

}
