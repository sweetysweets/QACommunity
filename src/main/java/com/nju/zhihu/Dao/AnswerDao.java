package com.nju.zhihu.Dao;

import com.nju.zhihu.Entity.Answer;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AnswerDao {

    void addAnswer(@Param("answer")Answer answer);
    List<Answer> queryAnswerByQuestionId(int questionId);
    Answer queryAnswerByAnswerId(int answerId);
    List<Answer> getAnswers();
    void deleteAnswer(@Param("aid") int aid);
}
