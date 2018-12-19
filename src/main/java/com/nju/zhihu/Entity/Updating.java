package com.nju.zhihu.Entity;

import java.util.Date;


public class Updating {
    private int updatingid;
    private int type;
    private int uid;//user_id
    private int qid;//question_id
    private int state;
    private int aid;//answer_id
    private int cid;//评论id
    private User user;
    private Question question;
    private Answer answer;
    private Comment comment;

    public Updating() {
    }

    public Updating(int updatingid, int type, int uid, int qid, int state, int aid, int cid, User user, Question question, Answer answer, Comment comment) {
        this.updatingid = updatingid;
        this.type = type;
        this.uid = uid;
        this.qid = qid;
        this.state = state;
        this.aid = aid;
        this.cid = cid;
        this.user = user;
        this.question = question;
        this.answer = answer;
        this.comment = comment;
    }

    public int getUpdatingid() {
        return updatingid;
    }

    public void setUpdatingid(int updatingid) {
        this.updatingid = updatingid;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public int getUid() {
        return uid;
    }

    public void setUid(int uid) {
        this.uid = uid;
    }

    public int getQid() {
        return qid;
    }

    public void setQid(int qid) {
        this.qid = qid;
    }

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
    }

    public int getAid() {
        return aid;
    }

    public void setAid(int aid) {
        this.aid = aid;
    }

    public int getCid() {
        return cid;
    }

    public void setCid(int cid) {
        this.cid = cid;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public Answer getAnswer() {
        return answer;
    }

    public void setAnswer(Answer answer) {
        this.answer = answer;
    }

    public Comment getComment() {
        return comment;
    }

    public void setComment(Comment comment) {
        this.comment = comment;
    }
}
