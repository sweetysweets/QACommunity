package com.nju.zhihu.Controller;


import com.nju.zhihu.Dao.AnswerDao;
import com.nju.zhihu.Dao.CommentDao;
import com.nju.zhihu.Dao.UpdatingDao;
import com.nju.zhihu.Entity.Answer;
import com.nju.zhihu.Entity.Comment;
import com.nju.zhihu.Entity.Updating;
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
    private UpdatingDao updatingDao;
    @ResponseBody
    @RequestMapping(value = "/addAnswer",method = RequestMethod.POST)
    public void addAnswer(@RequestBody String params ){
        JSONObject jsonObject = JSONObject.fromObject(params);
        Answer answer = (Answer)JSONObject.toBean(jsonObject,Answer.class);
        System.out.println(answer);
        System.out.println("answer的question_id是："+answer.getQuestion_id());
        //先写入answer表
        answerDao.addAnswer(answer);
//        System.out.println("daaaaaaaaaaaaaaaaaaaaaaaaaa");
        //再写入updating表


        Answer answer1 = answerDao.queryAnswerIdByUseridAndQuestionid(answer.getUser_id(),answer.getQuestion_id());
        System.out.println("answer1的Answer_id:"+answer1.getAnswer_id());
//        answer1.setState(0);
//        answer1.setAgainst(0);
//        answer1.setSupport(0);
//        answer1.geQ
//        answerDao.addAnswerToUpdating(answer1);
        System.out.println(answer1.getUser_id());
        System.out.println(answer1.getQuestion_id());
        System.out.println(answer1.getAnswer_id());
        answer1.setQuestion_id(answer.getQuestion_id());
        updatingDao.addAnswerToUpdating(answer1);
//        System.out.println("fafaffffffffffffffffffffffff");
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
    @RequestMapping(value = "/updateSupport",method = RequestMethod.GET)
    public void updateSupport(@RequestParam("support") int support,@RequestParam("answer_id") int answer_id){
        answerDao.updateSupport(support,answer_id);
    }

    @RequestMapping(value = "/updateAgainst",method = RequestMethod.GET)
    public void updateAgainst(@RequestParam("against") int against,@RequestParam("answer_id") int answer_id){
        System.out.println(answer_id);
        System.out.println(against);
        answerDao.updateAgainst(against,answer_id);
    }

    @RequestMapping(value = "/deleteanswer")
    public void deleteAnswer(@RequestParam("aid") int aid){
        answerDao.deleteAnswer(aid);
    }


    public void setUpdatingDao(UpdatingDao updatingDao) {
        this.updatingDao = updatingDao;
    }
}
