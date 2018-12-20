package com.nju.zhihu.Controller;

import com.nju.zhihu.Dao.AnswerDao;
import com.nju.zhihu.Dao.AnsweruserDao;
import com.nju.zhihu.Entity.Answeruser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/answeruser")
public class AnsweruserController {
    @Autowired(required = false)
    private AnsweruserDao answeruserDao;
    @ResponseBody
    @RequestMapping(value = "/getansweruser",method = RequestMethod.GET)
    public Answeruser getAnsweruser(@RequestParam("answer_id") int answer_id){
        return answeruserDao.getAnsweruser(answer_id);
    }
}
