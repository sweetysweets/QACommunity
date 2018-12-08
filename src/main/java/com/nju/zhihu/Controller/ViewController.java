package com.nju.zhihu.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ViewController {


    @RequestMapping(value = "/index")
    public String getIndexView() {
        return "index";
    }

    @RequestMapping("/")
    public String index() {
        return "redirect:/index";
    }
}
