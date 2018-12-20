package com.nju.zhihu.Controller;

import com.nju.zhihu.Dao.AnswerDao;
import com.nju.zhihu.Dao.QuestionDao;
import com.nju.zhihu.Dao.UserDao;
import com.nju.zhihu.Entity.Answer;
import com.nju.zhihu.Entity.FollowQuestion;
import com.nju.zhihu.Entity.Question;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
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
    private  QuestionDao questionDao;
    @Autowired(required = false)
    private  AnswerDao answerDao;
    @Autowired(required = false)
    private UserDao userDao;
    @RequestMapping(value = "/submitquestion")
    public int submitQuestion(@RequestParam("userid") int userid, @RequestParam("title") String title, @RequestParam("content") String content,@RequestParam("state") int state)throws ParseException {
        Date date = new Date(System.currentTimeMillis());
        Timestamp timestamp = new Timestamp(date.getTime());

//        Date timedate = new Date();

//        System.out.println("time:"+timestamp);
        Question question= new Question();
        question.setUid(userid);
        question.setTitle(title);
        question.setContent(content);
        question.setTime(timestamp);
        question.setState(state);
        questionDao.addQuestion(question);
        return 0;

    }
    @RequestMapping(value = "/getallquestion")
    public List<Question> getAllQuestion() {
        List<Question> questions = questionDao.getAllQuestion();
        return questionDao.getAllQuestion();
    }

    @RequestMapping(value = "/getmyfocususerquestion")
    public List<Question> getMyFocusUserQuestion(@RequestParam("userid") int userid){
        return questionDao.getMyFocusUserQuestion(userid);
    }

    @RequestMapping(value = "/getmyfocusquestion")
    public List<Question> getMyFocusQuestion(@RequestParam("userid") int userid){
        return questionDao.getMyFocusQuestion(userid);
    }


    @RequestMapping(value = "/getallquestions")
    public List<Question> getAllQuestions(@RequestParam("userid") int userid){
        return questionDao.getAllQuestions(userid);

    }
    @RequestMapping(value = "/getquestiondetail")
        public JSONObject getQuestionDetail(@RequestParam("qid") int questionId){
        JSONObject jsonObject = new JSONObject();
        Question question = questionDao.getQuestionById(questionId);
        System.out.println(question.getQid());
        List<Answer> answerList = answerDao.queryAnswerByQuestionId(questionId);
        jsonObject.put("qid",question.getQid());
        jsonObject.put("state",question.getState());
        jsonObject.put("answerList",answerList);
        return  jsonObject;
    }
    @RequestMapping(value = "/getmyfocus")
    public List<Question> getMyFocus(@RequestParam("userid") int userid){
        return questionDao.getMyFocus(userid);
    }

    //查看我关注的问题列表，方便前端判断关注状态显示，这个功能其实可以用我之前写的getMyFocusQuestion，这里直接调用一些
    @RequestMapping(value = "/getallmyfollowquestions")
    public List<Question> getAllMyFollowQuestions(@RequestParam("userid") int userid){
        return questionDao.getMyFocusQuestion(userid);
    }

    //关注该问题，插入数据
    @RequestMapping(value = "/followquestion")
    public int followQuestion(@RequestParam("userid") int userid , @RequestParam("questionid")int questionid){
        questionDao.insertFollowQuestion(userid,questionid);
        return 0;
    }

    //取消关注该问题，删除数据
    @RequestMapping(value = "/cancelfollowquestion")
    public int cancelFollowQuestion(@RequestParam("userid") int userid , @RequestParam("questionid") int questionid){
        FollowQuestion fq = questionDao.getFollowQuestionId(userid,questionid);
        System.out.println(fq.getFqid());

        questionDao.cancelFollowQuestion(fq.getFqid());

        return 0;
    }
}
