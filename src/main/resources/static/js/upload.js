var document_id=new Array();
var username = $.session.get('username');
var cid=$.session.get('cid');
var caseInfoStr = $.session.get("caseInfo");
var caseInfo = JSON.parse(caseInfoStr);
//hide
$(function(){
    $('#userLabel').text(username.substring(0,1)+"法官");
    $('#exist_click').click(function () {
        if(confirm('是否确认退出？'))
        {
            $.session.remove('username');
            window.location.href = '/ecm/login';
        }
    });

    $("#caseNum").text(caseInfo.cNum);
    $("#caseBrief").text("交通肇事罪");
    $("#caseName").text(caseInfo.cname);
    $("#underTaker").text("林法官");
    $("#caseDate").text(caseInfo.fillingDate);
    $("#importCaseId").val(cid);
    $.ajax({
        url:"/ecm/evidence/getContent",
        type:'GET',
        data:{"ajxh":cid},
        success:function (data) {
            for(var i=0;i<data.length;i++){
                loadData(data[i].type,data[i]);

            }
        }
    });





    $("#list_hide").click(
        function(){

            if($("#list_div").width()=="0"){
                $("#list_div").animate({ opacity: "1",width: "45%"}, { duration: 1000});
                $("#graph_div").animate({ width: "45%"}, { duration: 1000});
                $("#list_hide").html("隐藏<<");
            }else{
                $("#list_div").animate({  opacity: "0",width: "0"}, { duration: 1000});
                $("#graph_div").animate({ width: "90%"}, { duration: 1000});
                $("#list_hide").html("显示>>");
            }
        });
    $("#graph_hide").click(
        function(){
            if($("#graph_div").width()=="0"){
                $("#list_div").animate({ opacity: "1",width: "45%"}, { duration: 1000});
                $("#graph_div").animate({ opacity: "1",width: "45%"}, { duration: 1000});
                $("#graph_hide").html("隐藏<<");
            }else{
                $("#graph_div").animate({  opacity: "0",width: "0"}, { duration: 1000});
                $("#list_div").animate({ width: "90%"}, { duration: 1000});
                $("#graph_hide").html("显示>>");
            }
        });

});




function bodyHtml(){
    var bodyHtml="";
    return bodyHtml;
}

function headHtml(){
    var headHtml="";
    return headHtml;
}

function loadData(type,data){
    document_id[type]=data.id;
    if(type==0){
        $("#mystr1").val(data.text);


    }else{
        $("#mystr2").val(data.text);
    }

    var bodylist=data.bodylist;
    console.log(bodylist);
    for(var i=0;i<bodylist.length;i++){
        createHtml(bodylist[i].id,bodylist[i].body,bodylist[i].type,bodylist[i].trust,type);
        createHeadHtml(bodylist[i].id,bodylist[i].headList,type);
    }


}

function createHeadHtml(bodyid,headList,num){
    var html="<div class='headList text-left' bodyid='"+bodyid+"'>";
    for(var j=0;j<headList.length;j++){
        html+="<span headid='"+headList[j].id+"' class='head_chain'><label contenteditable onblur='updateHead(this)' orginal='"+headList[j].head+"' style='font:inherit;min-width: 25px;'>"+headList[j].head+"</label><span headid='"+headList[j].id+"' class='glyphicon glyphicon-remove  headRemove' onclick='deleteHead(this)'></span></span>";
    }

    html+="<span documentid='"+document_id[num]+"' bodyid='"+bodyid+"' class='glyphicon glyphicon-plus headRemove addHead' onclick='addHead(this)'></span>"
    html+="</div>"
    $(".evibody[bodyid='"+bodyid+"']").after(html);

}

