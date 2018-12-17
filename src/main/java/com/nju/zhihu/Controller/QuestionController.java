package com.nju.zhihu.Controller;

import com.nju.zhihu.Dao.QuestionDao;
import com.nju.zhihu.Dao.UserDao;
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
import java.util.List;

@RestController
public class QuestionController {
    @Autowired(required = false)
    QuestionDao questionDao;
    UserDao userDao;
    @RequestMapping(value = "/submitquestion")
    public int submitQuestion(@RequestParam("userid") int userid, @RequestParam("title") String title, @RequestParam("content") String content,@RequestParam("state") int state)throws ParseException {
        Date date = new Date(System.currentTimeMillis()+14*60*60*1000);
        Timestamp timestamp = new Timestamp(date.getTime());
        System.out.println("time:"+timestamp);
        Question question= new Question();
        question.setUid(userid);
        question.setTitle(title);
        question.setContent(content);
        question.setTime(timestamp);
        question.setState(state);
        questionDao.addQuestion(question);
        return 0;

    }

    @RequestMapping(value = "/getmyfocus")
    public List<Question> getMyFocus(@RequestParam("userid") int userid){
        return questionDao.getMyFocus(userid);
    }
}
