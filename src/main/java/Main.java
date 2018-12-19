import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonParser;
import com.nju.zhihu.Entity.Answer;
import net.sf.json.JSONObject;

public class Main {
    public static void main(String[] args) {
        String string = "{\"answer_id\":500,\"user_id\":500,\"support\":8,\"against\":8,\"state\":1,\"time\":\"2018/12/18 15:32:49\",\"content\":\"测试id和数字002\"}";
        JSONObject jsonObject = JSONObject.fromObject(string);
        Answer answer = (Answer)JSONObject.toBean(jsonObject,Answer.class);


        System.out.println("==========================================");
        System.out.println(string);
        System.out.println(answer.getAnswer_id());
        System.out.println(answer.getUser_id());
        System.out.println(answer.getContent());
        System.out.println(answer.getSupport());
        System.out.println(answer.getAgainst());
        System.out.println(answer.getState());
        System.out.println(answer.getTime());
        System.out.println("===========================================");
    }
}