function createHtml(id,body,type,trust,num){
    var html="";
    var select="<div class=\"col-md-2\"><select onchange='myUpdateType(this)' value='"+type+"' bodyid='"+id+"' class=\"mySelect form-control\">\n" +
        "    <option value =\"0\">证人证言</option>\n" +
        "    <option value =\"1\">被告人供述和辩解</option>\n" +
        "    <option value=\"2\">书证</option>\n" +
        "    <option value=\"3\">鉴定结论</option>\n" +
        "    <option value=\"4\">勘验、检查笔录</option>\n" +
        "    <option value=\"5\">其他</option>\n" +
        "</select></div>";



    html="<div id='"+id+"' bodyid='"+id+"' class='evibody form-group row'><br><div class='col-md-8'><input type='text' onmousemove='bigTextarea(this)' onmouseout='normalInpt(this)' class='form-control myinfo1' value='"+body+"' bodyid='"+id+"' onchange='myUpdateBody(this)'><a class=\"glyphicon myRemove\n" +
        " glyphicon-remove btn form-control-feedback\"style=\"pointer-events:auto;padding-left: 1%\" bodyid='"+id+"' onclick='bodyRemove(this)'></a>\n" +
        "\n</div>"
    html+=select;

    html+="<div class='col-md-2'><button value="+trust+" class='trustBut btn btn-danger' bodyid='"+id+"' onclick='myUpdateTrust(this)'>不采信</button></div></div>";

    if(num==0){
        // $("#after1").html("");
        $("#after1").append(html);
    }else {
        // $("#after2").html("");
        $("#after2").append(html);
    }
    var options =$(".mySelect[bodyid="+id+"]").find("option[value='"+type+"']");
    options.attr("selected",true);

    var but=$(".trustBut[bodyid="+id+"]");
    if(but.val()==0){
        $(but).removeClass("btn-danger");
        $(but).addClass("btn-success");
        $(but).text("采信");

    }else{
        $(but).removeClass("btn-success");
        $(but).addClass("btn-danger");
        $(but).text("不采信");

    }




}


function   bodyRemove(body){
    var bodyid=$(body).attr("bodyid");
    console.log("bodyid"+bodyid);
    $.ajax({
        url:"/ecm/evidence/deleteBody",
        type:'POST',
        data:{"id":bodyid},
        success:function(data) {
            console.log("delete");
        }
    });

    $(".headList[bodyid='"+bodyid+"']").remove();
    $(".evibody[bodyid='"+bodyid+"']").remove();

}
function loading(num) {
    if(num==1){
        $('#list_div').loading({
            loadingWidth:240,
            title:'请稍等!',
            name:'test',
            discription:'这是一个描述...',
            direction:'row',
            type:'origin',
            originBg:'#71EA71',
            originDivWidth:30,
            originDivHeight:30,
            originWidth:4,
            originHeight:4,
            smallLoading:false,
            titleColor:'#388E7A',
            loadingBg:'#312923',
            loadingMaskBg:'rgba(22,22,22,0.2)',
            mustRelative: true
        });
    }if(num==2){
        $('#graph_div').loading({
            loadingWidth:240,
            title:'请稍等!',
            name:'test',
            discription:'这是一个描述...',
            direction:'row',
            type:'origin',
            originBg:'#71EA71',
            originDivWidth:30,
            originDivHeight:30,
            originWidth:4,
            originHeight:4,
            smallLoading:false,
            titleColor:'#388E7A',
            loadingBg:'#312923',
            loadingMaskBg:'rgba(22,22,22,0.2)',
            mustRelative: true
        });
    }else{

        $('body').loading({
            loadingWidth:240,
            title:'请稍等!',
            name:'test',
            discription:'这是一个描述...',
            direction:'row',
            type:'origin',
            originBg:'#71EA71',
            originDivWidth:30,
            originDivHeight:30,
            originWidth:4,
            originHeight:4,
            smallLoading:false,
            titleColor:'#388E7A',
            loadingBg:'#312923',
            loadingMaskBg:'rgba(22,22,22,0.2)',
            mustRelative: true
        });


    }
    setTimeout(function(){
        removeLoading('test');
    },120000);
}

var trustHtml="";
var temp=new Array(true,true,true,true,true,true,true,true,true,true);

