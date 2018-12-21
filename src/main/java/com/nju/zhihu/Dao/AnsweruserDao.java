package com.nju.zhihu.Dao;

import com.nju.zhihu.Entity.Answeruser;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AnsweruserDao {
    public Answeruser getAnsweruser(int answer_id);
    public List<Answeruser> getAnswerusers(int question_id);

}
