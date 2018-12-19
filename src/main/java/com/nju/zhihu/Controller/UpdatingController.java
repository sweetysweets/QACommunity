package com.nju.zhihu.Controller;

import com.nju.zhihu.Dao.UpdatingDao;
import com.nju.zhihu.Entity.Admin;
import com.nju.zhihu.Entity.Updating;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping(value = "/updating")
public class UpdatingController {
    @Autowired(required = false)
    private UpdatingDao updatingDao;
    @RequestMapping(value = "/getmyrelatedanswer")
    public List<Updating> getMyRelatedAnswer(@RequestParam("userid") int userid){
        List<Updating> ups = updatingDao.getMyRelatedAnswer(userid);
//        for( int i = 0 ; i < ups.size() ; i ++ ){
//            System.out.println(ups.get(i).getUpdatingid());
//        }
        return ups;
    }

    @RequestMapping(value = "/getmyfocususeranswer")
    public List<Updating> getMyFocusUserAnswer(@RequestParam("userid") int userid){
        List<Updating> ups = updatingDao.getMyFocusUserAnswer(userid);
        return ups;
    }

}
