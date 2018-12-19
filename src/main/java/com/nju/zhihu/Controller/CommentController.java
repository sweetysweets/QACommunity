package com.nju.zhihu.Controller;

import com.nju.zhihu.Dao.AdminDao;
import com.nju.zhihu.Dao.CommentDao;
import com.nju.zhihu.Entity.Admin;
import com.nju.zhihu.Entity.Comment;
import com.nju.zhihu.Entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;


@RestController
@RequestMapping(value = "/comment")
public class CommentController {

    @Autowired(required = false)
    private CommentDao commentDao;

    @RequestMapping("/addComment")
    public void addComment(@RequestParam("user_id")int user_id, @RequestParam("answer_id")int answer_id, @RequestParam("reply_id")int reply_id,@RequestParam("content")String content){
        Comment comment = new Comment();
        comment.setAnswer_id(answer_id);
        comment.setContent(content);
        comment.setReply_id(reply_id);
        comment.setUser_id(user_id);
        comment.setTime(new Date());
        commentDao.addComment(comment);

    }



    @RequestMapping("/getCommentList")
    public List<Comment> getCommentList(@RequestParam("answer_id")int answer_id){
        return commentDao.getCommentListByAnswerId(answer_id);
    }

    @RequestMapping("/getReplyList")
    public List<Comment> getReplyList(@RequestParam("comment_id")int comment_id){
        return commentDao.getReplyListByCommentId(comment_id);
    }


    @RequestMapping("/deleteComment")
    public void deleteComment(@RequestParam("id")int id){
        commentDao.deleteCommentById(id);
    }









}
