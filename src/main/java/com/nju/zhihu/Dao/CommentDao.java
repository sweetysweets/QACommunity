package com.nju.zhihu.Dao;

import com.nju.zhihu.Entity.Comment;
import com.nju.zhihu.Entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;


@Mapper//加上该注解才能使用@MapperScan扫描到
public interface CommentDao {

    void addComment(@Param("comment") Comment comment);
    List<Comment> getCommentListByAnswerId(@Param("answer_id")int answer_id, @Param("start")int start, @Param("pagesize")int pagesize);
    void deleteCommentById(@Param("id") int id);

}