package com.nju.zhihu.Controller;

import com.nju.zhihu.Dao.AdminDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.nju.zhihu.Entity.*;
@RestController
@RequestMapping(value = "/admin")
public class AdminController {
    @Autowired(required = false)
    private AdminDao adminDao;
    @RequestMapping(value = "/login")
    public int getLogin(@RequestParam("aid")String aid,@RequestParam("password")String password){
        int id = Integer.parseInt(aid);
        Admin admin = adminDao.getUserById(id);
        if (admin == null) {
            return 2;
        }else{
            String pass = admin.getPassword();
            if (pass.equals(password)){
                return 0;
            }else {
                return 1;
            }
        }
    }
    @RequestMapping(value = "/deletequestion")
    public int deleteQuestion(@RequestParam("qid")String qid){
        return 0;
    }
}