function mySplit(num) {
    str="2,2,3,5,6,6"; //这是一字符串
    if(num==1){
        $("#after1").html(" <br>\n" +
            "                <br>\n" +
            "                <br>");
        str=$("#mystr1").val();
    }else{
        $("#after2").html(" <br>\n" +
            "                <br>\n" +
            "                <br>");
        str=$("#mystr2").val();
    }
    loading(num);
    $.ajax({
        url:"/ecm/evidence/document",
        type:'POST',
        data:{"type":num-1,"ajxh":cid,"text":str},
        success:function(data) {

            console.log(data);
            if (data.length!=0) {
                //分解
                document_id[num - 1] = data[0].document_id;
                for (var i = 0; i < data.length; i++) {
                    //result[i]表示获得第i个json对象即JSONObject
                    //result[i]通过.字段名称即可获得指定字段的值
                    var id = data[i].id;
                    var body = data[i].body;
                    var type = data[i].type;

                    var select = "<div class=\"col-md-2\"><select onchange='myUpdateType(this)' value='" + type + "' bodyid='" + id + "' class=\"mySelect form-control\">\n" +
                        "    <option value =\"0\">证人证言</option>\n" +
                        "    <option value =\"1\">被告人供述和辩解</option>\n" +
                        "    <option value=\"2\">书证</option>\n" +
                        "    <option value=\"3\">鉴定结论</option>\n" +
                        "    <option value=\"4\">勘验、检查笔录</option>\n" +
                        "    <option value=\"5\">其他</option>\n" +
                        "</select></div>";


                    trustHtml = "<div id='" + id + "' bodyid='" + id + "' class='evibody form-group row'><br><div class='col-md-8'><input type='text' onmousemove='bigTextarea(this)' onmouseout='normalInpt(this)'  class='form-control myinfo1' value='" + body + "' bodyid='" + id + "' onchange='myUpdateBody(this)'><a class=\"glyphicon myRemove\n" +
                        " glyphicon-remove btn form-control-feedback\"style=\"pointer-events:auto;padding-left: 1%\" bodyid='" + id + "'  onclick='bodyRemove(this)'></a>\n" +
                        "\n</div>"
                    trustHtml += select;

                    trustHtml += "<div class='col-md-2'><button value=1 class='btn btn-danger' bodyid='" + id + "' onclick='myUpdateTrust(this)'>不采信</button></div></div>";

                    if (num == 1) {
                        // $("#after1").html("");
                        $("#after1").append(trustHtml);

                    } else {
                        // $("#after2").html("");
                        $("#after2").append(trustHtml);
                    }
                    var options = $(".mySelect[bodyid=" + id + "]").find("option[value='" + type + "']");

                    options.attr("selected", true);


                }
            }

            removeLoading('test');

        }
    });
}



function myHead(num) {
    var html="";
    loading(num);
    $.ajax({
        url:"/ecm/evidence/createHead",
        type:'POST',
        data:{"ajxh":cid,"head":"","document_id":document_id[num-1]},
        success:function(data) {

            for(var i=0;i<data.length;i++){

                var bodyid=data[i].id;

                var headList=data[i].headList;
//                    html="<div class='headList text-left' bodyid='"+bodyid+"'>";
//                    for(var j=0;j<headList.length;j++){
//                        console.log(headList[j].id);
//                        html+="<span headid='"+headList[j].id+"' class='head_chain'><label contenteditable orginal='"+headList[j].head+"' onblur='updateHead(this)' style='min-width: 25px;'>"+headList[j].head+"</label><span headid='"+headList[j].id+"' class='glyphicon glyphicon-remove headRemove'  onclick='deleteHead(this)></span></span>";
//                    }
//
//                    html+="<span documentid='"+document_id[num-1]+"' bodyid='"+bodyid+"' class='glyphicon glyphicon-plus headRemove addHead' onclick='addHead(this)'></span>"
//                    html+="</div>"
//
//                    console.log(  $(".headList[bodyid='"+bodyid+"']"));
                $(".headList[bodyid='"+bodyid+"']").remove();

                //$(".evibody[bodyid='"+bodyid+"']").after(html);


                createHeadHtml(bodyid,headList,num-1)

            }
            removeLoading('test');
        }
    });
}

function addHead(span) {
    var document_id=$(span).attr("documentid");
    var bodyid=$(span).attr("bodyid");
    $.ajax({
        url:"/ecm/evidence/addHead",
        type:'POST',
        data:{"ajxh":cid,"head":"","document_id":document_id,"body_id":bodyid},
        success:function(data) {
            console.log(data);
            var id=data.id;
            var  html="<span headid='"+id+"' class='head_chain'><label contenteditable onblur='updateHead(this)' orginal='' style='font:inherit;min-width: 25px;'></label><span headid='"+id+"' class='glyphicon glyphicon-remove  headRemove' onclick='deleteHead(this)'></span></span>";
            $(span).before(html);

        }
    });
}



function updateHead(lablel) {
    var orginal=$(lablel).attr("orginal");
    var head=$(lablel).text();
    var id=$(lablel).parent().attr("headid");
    if(orginal!=head){

        $.ajax({
            url:"/ecm/evidence/updateHead",
            type:'POST',
            data:{"head":head,"id":id},
            success:function(data) {
                console.log("update ok");
                $(lablel).attr("orginal",head);
            }
        });

    }
}

function myDelete(num) {
    if(num==1){
        $("#after1").html(" <br>\n" +
            "                <br>\n" +
            "                <br>");
        $("#mystr1").val('');
    }else{
        $("#after2").html(" <br>\n" +
            "                <br>\n" +
            "                <br>");
        $("#mystr2").val('');
    }
}

