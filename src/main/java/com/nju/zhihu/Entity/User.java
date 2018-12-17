package com.nju.zhihu.Entity;

import java.util.List;

public class User {

    private int id;

    private String name;

    private String avater;

    private String token;

    //我提出的问题
    private List<Answer> myQuestions;
    //我关注的问题
    private List<Answer> focusQustions;
    //我回答的问题
    private List<Question> myAnswers;
    //我关注的问题
    private List<Question> focusAnswers;


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAvater() {
        return avater;
    }

    public void setAvater(String avater) {
        this.avater = avater;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public List<Answer> getMyQuestions() {
        return myQuestions;
    }

    public void setMyQuestions(List<Answer> myQuestions) {
        this.myQuestions = myQuestions;
    }

    public List<Answer> getFocusQustions() {
        return focusQustions;
    }

    public void setFocusQustions(List<Answer> focusQustions) {
        this.focusQustions = focusQustions;
    }

    public List<Question> getMyAnswers() {
        return myAnswers;
    }

    public void setMyAnswers(List<Question> myAnswers) {
        this.myAnswers = myAnswers;
    }

    public List<Question> getFocusAnswers() {
        return focusAnswers;
    }

    public void setFocusAnswers(List<Question> focusAnswers) {
        this.focusAnswers = focusAnswers;
    }
}
