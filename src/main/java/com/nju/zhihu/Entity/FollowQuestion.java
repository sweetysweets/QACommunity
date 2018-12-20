package com.nju.zhihu.Entity;

public class FollowQuestion {
    int follow_question_id;
    int user_id;
    int question_followed_id;

    public int getFollow_question_id() {
        return follow_question_id;
    }

    public void setFollow_question_id(int follow_question_id) {
        this.follow_question_id = follow_question_id;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public int getQuestion_followed_id() {
        return question_followed_id;
    }

    public void setQuestion_followed_id(int question_followed_id) {
        this.question_followed_id = question_followed_id;
    }
}
