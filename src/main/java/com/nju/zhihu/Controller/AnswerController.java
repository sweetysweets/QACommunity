package com.nju.zhihu.Controller;


import com.nju.zhihu.Dao.AnswerDao;
import com.nju.zhihu.Dao.CommentDao;
import com.nju.zhihu.Entity.Answer;
import com.nju.zhihu.Entity.Comment;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.Writer;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping(value = "/answer")
public class AnswerController {
    @Autowired(required = false)
    private AnswerDao answerDao;
    @ResponseBody
    @RequestMapping(value = "/addAnswer",method = RequestMethod.POST)
    public void addAnswer(@RequestBody String params){
        JSONObject jsonObject = JSONObject.fromObject(params);
        Answer answer = (Answer)JSONObject.toBean(jsonObject,Answer.class);
        answerDao.addAnswer(answer);

    }
    @ResponseBody
    @RequestMapping(value = "/queryAnswer",method = RequestMethod.GET)
    public Answer queryAnswerByAnswerId(@RequestParam("answer_id") int answer_id){
        return answerDao.queryAnswerByAnswerId(answer_id);
    }
    @ResponseBody
    @RequestMapping(value = "/queryAnswers",method = RequestMethod.GET)
    public List<Answer> queryAnswerByQuestionId(@RequestParam("question_id") int questionId){
        List<Answer> answerList = answerDao.queryAnswerByQuestionId(questionId);
        return answerList;
    }
    @RequestMapping(value = "/getAnswers",method = RequestMethod.GET)
    public List<Answer> getAnswers(){
        List<Answer> answerList = answerDao.getAnswers();
        return answerList;
    }
    @RequestMapping(value = "/deleteanswer")
    public void deleteAnswer(@RequestParam("aid") int aid){
        answerDao.deleteAnswer(aid);
    }



}
