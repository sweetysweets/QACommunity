package com.nju.zhihu.Dao;

import com.nju.zhihu.Entity.FollowQuestion;
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
    Question getQuestionById(@Param("qid") int qid);


    List<Question> getAllMyFollowQuestions(@Param("userid") int userid);

    //插入关注问题记录
    void insertFollowQuestion(@Param("userid") int userid , @Param("questionfollowedid") int questionid);

    //查询关注问题的记录的followquestionid
    FollowQuestion getFollowQuestionId(@Param("userid") int userid , @Param("questionid") int questionid);

    //取消关注
    void cancelFollowQuestion(@Param("followquestionid") int followquestionid);

    void updateQuestion(@Param("qid") int qid,@Param("qstate") int qstate);

}
