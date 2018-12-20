package com.nju.zhihu.Dao;

import com.nju.zhihu.Entity.Answeruser;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AnsweruserDao {
    public Answeruser getAnsweruser(int answer_id);

}
