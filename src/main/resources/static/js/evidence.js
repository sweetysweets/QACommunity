var textID = -1;
// var factList_div = {};
var divIndex1 = 0;
var divIndex2 = 0;
$(function(){
    var dom = document.getElementById ('canvasDiv');
    dom.oncontextmenu = function (){
        return false;
    }

    var caseInfoStr = $.session.get("caseInfo");
    var caseInfo = JSON.parse(caseInfoStr);
    $("#caseNum").text(caseInfo.cNum);
    // $("#caseBrief").text(caseInfo['']);
    $("#caseBrief").text("交通肇事罪");
    $("#caseName").text(caseInfo.cname);
    $("#underTaker").text("林法官");
    $("#caseDate").text(caseInfo.fillingDate);

    initEvidences();
    $('#addToAcceptance').click(function () {
        var checkboxs = $('#recycleBin').find('.checkbox');
        $('body').loading({
            loadingWidth:240,
            title:'请稍候...',
            name:'updateBodyTrust',
            animateIn:'none',
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
        for(var i = 0;i<checkboxs.length;i++){
            var checkbox = $(checkboxs[i]).find('input');
            // console.log(checkbox.is(':checked'));
            if(checkbox.is(':checked')){
                var bid = $(checkboxs[i]).attr("data-bodyID");
                updateBodyTrust(bid);
            }
        }
        $('#recycleBin').modal('hide');
        removeLoading('updateBodyTrust');
    });
});

function initEvidences() {

    $.ajax({
        type: "post",
        url: "/ecm/model/getEvidences",
        data:{"cid":cid},
        async: false,
        success: function (data) {
            // alert(data['trusts'][1]['body']['body']);
            initGraph(data['trusts'],data['freeHeaders'],data['facts'],data['freeJoints'],data['arrows']);
            initRejection(data['untrusts']);
            if(data['factDoc']!=null){
                textID = data['factDoc']['id'];
                initFactsDiv(data['factDoc']['text'],data['facts']);
            }
            initSketch(data['sketch']);
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    });
}

//初始化未采信列表
function initRejection(evidences) {
    var content = "";
    var binContent = "";

    for(var i = 0;i<evidences.length;i++){
        var evidenceTemp = evidences[i]['body'];
        var classTemp = "evidence evidence_splitLine";
        var idTemp = "heads_chain_";
        if(evidenceTemp['isDefendant']==0)//原告
            classTemp += " evidence_plaintiff";

        content+="<div class=\""+classTemp+"\" data-id='"+evidenceTemp['id']+"'>" +
            "                            <a data-toggle=\"collapse\" href=\"#"+idTemp+evidenceTemp['id']+"\" class=\"evidence_a\">\n" +
            evidenceTemp['body']+"</a>" +
            "                            <div id=\""+idTemp+evidenceTemp['id']+"\" class=\"panel-collapse collapse in\">\n" +
            "                                <div class=\"head_div\">";

        binContent += "<div class='checkbox' data-bodyID='"+evidenceTemp['id']+"'><label>" +
            "<input type=\"checkbox\">" + evidenceTemp['body'] +
            "</label></div>";

        for(var j = 0;j<evidences[i]['headers'].length;j++){
            content+="<span class=\"head_chain\">"+evidences[i]['headers'][j]['head']+"</span>";
        }
        content+="</div></div></div>";
    }
    $("#rejection").find(".panel-body").html(content);
    $("#recycleBin_body").html(binContent);
}

//更新单个链体采信
function updateBodyTrust(bid) {

    $.ajax({
        type: "post",
        url: "/ecm/model/updateBodyTrust",
        data: {"bid":bid},
        // dataType:"json",
        // contentType: "application/json; charset=utf-8",
        async: true,
        // beforeSend: function(data){
        //     //这里判断，如果没有加载数据，会显示loading
        //     if(data.readyState == 0){
        //         loading("正在保存链体");
        //     }
        // },
        success: function (data) {
            addToAcceptance(bid);
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            // alert("save body");
            // alert(XMLHttpRequest.status);
            // alert(XMLHttpRequest.readyState);
            // alert(textStatus);
        }
    });
}

function addToAcceptance(bid) {
    var filter_content = '.evidence[data-id='+bid+']';
    var p_div = $(filter_content);
    if(p_div!=null&&p_div.length>0){
        p_div.remove();
    }

    filter_content = '.checkbox[data-bodyID='+bid+']';
    p_div = $(filter_content);
    if(p_div!=null&&p_div.length>0){
        p_div.remove();
    }

    $.ajax({
        type: "post",
        url: "/ecm/model/getHeaders",
        data: {"bid":bid},
        dataType:"json",
        // contentType: "application/json; charset=utf-8",
        async: true,
        // beforeSend: function(data){
        //     //这里判断，如果没有加载数据，会显示loading
        //     if(data.readyState == 0){
        //         loading("正在保存链体");
        //     }
        // },
        success: function (data) {
            var body = data['body'];
            var bnode = drawBody(false,body.x,body.y,bid,body.name,body.body,body,true);
            addEvidence(bid,body.body,body.isDefendant);

            var headers = data['headers'];
            for(var i = 0;i<headers.length;i++){
                var head = headers[i];
                var hnode = drawHeader(false,head['x'],head['y'],head['id'],head['name'],head['head'],head['keyText'],true);
                addLink(bnode,hnode);
                addHeaderofChain(head['head'],head['id'],bid);
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            // alert("save body");
            // alert(XMLHttpRequest.status);
            // alert(XMLHttpRequest.readyState);
            // alert(textStatus);
        }
    });
}

//添加采信证据，id:链体id，evidence_content:证据内容
function addEvidence(id,evidence_content,isDefendant) {

    var filter_content = '.evidence[data-id='+id+']';
    var p_div = $(filter_content);
    var classTemp = "evidence evidence_splitLine";
    if(isDefendant==0)
        classTemp += " evidence_plaintiff";

    if(p_div==null||p_div.length==0){
        var div_html="<div class=\""+classTemp+"\" data-id='"+id+"'>\n" +
            "                            <a data-toggle=\"collapse\" href=\"#heads_chain"+id+"\" class=\"evidence_a\">\n" +
            evidence_content+"</a></div>";

        $("#adoption").find(".panel-body").append(div_html);
    }
}

//添加链头
function addHeaderofChain(header_content,header_id,body_id) {
    var filter_content = '.evidence[data-id='+body_id+']';
    var p_div = $(filter_content);

    if(p_div!=null&&p_div.length>0){
        var id = p_div.find('a').first().attr("href").substring(1);

        if(p_div.find('.head_div')==null||p_div.find('.head_div').length==0){

            var add_html = " <div id=\""+id+"\" class=\"panel-collapse collapse in\">\n" +
                "                                <div class=\"head_div\">" +
                "<span class=\"head_chain\" data-id='"+header_id+"'>"+header_content+"</span></div></div>";
            p_div.append(add_html);
        }else{
            var header_div = p_div.find('span[data-id='+header_id+']');

            if(header_div==null||header_div.length==0){
                var add_html = "<span class=\"head_chain\" data-id='"+header_id+"'>"+header_content+"</span>";
                p_div.find('.head_div').append(add_html);
            }
        }
    }
}

function initFactsDiv(text,facts) {
    $("#factArea").val(text);
    if(facts!=null)
    for(var i = 0;i<facts.length;i++){
        var data = facts[i];
        var fact = data['fact'];
        if(fact['textID']==textID){
            var joints = data['joints'];
            addFactTxtField(fact['id'],fact['content'],fact['confirm'],joints);
        }
    }
}

function splitFacts() {
    var str="2,2,3,5,6,6"; //这是一字符串
    $("#factListDiv").html(" <br>\n" +
        "                <br>\n" +
        "                <br>");
    str=$("#factArea").val();

    $.ajax({
        url: "/ecm/model/splitFact",
        type: 'POST',
        dataType:"json",
        data: {"caseID": cid, "text": str},
        beforeSend: function (data) {
            //这里判断，如果没有加载数据，会显示loading
            if (data.readyState == 0) {
                
            }
        },
        success: function (data) {

            for(var i = 0;i<data.length;i++){
                textID = data[i]['textID'];
                // factList_div[data[i]['id']] =
                addFactTxtField(data[i]['id'],data[i]['content'],data[i]['confirm'],null);
                // drawFact(false,x,y,data[i]['name'],data[i]['content'],data[i]['name'],data[i]['content'],data[i]['logicNodeID'],data[i]['textID'],data[i]['confirm'],true);
                // y+=body_height + headerGap_y;
                if(data[i]['id']>divIndex1){
                    divIndex1 = data[i]['id']+1;
                }
            }
            // updateFactListofGraph();
            
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            // alert("save joint");
            // alert(XMLHttpRequest.status);
            // alert(XMLHttpRequest.readyState);
            // alert(textStatus);
        }
    });
}

function addFactTxtField(id,content,confirm,joints) {
    if(content==null){
        content = "";
    }

    var html="<div data-factID='"+id+"' class='evibody form-group row'><br><div class='col-md-8'>" +
        "<input type='text' class='form-control myinfo1' value='"+content+"'>" +
        "<a class=\"glyphicon myRemove glyphicon-remove btn form-control-feedback\"style=\"pointer-events:auto;padding-left: 1%\" " +
        "data-factID='"+id+"'  onclick='removeFactDiv(this)'></a></div>" +
        "<div class='col-md-2'>";
    if(confirm==1){
        html+="<button value='"+confirm+"' class='btn btn-danger' data-factID='"+id+"' " +
            "onclick='updateFactConfirm(this)'>不认定</button></div></div>";
    }else{
        html+="<button value='"+confirm+"' class='btn btn-success' data-factID='"+id+"' " +
            "onclick='updateFactConfirm(this)'>认定</button></div></div>";
    }

    $("#factListDiv").append(html);
    createJointHtml(id,joints);
}

function addFactElmt() {

    addFactTxtField(divIndex1++,"",1,null);

    // $.ajax({
    //     url: "/ecm/model/addFact",
    //     type: 'POST',
    //     dataType:"json",
    //     data: {"caseID": cid, "textID": textID},
    //     beforeSend: function (data) {
    //         //这里判断，如果没有加载数据，会显示loading
    //         if (data.readyState == 0) {
    //
    //         }
    //     },
    //     success: function (data) {
    //
    //         addFactTxtField(data[i]['id'],data[i]['content'],data[i]['confirm'],null);
    //         if(data[i]['id']>divIndex1){
    //             divIndex1 = data[i]['id']+1;
    //         }
    //
    //     }, error: function (XMLHttpRequest, textStatus, errorThrown) {
    //     }
    // });
}

function exportJoints() {
    var bList = [];
    for(var bid in bodyList){
        var body = bodyList[bid];

        if(body!=null){
            var node = body['node'];
            if(body['conclusion']==1){

                var outL = node.outLinks;
                var hList = [];
                if(outL!=null&&outL.length>0){
                    for(var i = 0;i<outL.length;i++){
                        var head = outL[i].nodeZ;
                        if(head!=null){
                            hList.push({"id":head.id,"head":head.content});
                        }
                    }
                    var b = {"id":bid,"caseID":cid,"body":node.content,"type":body['type'],'headList':hList};
                    bList.push(b);
                }
            }
        }
    }

    var fList = [];
    $(".evibody").each(function () {

        var factID = $(this).attr("data-factID");
        var content = $(this).find('input').eq(0).val();
        var confirm = $(this).find('button').eq(0).val();
        var jList = [];
        var jointsSpans = $(".headList[data-factID='"+factID+"']").find('.head_chain');
        for(var i = 0;i<jointsSpans.length;i++) {

            var jc = jointsSpans.eq(i).find('label').eq(0).text();
            if(jc!=null){
                jList.push(jc);
            }
        }
        fList.push({"id":factID,'caseID':cid,'content':content,'textID':textID,'confirm':confirm,'jointList':jList});
    });

    $('body').loading({
        loadingWidth:240,
        title:'请稍候...',
        name:'exportJoints',
        animateIn:'none',
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

    $.ajax({
        url: "/ecm/model/exportJoints",
        type: 'POST',
        data: JSON.stringify({'facts':fList,'bodies':bList,'caseID':cid}),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            factIndex = 0;
            jointIndex = 0;
            removeAllFactsInGraph();

            var joint_x = 10 + (body_width/2) + body_width/2 + headerGap_x + header_radius + header_radius + headerGap_x + joint_width/2;
            var fact_x = joint_x + body_width/2 + jointGap + (joint_width/2);
            var y = 10 + header_radius;
            factList = {};
            jointList = {};

            var unconfirm = data['unconfirm'];
            var confirm = data['confirm'];

            for(var i = 0;i<unconfirm.length;i++){
                var originID = unconfirm[i]['originID'];
                var newID = unconfirm[i]['newID'];
                var fdiv = $(".evibody[data-factID='"+originID+"']");
                fdiv.attr("data-factID",newID);
                fdiv.find('button').attr("data-factID",newID);
                fdiv.find('a').attr("data-factID",newID);
                $(".headList[data-factID='"+originID+"']").attr("data-factID",newID);
                $(".headList[data-factID='"+newID+"']").html("");
            }

            for(var i = 0;i<confirm.length;i++){
                var jnode,fnode;

                var originID = confirm[i]['originID'];
                var newID = confirm[i]['newID'];
                var fdiv = $(".evibody[data-factID='"+originID+"']");
                fdiv.attr("data-factID",newID);
                fdiv.find('button').attr("data-factID",newID);
                fdiv.find('a').attr("data-factID",newID);
                $(".headList[data-factID='"+originID+"']").attr("data-factID",newID);
                $(".headList[data-factID='"+newID+"']").html("");
                var relArr = confirm[i]['linkpoints'];

                var fy = 0;
                if(relArr==null||relArr.length==0){
                    y+=body_height + headerGap_y;
                    fy = y;
                }else{
                    fy = y+((relArr.length-1)*(joint_width + headerGap_y)/2);
                }

                fnode = drawFact(false,fact_x,fy,newID,"",confirm[i]['content'],confirm[i]['logicNodeID'],confirm[i]['textID'],1,true);

                for(var j = 0;j<relArr.length;j++){
                    var jointID = relArr[j]['id'];
                    var jcontent = relArr[j]['content'];
                    jnode = drawJoint(false,joint_x,y,jointID,"",jcontent,true);
                    y += headerGap_y + joint_width;
                    addLink(jnode,fnode);
                    addJointDiv(jointID,jcontent,newID);

                    var arrowList = relArr[j]['headList'];
                    for(var k = 0;k<arrowList.length;k++){
                        var arrowId = arrowList[k]['arrowID'];
                        var headID = arrowList[k]['headID'];
                        addArrow(headerList[headID],jnode,arrowId);
                    }
                }
            }
            updateFactListofGraph();
            removeLoading('exportJoints');
            saveAll(true,null);
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            // console.log(XMLHttpRequest.status);
            // console.log(XMLHttpRequest.readyState);
            // console.log(textStatus);
        }
    });
}

function extractJoints() {
    var fList = [];
    $(".evibody").each(function () {

        var factID = $(this).attr("data-factID");
        var content = $(this).find('input').eq(0).val();
        var confirm = $(this).find('button').eq(0).val();
        fList.push({"id":factID,'caseID':cid,'content':content,'textID':textID,'confirm':confirm});
    });

    $('#importFacts').loading({
        loadingWidth:240,
        title:'请稍候...',
        name:'extractJoints',
        animateIn:'none',
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

    $.ajax({
        url: "/ecm/model/extractJoints",
        type: 'POST',
        data: JSON.stringify(fList),
        dataType:'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            for(var i = 0;i<data.length;i++){
                addJointDiv(data[i]['id'],data[i]['content'],data[i]['factID']);
            }
            removeLoading('extractJoints');
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
}

function removeAllFactsInGraph() {
    for(var fid in factList){
        if(factList[fid]!=null){
            deleteFact(fid);
        }
    }

    for(var jid in jointList){
        if(jointList[jid]!=null){
            deleteJoint(jid);
        }
    }
}

function updateFactConfirm(select) {
    var factID=$(select).attr("data-factID");
    var confirm=1;
    // console.log($(select).val());

    if($(select).val()==0){
        $(select).removeClass("btn-success");
        $(select).addClass("btn-danger");
        $(select).text("不认定");
        $(select).val(1);
        confirm=1;
    }else{
        $(select).removeClass("btn-danger");
        $(select).addClass("btn-success");
        $(select).text("认定");
        $(select).val(0);
        confirm=0;
    }

    // $.ajax({
    //     url: "/ecm/model/updateFactConfirm",
    //     type: 'POST',
    //     // dataType:"json",
    //     data: {"fid": factID, "confirm": confirm},
    //     beforeSend: function (data) {
    //         //这里判断，如果没有加载数据，会显示loading
    //         if (data.readyState == 0) {
    //
    //         }
    //     },
    //     success: function (data) {
    //
    //     }, error: function (XMLHttpRequest, textStatus, errorThrown) {
    //     }
    // });
}

function removeFactDiv(fact){
    var factID=$(fact).attr("data-factID");

    // $.ajax({
    //     url: "/ecm/model/deleteFact",
    //     type: 'POST',
    //     // dataType:"json",
    //     data: {"id": factID},
    //     beforeSend: function (data) {
    //         //这里判断，如果没有加载数据，会显示loading
    //         if (data.readyState == 0) {
    //
    //         }
    //     },
    //     success: function (data) {
    //
    //         $(".headList[data-factID='"+factID+"']").remove();
    //         $(".evibody[data-factID='"+factID+"']").remove();
    //
    //     }, error: function (XMLHttpRequest, textStatus, errorThrown) {
    //     }
    // });
    // console.log("factID"+factID);
    // deleteFact(factID);
    // $("#factSelector option[value='"+factID+"']").remove();
    $(".headList[data-factID='"+factID+"']").remove();
    $(".evibody[data-factID='"+factID+"']").remove();
}

function createJointHtml(factID,joints){
    var html="<div class='headList text-left' data-factID='"+factID+"'>";
    if(joints!=null)
    for(var j=0;j<joints.length;j++){
        html+="<span data-jointID='"+joints[j].id+"' class='head_chain'><label style='font:inherit;min-width: 25px;'>"
            +joints[j].content+"</label><span class='glyphicon glyphicon-remove  headRemove' onclick='removeJointDiv(this)'></span></span>";
    }

    html+="<span class='glyphicon glyphicon-plus headRemove addHead' onclick='newJointDiv(this)'></span>"
    html+="</div>";
    $(".evibody[data-factID='"+factID+"']").after(html);

}

function removeJointDiv(remove) {
    var id=$(remove).parent().attr("data-jointID");
    console.log("jointid"+id);
    // deleteJoint(id);
    $(".head_chain[data-jointID='"+id+"']").remove();
}

function newJointDiv(joint) {
    var jointID = ++divIndex2;
    var factID = $(joint).parent().attr("data-factID");
    var  html="<span data-jointID='"+jointID+"' class='head_chain'><label contenteditable style='font:inherit;min-width: 25px;'></label>" +
        "<span class='glyphicon glyphicon-remove  headRemove' onclick='removeJointDiv(this)'></span></span>";
    $(joint).before(html);
}

function addJointDiv(jointID,jcontent,factID) {
    // var id=divIndex2++;
    if(jointID>divIndex2)
        divIndex2 = jointID;
    var  html="<span data-jointID='"+jointID+"' class='head_chain'><label contenteditable style='font:inherit;min-width: 25px;'>"+jcontent+"</label>" +
        "<span class='glyphicon glyphicon-remove  headRemove' onclick='removeJointDiv(this)'></span></span>";
    $(".headList[data-factID='"+factID+"']").find('.addHead').before(html);
}

function clearFactDiv() {
    $("#factListDiv").html(" <br>\n" +
        "                <br>\n" +
        "                <br>");
    $("#factArea").val('');
}

function exportToModel() {
    factIndex = 0;
    jointIndex = 0;
    removeAllFactsInGraph();

    var joint_x = 10 + (body_width/2) + body_width/2 + headerGap_x + header_radius + header_radius + 50 + joint_width/2;
    var fact_x = joint_x + body_width/2 + 60 + (joint_width/2);
    var y = 10 + header_radius;
    factList = {};
    jointList = {};

    $('body').loading({
        loadingWidth:240,
        title:'请稍候...',
        name:'exportToModel',
        animateIn:'none',
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

        $.ajax({
        url:"/ecm/model/deleteFactsAndJoints",
        type:'POST',
        data: {"caseID":cid},
        // dataType:"json",
        // contentType: "application/json; charset=utf-8",
        success:function(data) {

            $(".evibody").each(function () {

                var factID = $(this).attr("data-factID");
                var content = $(this).find('input').eq(0).val();
                var confirm = $(this).find('button').eq(0).val();

                var jnode,fnode;
                var jointsSpans = $(".headList[data-factID='"+factID+"']").find('.head_chain');

                var fy = 0;
                if(jointsSpans==null||jointsSpans.length==0){
                    y+=body_height + headerGap_y;
                    fy = y;
                }else{
                    fy = y+((jointsSpans.length-1)*(joint_width + headerGap_y)/2);
                }
                var f = {"caseID":cid,"name":"","content":content,'textID':textID,'confirm':confirm,'x':fact_x,'y':fy};

                $.ajax({
                    type: "post",
                    url: "/ecm/model/saveFact",
                    data: JSON.stringify(f),
                    dataType:"json",
                    contentType: "application/json; charset=utf-8",
                    // async: true,
                    success: function (data) {

                        factID = data['id'];
                        $(this).attr("data-factID",factID);
                        if(confirm==1){
                            fnode = drawFact(false,fact_x,fy,data['id'],data['name'],data['content'],data['logicNodeID'],data['textID'],data['confirm'],true);
                        }

                        for(var i = 0;i<jointsSpans.length;i++){

                            var jc = jointsSpans.eq(i).find('label').eq(0).text();
                            $.ajax({
                                type: "post",
                                url: "/ecm/model/saveJoint",
                                data: JSON.stringify({"caseID":cid,"name":jc,"content":jc,'factID':factID,'x':joint_x,'y':y}),
                                // dataType:"json",
                                contentType: "application/json; charset=utf-8",
                                async: false,
                                success: function (data) {
                                    jointsSpans.eq(i).attr("data-jointID",data);
                                    if(confirm==1){

                                        jnode = drawJoint(false,joint_x,y,data,"",jc,true);
                                        y += headerGap_y + joint_width;
                                        addLink(jnode,fnode);
                                    }
                                }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                                }
                            });
                        }
                    }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                    }
                });
            });
            updateFactListofGraph();
            removeLoading('exportToModel');
        }
    });
}