//新增
function myAdd(num) {
    $.ajax({
        url:"/ecm/evidence/addBody",
        type:'POST',
        data:{"ajxh":cid,"type":5,"body":"","document_id":document_id[num-1]},
        success:function(data) {
            console.log(data);
            var id=data.id;
            var html="";


            var select="<div class=\"col-md-2\"><select onchange='myUpdateType(this)' value='"+5+"' bodyid='"+id+"' class=\"mySelect form-control\">\n" +
                "    <option value =\"0\">证人证言</option>\n" +
                "    <option value =\"1\">被告人供述和辩解</option>\n" +
                "    <option value=\"2\">书证</option>\n" +
                "    <option value=\"3\">鉴定结论</option>\n" +
                "    <option value=\"4\">勘验、检查笔录</option>\n" +
                "    <option value=\"5\">其他</option>\n" +
                "</select></div>";



            html="<div id='"+id+"' bodyid='"+id+"' class='evibody form-group row'><br><div class='col-md-8'><input type='text' onmousemove='bigTextarea(this)' onmouseout='normalInpt(this)' class='form-control myinfo1' value='"+""+"' bodyid='"+id+"' onchange='myUpdateBody(this)'><a class=\"glyphicon myRemove\n" +
                " glyphicon-remove btn form-control-feedback\"style=\"pointer-events:auto;padding-left: 1%\" bodyid='"+id+"'  onclick='bodyRemove(this)'></a>\n" +
                "\n</div>"
            html+=select;

            html+="<div class='col-md-2'><button value=1 class='btn btn-danger' bodyid='"+id+"' onclick='myUpdateTrust(this)'>不采信</button></div></div>";
            if(num==1){
                $("#after1").append(html);
            }else{
                $("#after2").append(html);
            }
            var options =$(".mySelect[bodyid="+id+"]").val(5);

            options.attr("selected",true);


        }
    });

}


function myUpdateBody(input) {

    var id = $(input).attr("bodyid"); //对应id
    var body=$(input).val();
    $.ajax({
        url:"/ecm/evidence/updateBodyById",
        type:'POST',
        data:{"body":body,"id":id},
        success:function(data) {
            console.log(data);
        }
    });

}

function myUpdateType(select) {

    var id = $(select).attr("bodyid"); //对应id
    var type=$(select).val();

    $.ajax({
        url:"/ecm/evidence/updateTypeById",
        type:'POST',
        data:{"type":type,"id":id},
        success:function(data) {
            console.log(data);
        }
    });

}

function myUpdateTrust(select) {

    var trust=1;
    console.log($(select).val());
    if($(select).val()==0){
        $(select).removeClass("btn-success");
        $(select).addClass("btn-danger");
        $(select).text("不采信");
        $(select).val(1);
        trust=1;
    }else{
        $(select).removeClass("btn-danger");
        $(select).addClass("btn-success");
        $(select).text("采信");
        $(select).val(0);
        trust=0;
    }
    var id = $(select).attr("bodyid"); //对应id

    console.log(id);console.log(trust);
    $.ajax({
        url:"/ecm/evidence/updateTrustById",
        type:'POST',
        data:{"trust":trust,"id":id},
        success:function(data) {

        }
    });
}




function deleteHead(remove){
    var id=$(remove).attr("headid");
    console.log("headid"+id);
    $.ajax({
        url:"/ecm/evidence/deleteHead",
        type:'POST',
        data:{"id":id},
        success:function(data) {
            console.log("delete");
        }
    });
    $(".head_chain[headid='"+id+"']").remove();
}




function uploadExcel(){


    loading(3);

    $('#excelForm').submit(      //ajax方式提交表单
        {
            url: '/ecm/evidence/importExcel',
            type: 'post',
            beforeSubmit: function () {},
            success: function (data) {
                removeLoading('test');
                console.log(data);
            }
        });
    // var targetUrl =$('#excelForm').attr("action");
    // var data = new FormData($('#excelForm')[0]);
    // $.ajax({
    //     type:'post',
    //     url:targetUrl,
    //     cache: false,    //上传文件不需缓存
    //     processData: false, //需设置为false。因为data值是FormData对象，不需要对数据做处理
    //     contentType: false, //需设置为false。因为是FormData对象，且已经声明了属性enctype="multipart/form-data"
    //     data:data,
    //     dataType:'json',
    //     success:function(data){
    //         alert(data);
    //     },
    //     error:function(){
    //         alert("请求失败")
    //     }
    // })
}


function bigTextarea(input){
    var html="<textarea type='text' onmousemove='bigTextarea(this)' onmouseout='normalInpt(this)'  class='form-control myinfo1' value='\" + body + \"' bodyid='\" + id + \"' onchange='myUpdateBody(this)'>";

    console.log("large");

}
function normalInpt(textarea){
    console.log("small");
}