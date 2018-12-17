package com.nju.zhihu.Entity;

import java.sql.Timestamp;

public class Question {
    private int qid;
    private int uid;
    private String title;
    private String content;
    private Timestamp time;
    private int state;
//    private String user_avater;
//    private String user_name;

    public void setQid(int qid) {
        this.qid = qid;
    }

    public int getQid() {
        return qid;
    }

    public void setUid(int uid) {
        this.uid = uid;
    }

    public int getUid() {
        return uid;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTitle() {
        return title;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getContent(){return content; }

    public void setTime(Timestamp time) {
        this.time = time;
    }

    public Timestamp getTime() {
        return time;
    }

    public void setState(int state) {
        this.state = state;
    }

    public int getState() {
        return state;
    }

//    public void setUser_avater(String user_avater){
//        this.user_avater = user_avater ;
//    }
//
//    public String getUser_avater(){
//        return user_avater;
//    }
//
//    public void setUser_name(String user_name) {
//        this.user_name = user_name;
//    }
//
//    public String getUser_name() {
//        return user_name;
//    }
}
