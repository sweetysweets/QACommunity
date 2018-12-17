package com.nju.zhihu.Entity;

import java.sql.Timestamp;

public class Answer {
    private int answerid ;
    private int uid;
    private String content;
    private int support;
    private int against;
    private int state ;
    private Timestamp time;

    //无参构造函数
    public Answer(){

    }
    public Answer(int answerid, int uid, String content, int support, int against, int state, Timestamp time) {
        this.answerid = answerid;
        this.uid = uid;
        this.content = content;
        this.support = support;
        this.against = against;
        this.state = state;
        this.time = time;
    }

    public int getAnswerid() {
        return answerid;
    }

    public void setAnswerid(int answerid) {
        this.answerid = answerid;
    }

    public int getUid() {
        return uid;
    }

    public void setUid(int uid) {
        this.uid = uid;
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

    public Timestamp getTime() {
        return time;
    }

    public void setTime(Timestamp time) {
        this.time = time;
    }
}
