package com.nju.zhihu.Controller;

import com.nju.zhihu.Dao.QuestionDao;
import com.nju.zhihu.Entity.Question;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
public class QuestionController {
    @Autowired(required = false)
    QuestionDao questionDao;
    @RequestMapping(value = "/submitquestion")
    public int submitQuestion(@RequestParam("userid") int userid, @RequestParam("title") String title, @RequestParam("content") String content, @RequestParam("time")String time,@RequestParam("state") int state)throws ParseException {
        System.out.println("time"+time);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        Date date = sdf.parse(time);
        Timestamp timestamp = new Timestamp(date.getTime());
        Question question= new Question();
        question.setUid(userid);
        question.setTitle(title);
        question.setContent(content);
        question.setTime(timestamp);
        question.setState(state);
        questionDao.addQuestion(question);
        return 0;

    }}
