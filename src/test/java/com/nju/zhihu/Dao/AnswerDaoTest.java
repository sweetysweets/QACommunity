package com.nju.zhihu.Dao;

import com.nju.zhihu.Entity.Answer;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Date;

import static org.junit.Assert.*;
@RunWith(SpringRunner.class)
@SpringBootTest
public class AnswerDaoTest {
    @Autowired
    private AnswerDao answerDao;
    @Test
    public void addAnswer() {
        Answer answer = new Answer();
        answer.setAnswer_id(8);
        answer.setUser_id(2);
        answer.setContent("测试时间SpringBoot");
        answer.setSupport(44);
        answer.setAgainst(66);
        answer.setState(1);
        answer.setTime(new Date());
        answerDao.addAnswer(answer);
        Answer answer1 = answerDao.queryAnswerByAnswerId(7);
        System.out.println(answer1.getContent());
    }

    @Test
    @Ignore
    public void queryAnswerByQuestionId() {

    }

    @Test
    public void queryAnswerByAnswerId() {
        Answer answer = answerDao.queryAnswerByAnswerId(0);
        System.out.println("====================");
        System.out.println(answer.getSupport());
        System.out.println(answer.getContent());
        System.out.println("====================");
        assertEquals(15,answer.getSupport());
    }
}