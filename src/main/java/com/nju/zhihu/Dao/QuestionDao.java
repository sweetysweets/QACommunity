package com.nju.zhihu.Dao;

import com.nju.zhihu.Entity.Question;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.sql.Timestamp;

import java.util.List;

@Mapper
public interface QuestionDao {
    void deleteQuestionById(@Param("id") int id);
    Question queryQuestionById(@Param("id") int id);

    void addQuestion(@Param("question")Question question);
    List <Question> getMyFocusUserQuestion (@Param("userid") int userid);
    List <Question> getMyFocusQuestion(@Param("userid") int userid);
    List <Question> getAllQuestions (@Param("userid") int userid);

    List <Question> getMyFocus(@Param("userid") int userid);
    List<Question> getAllQuestion();

}
