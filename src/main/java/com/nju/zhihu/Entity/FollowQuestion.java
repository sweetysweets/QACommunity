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
}
