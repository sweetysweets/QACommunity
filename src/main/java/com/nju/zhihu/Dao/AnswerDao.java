package com.nju.zhihu.Dao;

import com.nju.zhihu.Entity.Answer;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Mapper
public interface AnswerDao {

    void addAnswer(@Param("answer")Answer answer);


    //将回答更新信息 写入Updating表里面
    void addAnswerToUpdating(@Param("answer") Answer answer);

    List<Answer> queryAnswerByQuestionId(int questionId);

    //更加userid和content和Content
    Answer queryAnswerIdByUseridAndQuestionid(@Param("userid") int userid ,@Param("questionid") int questionid);

    Answer queryAnswerByAnswerId(int answerId);
    List<Answer> getAnswers();
    void deleteAnswer(@Param("aid") int aid);
    void updateAgainst(@RequestParam("against") int against,@RequestParam("answer_id") int answer_id);
    void updateSupport(@RequestParam("support") int support,@RequestParam("answer_id") int answer_id);

}
