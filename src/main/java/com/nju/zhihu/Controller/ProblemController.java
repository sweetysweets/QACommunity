package com.nju.zhihu.Controller;

import com.nju.zhihu.Dao.ProblemDao;
import com.nju.zhihu.Entity.Problem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/user")
public class ProblemController {
    @Autowired(required = false)
    private ProblemDao problemDao;
    @RequestMapping(value = "/focus_problems")
    public Map<String,Object> listUser(@RequestParam("userid") String userid) {
        Map<String,Object> userMap = new HashMap<String,Object>();
        List<Problem> problem = problemDao.getProblemByUserid(userid);
        userMap.put("problemList",problem);
        return userMap;
    }
}
