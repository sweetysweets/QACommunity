package com.nju.zhihu.Entity;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public class Answer{
    int answer_id;
    int user_id;
    String content;
    int support;
    int against;
    int state;


    Date time;

    int question_id;

    public int getAnswer_id() {
        return answer_id;
    }

    public void setAnswer_id(int answer_id) {
        this.answer_id = answer_id;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getSupport() {
        return support;
    }

    public void setSupport(int support) {
        this.support = support;
    }

    public int getAgainst() {
        return against;
    }

    public void setAgainst(int against) {
        this.against = against;
    }

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
    }
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm",timezone = "GMT+8")
    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public int getQuestion_id() {
        return question_id;
    }

    public void setQuestion_id(int question_id) {
        this.question_id = question_id;
    }
}