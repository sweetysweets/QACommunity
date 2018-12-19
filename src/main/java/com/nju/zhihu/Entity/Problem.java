package com.nju.zhihu.Entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.TimeZone;
import java.util.Date;

public class Problem {
    //提问用户ID
    private int uid;
    //问题ID
    private int qid;
    //提出问题用户头像
    private String avater;
    //问题标题
    private String title;
    //问题内容
    private String content;
    //提问时间
    private Date createTime;

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

    public String getAvater() {
        return avater;
    }

    public void setAvater(String avater) {
        this.avater = avater;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @JsonFormat(pattern="yyyy-MM-dd HH:mm",timezone = "GMT+8")
    public java.util.Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
