package com.nju.zhihu.Entity;

public class FollowQuestion {

    private int fqid;
    private int userid;
    private int questionfollowedid;

    public FollowQuestion() {
    }

    public FollowQuestion(int fqid, int userid, int questionfollowedid) {
        this.fqid = fqid;
        this.userid = userid;
        this.questionfollowedid = questionfollowedid;
    }

    public int getFqid() {
        return fqid;
    }

    public void setFqid(int fqid) {
        this.fqid = fqid;
    }

    public int getUserid() {
        return userid;
    }

    public void setUserid(int userid) {
        this.userid = userid;
    }

    public int getQuestionfollowedid() {
        return questionfollowedid;
    }

    public void setQuestionfollowedid(int questionfollowedid) {
        this.questionfollowedid = questionfollowedid;
    }
//    int follow_question_id;
//    int user_id;
//    int question_followed_id;
//
//    public int getFollow_question_id() {
//        return follow_question_id;
//    }
//
//    public void setFollow_question_id(int follow_question_id) {
//        this.follow_question_id = follow_question_id;
//    }
//
//    public int getUser_id() {
//        return user_id;
//    }
//
//    public void setUser_id(int user_id) {
//        this.user_id = user_id;
//    }
//
//    public int getQuestion_followed_id() {
//        return question_followed_id;
//    }
//
//    public void setQuestion_followed_id(int question_followed_id) {
//        this.question_followed_id = question_followed_id;
//
//    }
}
