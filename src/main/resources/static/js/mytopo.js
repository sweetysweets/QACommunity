
var headerIndex = 0;//当前链头id
var headerList = {};//存储链头，{id:node}
var bodyIndex = 0;//当前链体id
var bodyList = {};//存储链体，{id:{'node':node,'type':'XXX','committer':'XXX','reason':'XXXXXX',
// 'conclusion':'1/0','documentID':-1,'isDefendant':1,'logicNodeID':xx}}
var jointIndex = 0;//当前联结点（事实）id
var jointList = {};//存储联结点（事实），{id:node}
var factIndex = 0;//当前事实节点id
var factList = {};//存储事实节点，{id:{'node':node,'logicNodeID':xx,'textID':-1,'confirm':1}}
var arrowIndex = 0;//当前箭头id
var arrowList = {};//存储箭头，{id:node}
var linkIndex = 0;//当前连线id
// var linkList = {};//存储连线，{id:node}
var operationList = [];//存储每一步操作，[{'type':'add/copy','nodes':[]},{'type':'move','nodes':[],'position_origin':[x,y]},
// {'type':'delete','nodes':[{'node':node,'content':{'',''}}]},{'type':'typesetting','nodes':[{'node':node,'x':x,'y':y}]}]
// var header_delete = [];//删除的链头id
// var body_delete = [];//删除的链体id
// var joint_delete = [];//删除的联结点id
// var fact_delete = [];//删除的事实节点id

var isNodeClicked_right = false;//节点（链头、链体、联结点、连线、箭头）右键点击
var isNodeClicked_left = false;//节点（链头、链体、联结点、连线、箭头）左键点击
// var nodeList_selected = [];//已选中的节点（链头、链体、联结点、连线、箭头），[node]
// var isCtrlPressed = false;//ctrl键是否按下
var nodeFroms = [];//连线or箭头链头节点（允许同时创建多个连线或箭头），存储在nodeList_selected中的index
var nodeTo;//连线链体节点or箭头联结点节点
var header_radius = 17;//链头节点半径
var body_width = 65;//链体节点长
var body_height = 25;//链体节点宽
var joint_width = 25;//联结点边长
var fact_borderRadius = 6;//事实节点borderRadius
var header_color = 'rgba(127,185,136,0.8)';//链头边框颜色
var header_color_num = '127,185,136';
var body_color = 'rgba(97,158,255,0.8)';//链体边框颜色
var body_color_num = '97,158,255';
var joint_color = 'rgba(101,43,105,0.8)';//联结点边框颜色
var joint_color_num = '101,43,105';
var fact_color = 'rgba(253, 185, 51,0.8)';//联结点边框颜色
var fact_color_num = '253, 185, 51';
var continuous_header = false;//是否连续绘制链头
var continuous_body = false;//是否连续绘制链体
var continuous_joint = false;//是否连续绘制联结点
var continuous_fact = false;//是否连续绘制事实
var isCopied = false;//是否点击复制图元
var nodeList_copied = [];//已选中复制的节点
var x_origin,y_origin = 0;//拖拽节点的初始位置
var tranX_scene,tranY_scene = 0;//拖拽场景的初始位置
// var x_now,y_now = 0;
var sourceNode;//拖拽节点（当选中多个节点进行拖拽时，鼠标拖拽的节点即参照节点）
var mouseX,mouseY;//鼠标位置
var hasDragged = false;//是否已拖拽图标（为了处理点击效果）
var typeStr = ["证人证言","被告人供述和辩解","书证","鉴定结论","勘验","检查笔录","其他"];
var headerGap_x = 250;
var headerGap_y = 40;
var jointGap = 250;

$(document).ready(function(){

    canvas = document.getElementById('canvas');
    stage = new JTopo.Stage(canvas); // 创建一个舞台对象
    scene = new JTopo.Scene(stage); // 创建一个场景对象
    stage.mode = "normal";
    oContext = canvas.getContext("2d");
    stage.wheelZoom = null;

    stage.addEventListener("mouseover", function(event){
        console.log("鼠标进入");
    });

    stage.addEventListener("mousedrag", function(event){
        console.log("拖拽");

        continuous_header = false;
        continuous_body = false;
        continuous_joint = false;
        continuous_fact = false;

        $('#add-header-btn-toggle').css({'background-color':'white'});
        $('#add-body-btn-toggle').css({'background-color':'white'});
        $('#add-joint-btn-toggle').css({'background-color':'white'});
        $('#add-fact-btn-toggle').css({'background-color':'white'});
    });

    stage.addEventListener("mousedown", function(event){
        console.log("mouse down");

        tranX_scene = scene.translateX;
        tranY_scene = scene.translateY;
        // console.log(tranX_scene+'@@'+tranY_scene);

        if(event.button == 2){
            console.log ('按下右键');

            if(!isNodeClicked_right){
                $("#nodeMenu").hide();
                $("#nodeMenu2").hide();
                $("#nodeMenu3").hide();
                $("#linkMenu").hide();
                $("#arrowMenu").hide();

                $('.evidence').css('background-color', 'white');
                $('.evidence_plaintiff').css('background-color', '#5ed7e5');
                $('.evidence').find('.head_chain').css('background-color', 'white');
                $('.evidence_plaintiff').find('.head_chain').css('background-color', '#5ed7e5');

                $("#stageMenu").css({
                    top: getMousePosition_rdiv(event).y,
                    left: getMousePosition_rdiv(event).x
                }).show();
            }
        }
    });

    stage.addEventListener("mouseup", function(event){
        console.log("mouse up");

        // if(event.button == 2){
        //     console.log ('松开右键');
        //
        //     if(!isNodeClicked_right){
        //         $("#nodeMenu").hide();
        //         $("#nodeMenu2").hide();
        //         $("#nodeMenu3").hide();
        //         $("#linkMenu").hide();
        //         $("#arrowMenu").hide();
        //
        //         $('.evidence').css('background-color', 'white');
        //         $('.evidence_plaintiff').css('background-color', '#5ed7e5');
        //         $('.evidence').find('.head_chain').css('background-color', 'white');
        //         $('.evidence_plaintiff').find('.head_chain').css('background-color', '#5ed7e5');
        //
        //         $("#stageMenu").css({
        //             top: getMousePosition_rdiv(event).y,
        //             left: getMousePosition_rdiv(event).x
        //         }).show();
        //     }
        // }

        if(event.button == 0){
            console.log ( '松开左键');

            // 关闭弹出菜单
            $("#stageMenu").hide();
            $("#nodeMenu").hide();
            $("#nodeMenu2").hide();
            $("#nodeMenu3").hide();
            $("#linkMenu").hide();
            $("#arrowMenu").hide();

            if(!isNodeClicked_right){
                $('.evidence').css('background-color', 'white');
                $('.evidence_plaintiff').css('background-color', '#5ed7e5');
                $('.evidence').find('.head_chain').css('background-color', 'white');
                $('.evidence_plaintiff').find('.head_chain').css('background-color', '#5ed7e5');
            }
            isNodeClicked_right = false;
            isNodeClicked_left = false;

            if(continuous_header){
                var nodePosition = getNodePosition(event);
                drawHeader(true,nodePosition.x,nodePosition.y);

            }else if(continuous_body){
                var nodePosition = getNodePosition(event);
                drawBody(true,nodePosition.x,nodePosition.y);

            }else if(continuous_joint){
                var nodePosition = getNodePosition(event);
                drawJoint(true,nodePosition.x,nodePosition.y);

            }else if(continuous_fact){
                var nodePosition = getNodePosition(event);
                drawFact(true,nodePosition.x,nodePosition.y);
            }
        }

        addMoveOperations();
    });

    stage.addEventListener("mousemove", function(event){
        var mousePos = getMousePosition_Canvas(event);
        mouseX = mousePos.x;
        mouseY = mousePos.y;
    },false);

    this.addEventListener("keydown", function(event){
        if(event.ctrlKey == true){

            if(event.keyCode == 67){
                nodeList_copied = scene.selectedElements.concat();
            }
            if(event.keyCode == 86){
                paste(mouseX-scene.translateX,mouseY-scene.translateY);
            }
        }
    });
    // this.addEventListener("keyup", function(event){
    // });

    $("#boxSelection").change(function() {

        if($(this).is(':checked')==true){
            stage.mode = "select";

            continuous_header = false;
            continuous_body = false;
            continuous_joint = false;
            continuous_fact = false;

            $('#add-header-btn-toggle').css({'background-color':'white'});
            $('#add-body-btn-toggle').css({'background-color':'white'});
            $('#add-joint-btn-toggle').css({'background-color':'white'});
            $('#add-fact-btn-toggle').css({'background-color':'white'});

            $('#add-header-btn-toggle').attr('disabled',"true");
            $('#add-body-btn-toggle').attr('disabled',"true");
            $('#add-joint-btn-toggle').attr('disabled',"true");
            $('#add-fact-btn-toggle').attr('disabled',"true");
        }else{
            stage.mode = "normal";

            $('#add-header-btn-toggle').removeAttr("disabled");
            $('#add-body-btn-toggle').removeAttr("disabled");
            $('#add-joint-btn-toggle').removeAttr("disabled");
            $('#add-fact-btn-toggle').removeAttr("disabled");
        }
    });

    dragHeader();
    dragBody();
    dragJoint();
    dragFact();
    dragHandle();

    quickDraw();
    bindMenuClick();
    bindRightPanel();

    $('#zoomOut-btn').click(function () {
        stage.zoomOut(0.85);
        scene.translateToCenter();
        $("#canvasDiv").scrollLeft((canvas.width-$("#canvasDiv").width())/2);
        $("#canvasDiv").scrollTop((canvas.height-$("#canvasDiv").height())/2);
    });
    $('#zoomIn-btn').click(function () {
        stage.zoomIn(0.85);
        scene.translateToCenter();
        $("#canvasDiv").scrollLeft((canvas.width-$("#canvasDiv").width())/2);
        $("#canvasDiv").scrollTop((canvas.height-$("#canvasDiv").height())/2);
    });
    $("#zoomSelection").change(function () {
        if($(this).is(':checked')==true){
            stage.wheelZoom = 0.85; //缩放比例为0.85
            scene.translateToCenter();
            $("#canvasDiv").scrollLeft((canvas.width-$("#canvasDiv").width())/2);
            $("#canvasDiv").scrollTop((canvas.height-$("#canvasDiv").height())/2);
        }else{
            stage.wheelZoom = null;
        }
    });

    $('#save-btn').click(function () {
        saveAll(false);
    });
    $('#saveImg-btn').click(function () {
        stage.saveImageInfo(undefined, undefined, "证据链模型图");
    });
    $('#saveExcel-btn').click(function () {
        saveAll(true,"/ecm/model/exportExcel?cid="+cid);
        // window.location.href="/ecm/model/exportExcel?cid="+cid;

    });
    $('#saveXML-btn').click(function () {
        saveAll(true,"/ecm/model/exportXML?cid="+cid);
        // window.location.href="/ecm/model/exportXML?cid="+cid;

    });
    $('#revoke-btn').click(function () {
        undo();
    });
    $('#layout-btn').click(function () {
        typeSetting();
    });

    $("#factSelector").change(function () {
        var fid=$("#factSelector").val();
        if(fid>=0){
            var x = factList[fid]['node'].x;
            var y = factList[fid]['node'].y;
            var div_width = $("#canvasDiv").width();
            var div_height = $("#canvasDiv").height();
            var canvas_width = canvas.width;
            var canvas_height = canvas.height;

            var leftOffset = x-(div_width/2)+body_width;
            var topOffset = y-(div_height/2)+body_height;

            if(leftOffset>canvas_width){
                scene.translateX = leftOffset-canvas_width;
                leftOffset = canvas_width;
            }
            if(topOffset>canvas_height){
                scene.translateY = topOffset-canvas_height;
                topOffset = canvas_height;
            }
            $("#canvasDiv").scrollLeft(leftOffset);
            $("#canvasDiv").scrollTop(topOffset);
            factList[fid]['node'].click();
            scene.cancleAllSelected();
            scene.addToSelected(factList[fid]['node']);
            factList[fid]['node'].selected=1;
        }else{
            scene.translateX = 0;
            scene.translateY =0;
            $("#canvasDiv").scrollLeft(0);
            $("#canvasDiv").scrollTop(0);
        }
    });

    window.setInterval(saveAll,360000);
});

function updateFactListofGraph() {
    $("#factSelector").html("<option value='-1'>请选择</option>");

    for(var fid in factList){
        var fact = factList[fid];

        if(fact!=null){
            var node = fact['node'];
            $('#factSelector').append("<option value='"+fid+"'>"+node.text+"</option>");
        }
    }
}

//存储所有
function saveAll(isAsync,url) {
    if(isAsync==null){
        isAsync = true;
    }
    var hList = [];
    for(var hid in headerList){
        var node = headerList[hid];

        if(node!=null){
            var documentID = -1;
            var bodyID = -1;

            if(node.inLinks!=null&&node.inLinks.length>0){
                bodyID = node.inLinks[0].nodeA.id;
                documentID = bodyList[bodyID]['documentID'];
            }

            var h = {"id":hid,"caseID":cid,"documentid":documentID,"bodyid":bodyID,
                "name":node.text,"head":node.content,"x":node.x,"y":node.y};
            hList.push(h);
        }
    }

    var bList = [];
    for(var bid in bodyList){
        var body = bodyList[bid];

        if(body!=null){
            var node = body['node'];
            var b = {"id":bid,"caseID":cid,"documentid":body['documentID'],"name":node.text,"body":node.content,"x":node.x,"y":node.y,
                "type":body['type'],"committer":body['committer'],"reason":body['reason'],"trust":body['conclusion'],
                "isDefendant":body['isDefendant'],"logicNodeID":body['logicNodeID']};
            bList.push(b);
        }
    }

    var jList = [];
    for(var jid in jointList){
        var node = jointList[jid];

        if(node!=null){
            // var node = joint['node'];
            var factID = -1;
            if(node.outLinks!=null&&node.outLinks.length>0){
                factID = node.outLinks[0].nodeZ.id;
            }
            var j = {"id":jid,"caseID":cid,"name":node.text,"content":node.content,"x":node.x,"y":node.y,'factID':factID};
            jList.push(j);
        }
    }

    var fList = [];
    for(var fid in factList){
        var fact = factList[fid];

        if(fact!=null){
            var node = fact['node'];
            var f = {"id":fid,"caseID":cid,"name":node.text,"content":node.content,"x":node.x,"y":node.y,
                "logicNodeID":fact['logicNodeID'],'textID':fact['textID'],'confirm':fact['confirm']};
            fList.push(f);
        }
    }

    var aList = [];
    for(var aid in arrowList){
        var node = arrowList[aid];

        if(node!=null){
            var a = {"id":aid,"caseID":cid,"nodeFrom_hid":node.nodeA.id,"nodeTo_jid":node.nodeZ.id,
                "name":node.text,"content":node.content};
            aList.push(a);
        }
    }

    var logicL = {};
    for(var bid in bodyList) {
        var body = bodyList[bid];
        var fids = [];

        if (body != null) {
            var outL = body['node'].outLinks;
            if(outL!=null&&outL.length>0){
                for(var i = 0;i<outL.length;i++){
                    var ho = outL[i].nodeZ.outLinks;
                    if(ho!=null&&ho.length>0){
                        var jo = ho[0].nodeZ.outLinks;
                        if(jo!=null&&jo.length>0){
                            var fid = jo[0].nodeZ.id;
                            var tmp = $.inArray(fid,fids);
                            if(tmp<0&&fid>=0){
                                fids.push(fid);
                            }
                        }
                    }
                }
                logicL[bid] = fids;
            }
        }
    }

    var sketchList = getSketchList();
    var dList = {'caseID':cid,'headers':hList,'bodies':bList,'joints':jList,'facts':fList,'arrows':aList,'links':logicL,'sketches':sketchList};

    if(isAsync==true){
        $.ajax({
            type: "post",
            url: "/ecm/model/saveAll",
            data: JSON.stringify(dList),
            // dataType:"json",
            contentType: "application/json; charset=utf-8",
            async: true,
            beforeSend: function(data){
                //这里判断，如果没有加载数据，会显示loading
                if(data.readyState == 0){
                    notify("正在保存更改");
                }
            },
            success: function (data) {
                removeNotify("保存成功");
                if(url!=null)
                    window.location.href=url;
            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                // alert("save all");
                // alert(XMLHttpRequest.status);
                // alert(XMLHttpRequest.readyState);
                // alert(textStatus);
            }
        });
    }else{
        // console.log('***'+$(".cpt-loading-mask[data-name='save']").length);
        $('body').loading({
            loadingWidth:240,
            title:'保存中',
            name:'save',
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
            type: "post",
            url: "/ecm/model/saveAll",
            data: JSON.stringify(dList),
            // dataType:"json",
            contentType: "application/json; charset=utf-8",
            async: true,
            success: function (data) {
                var cpt = $(".cpt-loading-mask[data-name='save']");
                cpt.find('.loading').html("<span><i class='fa fa-check' style='font-size: 16px;'></i></span>");
                cpt.find('.loading-title').html("保存成功");
                setTimeout(function(){
                    removeLoading('save');
                },1000);
                // removeLoading('save');
            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                // alert("save all");
                // alert(XMLHttpRequest.status);
                // alert(XMLHttpRequest.readyState);
                // alert(textStatus);
            }
        });
    }

}

//存储单个链头
function saveHead(node) {
    var documentID = -1;
    var bodyID = -1;

    if(node.inLinks!=null&&node.inLinks.length>0){
        bodyID = node.inLinks[0].nodeA.id;
        documentID = bodyList[bodyID]['documentID'];
    }

    var h = {"id":node.id,"caseID":cid,"documentid":documentID,"bodyid":bodyID,
        "name":node.text,"head":node.content,'keyText':node.keyText,"x":node.x,"y":node.y};

    $.ajax({
        type: "post",
        url: "/ecm/model/saveHead",
        data: JSON.stringify(h),
        // dataType:"json",
        contentType: "application/json; charset=utf-8",
        async: true,
        // beforeSend: function(data){
        //     //这里判断，如果没有加载数据，会显示loading
        //     if(data.readyState == 0){
        //         loading("正在保存链头");
        //     }
        // },
        success: function (data) {
            headerList[node.id] = null;
            node.id = data;
            headerList[node.id] = node;
            headerIndex = data+1;
            // removeLoading("链头保存成功");
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            // alert("save head");
            // alert(XMLHttpRequest.status);
            // alert(XMLHttpRequest.readyState);
            // alert(textStatus);
        }
    });
}

//删除单个链头
function deleteHeadData(id) {

    $.ajax({
        type: "post",
        url: "/ecm/model/deleteHead",
        data: {"id":id},
        // dataType:"json",
        // contentType: "application/json; charset=utf-8",
        async: true,
        // beforeSend: function(data){
        //     //这里判断，如果没有加载数据，会显示loading
        //     if(data.readyState == 0){
        //         loading("正在删除链头");
        //     }
        // },
        success: function (data) {
            // removeLoading("链头删除成功");
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            // alert("save head");
            // alert(XMLHttpRequest.status);
            // alert(XMLHttpRequest.readyState);
            // alert(textStatus);
        }
    });
}

//更新多个链头
function updateHeads(hList) {
    $.ajax({
        type: "post",
        url: "/ecm/model/saveHeaders",
        data: JSON.stringify(hList),
        // dataType:"json",
        contentType: "application/json; charset=utf-8",
        async: true,
        // beforeSend: function(data){
        //     //这里判断，如果没有加载数据，会显示loading
        //     if(data.readyState == 0){
        //         loading("正在保存链头");
        //     }
        // },
        success: function (data) {

        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            // alert("save head");
            // alert(XMLHttpRequest.status);
            // alert(XMLHttpRequest.readyState);
            // alert(textStatus);
        }
    });
}

//更新单个链体
function updateBody(data) {
    $.ajax({
        type: "post",
        url: "/ecm/model/saveBody",
        data: JSON.stringify(data),
        dataType:"json",
        contentType: "application/json; charset=utf-8",
        async: true,
        // beforeSend: function(data){
        //     //这里判断，如果没有加载数据，会显示loading
        //     if(data.readyState == 0){
        //         loading("正在保存链体");
        //     }
        // },
        success: function (data) {

        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            // alert("save body");
            // alert(XMLHttpRequest.status);
            // alert(XMLHttpRequest.readyState);
            // alert(textStatus);
        }
    });
}

//存储单个链体
function saveBody(node) {

    var body = bodyList[node.id];
    var bd = {"id":node.id,"caseID":cid,"documentid":body['documentID'],"name":node.text,"body":node.content,"x":node.x,"y":node.y,
        "type":body['type'],"committer":body['committer'],"reason":body['reason'],"trust":body['conclusion'],
        "isDefendant":body['isDefendant'],"logicNodeID":body['logicNodeID']};

    $.ajax({
        type: "post",
        url: "/ecm/model/saveBody",
        data: JSON.stringify(bd),
        dataType:"json",
        contentType: "application/json; charset=utf-8",
        async: true,
        // beforeSend: function(data){
        //     //这里判断，如果没有加载数据，会显示loading
        //     if(data.readyState == 0){
        //         loading("正在保存链体");
        //     }
        // },
        success: function (data) {
            bodyList[node.id] = null;
            node.id = data.id;
            bodyList[node.id] = {'node':node,"documentid":data['documentid'], "type":data['type'],
                "committer":data['committer'],"reason":data['reason'],"conclusion":data['trust'],
                "isDefendant":data['isDefendant'],"logicNodeID":data['logicNodeID']};
            bodyIndex = data.id+1;
            // removeLoading("链体保存成功");
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            // alert("save body");
            // alert(XMLHttpRequest.status);
            // alert(XMLHttpRequest.readyState);
            // alert(textStatus);
        }
    });
}

//删除单个链体
function deleteBodyData(id) {

    $.ajax({
        type: "post",
        url: "/ecm/model/deleteBody",
        data: {"id":id},
        // dataType:"json",
        // contentType: "application/json; charset=utf-8",
        async: true,
        // beforeSend: function(data){
        //     //这里判断，如果没有加载数据，会显示loading
        //     if(data.readyState == 0){
        //         loading("正在删除链头");
        //     }
        // },
        success: function (data) {
            // removeLoading("链头删除成功");
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            // alert("delete body");
            // alert(XMLHttpRequest.status);
            // alert(XMLHttpRequest.readyState);
            // alert(textStatus);
        }
    });
}

//存储单个联结点
function saveJoint(node) {

    // var joint = jointList[node.id];
    var factID = -1;
    if(node.outLinks!=null&&node.outLinks.length>0){
        factID = node.outLinks[0].nodeZ.id;
    }
    var j = {"id":node.id,"caseID":cid,"name":node.text,"content":node.content,"x":node.x,"y":node.y,'factID':factID};

    $.ajax({
        type: "post",
        url: "/ecm/model/saveJoint",
        data: JSON.stringify(j),
        // dataType:"json",
        contentType: "application/json; charset=utf-8",
        async: true,
        // beforeSend: function(data){
        //     //这里判断，如果没有加载数据，会显示loading
        //     if(data.readyState == 0){
        //         loading("正在保存联结点");
        //     }
        // },
        success: function (data) {
            // console.log("jointID:"+data);
            jointList[node.id] = null;
            node.id = data;
            jointList[node.id] = node;
            jointIndex = data+1;
            // removeLoading("链体保存成功");
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            // alert("save joint");
            // alert(XMLHttpRequest.status);
            // alert(XMLHttpRequest.readyState);
            // alert(textStatus);
        }
    });
}

//删除单个联结点
function deleteJointData(id) {

    $.ajax({
        type: "post",
        url: "/ecm/model/deleteJoint",
        data: {"id":id},
        // dataType:"json",
        // contentType: "application/json; charset=utf-8",
        async: true,
        // beforeSend: function(data){
        //     //这里判断，如果没有加载数据，会显示loading
        //     if(data.readyState == 0){
        //         loading("正在删除联结点");
        //     }
        // },
        success: function (data) {
            // removeLoading("联结点删除成功");
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            // alert("delete Joint");
            // alert(XMLHttpRequest.status);
            // alert(XMLHttpRequest.readyState);
            // alert(textStatus);
        }
    });
}

//存储单个事实点
function saveFact(node) {
    var fact = factList[node.id];
    var f = {"id":node.id,"caseID":cid,"name":node.text,"content":node.content,"x":node.x,"y":node.y,
        "logicNodeID":fact['logicNodeID'],'textID':fact['textID'],'confirm':fact['confirm']};

    $.ajax({
        type: "post",
        url: "/ecm/model/saveFact",
        data: JSON.stringify(f),
        // dataType:"json",
        contentType: "application/json; charset=utf-8",
        async: true,
        // beforeSend: function(data){
        //     //这里判断，如果没有加载数据，会显示loading
        //     if(data.readyState == 0){
        //         loading("正在保存事实节点");
        //     }
        // },
        success: function (data) {
            factList[node.id] = null;
            node.id = data.id;
            factList[node.id] = {'node':node,'logicNodeID':data['logicNodeID'],'textID':data['textID'],'confirm':data['confirm']};
            factIndex = data.id+1;
            $('#factSelector').append("<option value='"+data.id+"'>"+node.text+"</option>");
            // removeLoading("事实节点保存成功");
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            // alert("save fact");
            // alert(XMLHttpRequest.status);
            // alert(XMLHttpRequest.readyState);
            // alert(textStatus);
        }
    });
}

//删除单个事实点
function deleteFactData(id) {

    $.ajax({
        type: "post",
        url: "/ecm/model/deleteFact",
        data: {"id":id},
        // dataType:"json",
        // contentType: "application/json; charset=utf-8",
        async: true,
        // beforeSend: function(data){
        //     //这里判断，如果没有加载数据，会显示loading
        //     if(data.readyState == 0){
        //         loading("正在删除事实节点");
        //     }
        // },
        success: function (data) {
            $("#factSelector option[value='"+id+"']").remove();
            // removeLoading("事实节点删除成功");
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            // alert("delete fact");
            // alert(XMLHttpRequest.status);
            // alert(XMLHttpRequest.readyState);
            // alert(textStatus);
        }
    });
}

//将移动操作加入operationList
function addMoveOperations() {
    var x_now,y_now;
    var nodeList_selected = scene.selectedElements;

    if(nodeList_selected.length==0){
        x_now = scene.translateX;
        y_now = scene.translateY;
        if(x_now!=tranX_scene||y_now!=tranY_scene)
            operationList.push({'type':'move','nodes':null,'position_origin':[tranX_scene,tranY_scene]});

    }else{
        if(sourceNode!=null){
            x_now = sourceNode.x;
            y_now = sourceNode.y;
            if(x_now!=x_origin||y_now!=y_origin)
                operationList.push({'type':'move','nodes':nodeList_selected,'position_origin':[x_origin,y_origin],'source':sourceNode});
        }
    }
}

//撤销
function undo() {
    if(operationList.length<=0)
        return -1;

    var operation = operationList.pop();

    if(operation['type']=='add'||operation['type']=='copy'){

        for(var i = 0;i<operation['nodes'].length;i++){
            var node = operation['nodes'][i];

            if(node.node_type=='header'){
                deleteHeader(node.id);

            }else if(node.node_type=='body'){
                deleteBody(node.id);

            }else if(node.node_type=='joint'){
                deleteJoint(node.id);

            }else if(node.node_type=='fact'){
                deleteFact(node.id);

            }else if(node.node_type=='arrow'){
                deleteArrow(node);

            }else if(node.node_type=='link'){
                deleteLink(node);
            }
        }

    }else if(operation['type']=='delete'){

        for(var i = 0;i<operation['nodes'].length;i++){
            var n = operation['nodes'][i];
            var node = n['node'];

            if(node.node_type=='header'){
                headerList[node.id] = node;
                scene.add(node);
                saveHead(node);
                // drawHeader(false,node.x,node.y,node.id,node.text,node.content,node.keyText);

            }else if(node.node_type=='body'){
                var documentID = -1;
                var isDefendant = -1;
                var conclusion = 1;
                var logicNodeID = -1;
                var type = 5;
                var committer = "";
                var reason = "";
                if(n['content']!=null){
                    documentID = n['content'].documentid;
                    isDefendant = n['content'].isDefendant;
                    conclusion = n['content'].trust;
                    logicNodeID = n['content'].logicNodeID;
                    type = n['content'].type;
                    committer = n['content'].committer;
                    reason = n['content'].reason;
                }
                if(documentID==null)
                    documentID = -1;
                if(isDefendant==null)
                    isDefendant = 1;
                if(conclusion==null)
                    conclusion = 1;
                if(logicNodeID==null)
                    logicNodeID = -1;
                bodyList[node.id] = {'node':node,'type':type,'committer':committer,'reason':reason,
                    'conclusion':conclusion, 'documentID':documentID,'isDefendant':isDefendant,'logicNodeID':logicNodeID};
                scene.add(node);
                saveBody(node);
                // drawBody(false,node.x,node.y,node.id,node.text,node.content,n['content']);

            }else if(node.node_type=='joint'){
                jointList[node.id] = node;
                scene.add(node);
                saveJoint(node);
                // drawJoint(false,node.x,node.y,node.id,node.text,node.content);

            }else if(node.node_type=='fact'){
                var confirm = -1;
                var textID = 1;
                var logicNodeID = -1;
                if(logicNodeID==null)
                    logicNodeID = -1;
                if(textID==null)
                    textID = -1;
                if(confirm==null)
                    confirm = 1;

                factList[node.id] = {'node':node,'logicNodeID':logicNodeID,'textID':textID,
                    'confirm':confirm};
                scene.add(node);
                saveFact(node);
                // drawFact(false,node.x,node.y,node.id,node.text,node.content,n['content']['logicNodeID'],
                //     n['content']['textID'],n['content']['confirm']);

            }else if(node.node_type=='arrow'){
                addArrow(node.nodeA,node.nodeZ,node.id,node.text,node.content);

            }else if(node.node_type=='link'){
                addLink(node.nodeA,node.nodeZ);
            }
        }

    }else if(operation['type']=='move'){
        if(operation['nodes']==null){
            scene.translateX = operation['position_origin'][0];
            scene.translateY = operation['position_origin'][1];
        }else{
            var x_offset = operation['position_origin'][0]-operation['source'].x;
            var y_offset = operation['position_origin'][1]-operation['source'].y;

            for(var i = 0;i<operation['nodes'].length;i++){
                var node_temp = operation['nodes'][i];
                node_temp.x+=x_offset;
                node_temp.y+=y_offset;
            }
        }
    }else if(operation['type']=='typesetting'){
        for(var i = 0;i<operation['nodes'].length;i++){
            var c = operation['nodes'][i];
            var node = c['node'];
            node.x = c['x'];
            node.y = c['y'];
        }
    }
}

//连续画图
function quickDraw() {
    $('#add-header-btn-toggle').click(function () {
        if(continuous_header){
            continuous_header = false;
            $(this).css({'background-color':'white'});
        }else{
            continuous_header = true;
            continuous_body = false;
            continuous_joint = false;
            continuous_fact = false;

            $(this).css({'background-color':'grey'});
            $('#add-body-btn-toggle').css({'background-color':'white'});
            $('#add-joint-btn-toggle').css({'background-color':'white'});
            $('#add-fact-btn-toggle').css({'background-color':'white'});
        }
    });

    $('#add-body-btn-toggle').click(function () {

        if(continuous_body){
            continuous_body = false;
            $(this).css({'background-color':'white'});
        }else{
            continuous_body = true;
            continuous_header = false;
            continuous_joint = false;
            continuous_fact = false;

            $(this).css({'background-color':'grey'});
            $('#add-header-btn-toggle').css({'background-color':'white'});
            $('#add-joint-btn-toggle').css({'background-color':'white'});
            $('#add-fact-btn-toggle').css({'background-color':'white'});
        }
    });

    $('#add-joint-btn-toggle').click(function () {

        if(continuous_joint){
            continuous_joint = false;
            $(this).css({'background-color':'white'});
        }else{
            continuous_joint = true;
            continuous_header = false;
            continuous_body = false;
            continuous_fact = false;

            $(this).css({'background-color':'grey'});
            $('#add-header-btn-toggle').css({'background-color':'white'});
            $('#add-body-btn-toggle').css({'background-color':'white'});
            $('#add-fact-btn-toggle').css({'background-color':'white'});
        }
    });

    $('#add-fact-btn-toggle').click(function () {

        if(continuous_fact){
            continuous_fact = false;
            $(this).css({'background-color':'white'});
        }else{
            continuous_fact = true;
            continuous_joint = false;
            continuous_header = false;
            continuous_body = false;

            $(this).css({'background-color':'grey'});
            $('#add-header-btn-toggle').css({'background-color':'white'});
            $('#add-body-btn-toggle').css({'background-color':'white'});
            $('#add-joint-btn-toggle').css({'background-color':'white'});
        }
    });
}

//button拖拽方法
function dragHandle() {

    $("#draggableDiv").mouseup(function (event) {
        // console.log('drag mouse up');
        if(!hasDragged){
            $("#draggableDiv").html("");
            $(this).css({ "height": "0",
                "width": "0",
                "border": '0px',
                "border-radius":'0px',
                "background-color":'transparent' });
        }
    });

    $("#draggableDiv").draggable({
        // containment: "parent",
        drag: function (event) {
            hasDragged = true;
            // console.log('drag');
        },
        stop: function () {
            //拖拽结束，将拖拽容器内容清空
            // console.log('drag stop');
            hasDragged = false;
            $("#draggableDiv").html("");
            $("#draggableDiv").css({
                "height": "0",
                "width": "0",
                "border": '0px',
                "border-radius":'0px',
                "background-color":'transparent'});
        }
    });

    //“放”的操作代码
    $("#canvas").droppable({
        drop: function (event) {

            if(event.pageX-$("#canvas").offset().left>=0&&event.pageY-$("#canvas").offset().top>=0){
                var nodePosition = getNodePosition(event);
                var eType = $("#draggableDiv").attr('data-eType');

                if(eType=='header'){
                    drawHeader(true,nodePosition.x,nodePosition.y);

                }else if(eType=='body'){
                    drawBody(true,nodePosition.x, nodePosition.y);

                }else if(eType=='joint'){
                    drawJoint(true,nodePosition.x, nodePosition.y);

                }else if(eType=='fact'){
                    drawFact(true,nodePosition.x, nodePosition.y);
                }
            }
        }
    });
}

//add-header-btn与拖拽方法绑定
function dragHeader() {
    $( "#add-header-btn" ).bind("mousedown", function (event) {

        if(event.button == 0){
            var draggableDiv = $("#draggableDiv");
            $(draggableDiv).css({
                "display": "block",
                "width": (header_radius*2)+"px",
                "height": (header_radius*2)+"px",
                "top": event.pageY-$(this).parent().parent().offset().top-header_radius,
                "left": event.pageX-$(this).parent().parent().offset().left-header_radius,
                "font-size": (header_radius*1.8)+"px",
                "color": header_color,
                "border":'0px'});
            $(draggableDiv).attr('data-eType','header');

            var clickElement = "<i class=\"fa fa-circle-thin\" aria-hidden=\"true\"></i>";
            $("#draggableDiv").html(clickElement);
            draggableDiv.trigger(event);
        }
        //取消默认行为
        return false;
    });
}

//add-body-btn与拖拽方法绑定
function dragBody() {
    $( "#add-body-btn" ).bind("mousedown", function (event) {

        if(event.button == 0){
            var draggableDiv = $("#draggableDiv");
            // console.log('x:'+event.pageX+';y:'+event.pageY+';left:'+$(this).parent().offset().left+';top:'+$(this).parent().offset().top);
            $(draggableDiv).css({
                "display": "block",
                "width": body_width/1.2+"px",
                "height": body_height/1.2+"px",
                "top": event.pageY-$(this).parent().parent().offset().top,
                "left": event.pageX-$(this).parent().parent().offset().left-(body_width/2),
                "border":'2px solid '+body_color});
            $(draggableDiv).attr('data-eType','body');

            draggableDiv.trigger(event);
        }
        //取消默认行为
        return false;
    });
}

//add-joint-btn与拖拽方法绑定
function dragJoint() {
    $( "#add-joint-btn" ).bind("mousedown", function (event) {

        if(event.button == 0){
            var draggableDiv = $("#draggableDiv");
            // console.log('x:'+event.pageX+';y:'+event.pageY+';left:'+$(this).parent().offset().left+';top:'+$(this).parent().offset().top);
            $(draggableDiv).css({
                "display": "block",
                "width": joint_width/1.2+"px",
                "height": joint_width/1.2+"px",
                "top": event.pageY-$(this).parent().parent().offset().top-(joint_width/2),
                "left": event.pageX-$(this).parent().parent().offset().left-(joint_width/2),
                // "font-size": joint_width*1.2+"px",
                // "color": joint_color,
                // "border":'0px'
                "border":'2px solid '+joint_color});
            $(draggableDiv).attr('data-eType','joint');

            // var clickElement = "<i class=\"fa fa-square-o\" aria-hidden=\"true\"></i>";
            // $("#draggableDiv").html(clickElement);
            draggableDiv.trigger(event);
        }
        //取消默认行为
        return false;
    });
}

//add-fact-btn与拖拽方法绑定
function dragFact() {
    $( "#add-fact-btn" ).bind("mousedown", function (event) {

        if(event.button == 0){
            var draggableDiv = $("#draggableDiv");
            // console.log('x:'+event.pageX+';y:'+event.pageY+';left:'+$(this).parent().offset().left+';top:'+$(this).parent().offset().top);
            $(draggableDiv).css({
                "display": "block",
                "width": body_width/1.2+"px",
                "height": body_height/1.2+"px",
                "top": event.pageY-$(this).parent().parent().offset().top,
                "left": event.pageX-$(this).parent().parent().offset().left-(body_width/2),
                "border":'2px solid '+fact_color,
                "border-radius":fact_borderRadius/1.2+"px"});
            $(draggableDiv).attr('data-eType','fact');

            draggableDiv.trigger(event);
        }
        //取消默认行为
        return false;
    });
}

//获取鼠标指针坐标
function getMousePosition_Canvas (evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

//获取鼠标相对右侧div位置
function getMousePosition_rdiv(event) {
    var p = $('#canvas').parent().parent();
    // console.log('px:'+p.offset().left+';py:'+p.offset().top);
    // console.log('x:'+event.pageX+';y:'+event.pageY);

    return {
        x: event.pageX - p.offset().left,
        y: event.pageY - p.offset().top
    };
}

//获取新增节点的位置
function getNodePosition(event) {
    return {
        x: event.pageX-$("#canvas").offset().left-scene.translateX,
        y: event.pageY-$("#canvas").offset().top-scene.translateY
    };
}

//处理节点多选不同右键菜单显示
function handleMultipleSelected(event) {
    var nodeList_selected = scene.selectedElements;

    if(nodeList_selected.length<=1)
        return -1;

    var header_num = 0;
    var body_num = 0;
    var link_num = 0;
    var arrow_num = 0;
    var joint_num = 0;
    var fact_num = 0;

    var header_index = [];
    var body_index = [];
    var joint_index = [];
    var fact_index = [];

    for(var i = 0;i<nodeList_selected.length;i++){

        if(nodeList_selected[i].node_type=='header'){
            header_index.push(i);
            header_num++;

        }else if(nodeList_selected[i].node_type=='body'){
            body_index.push(i);
            body_num++;

        }else if(nodeList_selected[i].node_type=='link'){
            link_num++;

        }else if(nodeList_selected[i].node_type=='arrow'){
            arrow_num++;

        }else if(nodeList_selected[i].node_type=='joint'){
            joint_index.push(i);
            joint_num++;

        }else if(nodeList_selected[i].node_type=='fact'){
            fact_index.push(i);
            fact_num++;
        }
    }
    // console.log("header_num:"+header_num+";body_num:"+body_num+";link_num:"+link_num+";arrow_num:"+arrow_num+";joint_num:"+joint_num);

    if(header_num>=1&&body_num==1&&link_num==0&&arrow_num==0&&joint_num==0&&fact_num==0){//多个链头一个链体可以创建连线
        $("#nodeMenu2").css({
            top: getMousePosition_rdiv(event).y,
            left: getMousePosition_rdiv(event).x
        }).show();

        nodeFroms = header_index;
        nodeTo = nodeList_selected[body_index[0]];
        return 1;

    }else if(header_num>=1&&body_num==0&&link_num==0&&arrow_num==0&&joint_num==1&&fact_num==0){//多个链头一个联结点可以创建箭头
        $("#nodeMenu3").css({
            top: getMousePosition_rdiv(event).y,
            left: getMousePosition_rdiv(event).x
        }).show();

        nodeFroms = header_index;
        nodeTo = nodeList_selected[joint_index[0]];
        return 2;

    }else if(header_num==0&&body_num==0&&link_num==0&&arrow_num==0&&joint_num>=1&&fact_num==1) {//多个联结点一个事实节点可以创建连线
        $("#nodeMenu2").css({
            top: getMousePosition_rdiv(event).y,
            left: getMousePosition_rdiv(event).x
        }).show();

        nodeFroms = joint_index;
        nodeTo = nodeList_selected[fact_index[0]];
        return 3;

    } else{
        $("#nodeMenu").css({
            top: getMousePosition_rdiv(event).y,
            left: getMousePosition_rdiv(event).x
        }).show();
        return 0;
    }
}

//处理节点右键菜单显示
function handleNodeMenu(event,type){

    if(event.button == 0) {// 左键
        isNodeClicked_left = true;
    }

    if(event.button == 2){// 右键

        $("#stageMenu").hide();
        $("#nodeMenu").hide();
        $("#nodeMenu2").hide();
        $("#nodeMenu3").hide();
        $("#linkMenu").hide();
        $("#arrowMenu").hide();

        if(handleMultipleSelected(event)<0){

            if(type=='arrow'){
                $("#arrowMenu").css({
                    top: getMousePosition_rdiv(event).y,
                    left: getMousePosition_rdiv(event).x
                }).show();

            }else if(type=='link'){
                $("#linkMenu").css({
                    top: getMousePosition_rdiv(event).y,
                    left: getMousePosition_rdiv(event).x
                }).show();

            }else{
                $("#nodeMenu").css({
                    top: getMousePosition_rdiv(event).y,
                    left: getMousePosition_rdiv(event).x
                }).show();
            }
        }

        isNodeClicked_right = true;

    }
}

//右键菜单方法调用
function bindMenuClick() {
    //新增图元-链头
    $('#add-header-li').click(function (event) {
        $('#stageMenu').hide();
        var nodePosition = getNodePosition(event);
        drawHeader(true,nodePosition.x,nodePosition.y);
    });

    //新增图元-链体
    $('#add-body-li').click(function (event) {
        $('#stageMenu').hide();
        var nodePosition = getNodePosition(event);
        drawBody(true,nodePosition.x,nodePosition.y);
    });

    //新增图元-联结点
    $('#add-joint-li').click(function (event) {
        $('#stageMenu').hide();
        var nodePosition = getNodePosition(event);
        drawJoint(true,nodePosition.x,nodePosition.y);
    });

    //新增图元-事实
    $('#add-fact-li').click(function (event) {
        $('#stageMenu').hide();
        var nodePosition = getNodePosition(event);
        drawFact(true,nodePosition.x,nodePosition.y);
    });

    //创建连线
    $('#add-link-li').click(function () {
        $(this).parent().hide();

        var nodes = [];
        var isFact = false;
        if(nodeTo.node_type=='fact'){
            isFact = true;
        }
        for(var i = 0;i<nodeFroms.length;i++){
            var node;
            if(!isFact){
                node = addLink(nodeTo,scene.selectedElements[nodeFroms[i]]);
            }else{
                node = addLink(scene.selectedElements[nodeFroms[i]],nodeTo);
            }

            if(node!=-1){
                nodes.push(node);
            }
        }

        //添加操作至operationList
        operationList.push({'type':'add','nodes':nodes});
    });

    //创建箭头
    $('#add-arrow-li').click(function () {
        $(this).parent().hide();

        var nodes = [];
        for(var i = 0;i<nodeFroms.length;i++){

            var node = addArrow(scene.selectedElements[nodeFroms[i]],nodeTo);
            if(node!=-1){
                nodes.push(node);
            }
        }

        //添加操作至operationList
        operationList.push({'type':'add','nodes':nodes});
    });

    //复制图元
    $('.copy-element-li').click(function () {
        $(this).parent().hide();

        isCopied = true;
        nodeList_copied = scene.selectedElements.concat();
    });

    //粘贴图元
    $('#paste-element-li').click(function (event) {
        $(this).parent().hide();
        var nodePosition = getNodePosition(event);
        paste(nodePosition.x,nodePosition.y);
    });

    //删除连线
    $('#delete-link-li').click(function () {
        $(this).parent().hide();

        deleteLink(scene.selectedElements[0]);

        //添加操作至operationList
        operationList.push({'type':'delete','nodes':[scene.selectedElements[0]]});
    });

    //删除箭头
    $('#delete-arrow-li').click(function () {
        $(this).parent().hide();

        deleteArrow(scene.selectedElements[0]);

        //添加操作至operationList
        operationList.push({'type':'delete','nodes':[scene.selectedElements[0]]});
    });

    //删除图元
    $('.delete-element-li').click(function () {
        $(this).parent().hide();
        var nodeList_selected = scene.selectedElements;
        var nodes = [];

        for(var i = 0;i<nodeList_selected.length;i++){
            var node = nodeList_selected[i];
            var n = {};
            n['node'] = node;

            if(node.node_type=='header'){
                if(node.outLinks!=null){
                    var outl = node.outLinks;
                    for(var i = 0;i<outl.length;i++){
                        var tmp = {'node':outl[i]};
                        if($.inArray(tmp,nodes)==-1)
                            nodes.push(tmp);
                    }
                }
                if(node.inLinks!=null){
                    var inl = node.inLinks;
                    for(var i = 0;i<inl.length;i++){
                        var tmp = {'node':inl[i]};
                        if($.inArray(tmp,nodes)==-1)
                            nodes.push(tmp);
                    }
                }

                deleteHeader(node.id);

            }else if(node.node_type=='body'){
                if(node.outLinks!=null){
                    var outl = node.outLinks;
                    for(var i = 0;i<outl.length;i++){
                        var tmp = {'node':outl[i]};
                        if($.inArray(tmp,nodes)==-1)
                            nodes.push(tmp);
                    }
                }
                var body = bodyList[node.id];
                n['content'] = {'type':body['type'],'committer':body['committer'],'reason':body['reason'],
                    'conclusion':body['conclusion'], 'documentID':body['documentID'],'isDefendant':body['isDefendant']};
                deleteBody(node.id);

            }else if(node.node_type=='joint'){
                if(node.outLinks!=null){
                    var outl = node.outLinks;
                    for(var i = 0;i<outl.length;i++){
                        var tmp = {'node':outl[i]};
                        if($.inArray(tmp,nodes)==-1)
                            nodes.push(tmp);
                    }
                }
                if(node.inLinks!=null){
                    var inl = node.inLinks;
                    for(var i = 0;i<inl.length;i++){
                        var tmp = {'node':inl[i]};
                        if($.inArray(tmp,nodes)==-1)
                            nodes.push(tmp);
                    }
                }
                deleteJoint(node.id);

            }else if(node.node_type=='fact'){
                if(node.inLinks!=null){
                    var inl = node.inLinks;
                    for(var i = 0;i<inl.length;i++){
                        var tmp = {'node':inl[i]};
                        if($.inArray(tmp,nodes)==-1)
                            nodes.push(tmp);
                    }
                }
                n['content'] = {'logicNodeID':factList[node.id]['logicNodeID'],'textID':factList[node.id]['textID'],
                    'confirm':factList[node.id]['confirm']};
                deleteFact(node.id);

            }else if(node.node_type=='arrow'){
                deleteArrow(node);

            }else if(node.node_type=='link'){
                deleteLink(node);
            }

            nodes.push(n);
        }

        //添加操作至operationList
        operationList.push({'type':'delete','nodes':nodes});
    });
}

//粘贴图元
function paste(mouse_x,mouse_y) {

    var toPasted = nodeList_copied.concat();
    var middleX,middleY = 0;//中心点坐标
    var minX = 10000000;
    var minY = 10000000;
    var maxX = -1;
    var maxY = -1;
    var nodes = [];
    var hs = {};//{old_id:new_id};
    var bs = {};
    var js = {};
    var fs = {};
    // console.log("len:"+toPasted.length);

    for(var i = 0;i<nodeList_copied.length;i++){
        var node = nodeList_copied[i];

        if(node.node_type=='link'){

            var snode = node.nodeA;
            var enode = node.nodeZ;
            var si = $.inArray(snode,toPasted);
            var ei = $.inArray(enode,toPasted);

            if(snode.node_type=='body'){

                if(si>=0&&ei>=0){
                    hs[enode.id] = -1;
                    bs[snode.id] = -1;
                    toPasted.splice(si,1);
                    toPasted.splice($.inArray(enode,toPasted),1);
                }else{
                    if(hs[enode.id]!=null){
                        if(si>=0){
                            bs[snode.id] = -1;
                            toPasted.splice(si,1);
                        }else{
                            if(bs[snode.id]==null||bs[snode.id]==undefined)
                                toPasted.splice($.inArray(node,toPasted),1);
                        }
                    }else{
                        if(ei==-1){
                            toPasted.splice($.inArray(node,toPasted),1);
                        }else{
                            if(bs[snode.id]!=null){
                                hs[enode.id] = -1;
                                toPasted.splice(ei,1);
                            }else{
                                toPasted.splice($.inArray(node,toPasted),1);
                            }
                        }
                    }
                }
            }else if(snode.node_type=='joint'){

                if(si>=0&&ei>=0){
                    js[snode.id] = -1;
                    fs[enode.id] = -1;
                    toPasted.splice(si,1);
                    toPasted.splice($.inArray(enode,toPasted),1);
                }else{
                    if(fs[enode.id]!=null){
                        if(si>=0){
                            js[snode.id] = -1;
                            toPasted.splice(si,1);
                        }else{
                            if(js[snode.id]==null||js[snode.id]==undefined)
                                toPasted.splice($.inArray(node,toPasted),1);
                        }
                    }else{
                        if(ei==-1){
                            toPasted.splice($.inArray(node,toPasted),1);
                        }else{
                            if(js[snode.id]!=null){
                                fs[enode.id] = -1;
                                toPasted.splice(ei,1);
                            }else{
                                toPasted.splice($.inArray(node,toPasted),1);
                            }
                        }
                    }
                }
            }
        }else if(node.node_type=='arrow'){

            var snode = node.nodeA;
            var enode = node.nodeZ;
            var si = $.inArray(snode,toPasted);
            var ei = $.inArray(enode,toPasted);

            if(si>=0&&ei>=0){
                hs[snode.id] = -1;
                js[enode.id] = -1;
                toPasted.splice(si,1);
                toPasted.splice($.inArray(enode,toPasted),1);
            }else{
                if(hs[snode.id]!=null){
                    if(ei>=0){
                        js[enode.id] = -1;
                        toPasted.splice(ei,1);
                    }else{
                        if(js[enode.id]==null||js[enode.id]==undefined)
                            toPasted.splice($.inArray(node,toPasted),1);
                    }
                }else{
                    if(si==-1){
                        toPasted.splice($.inArray(node,toPasted),1);
                    }else{
                        if(js[enode.id]!=null){
                            hs[snode.id] = -1;
                            toPasted.splice(si,1);
                        }else{
                            toPasted.splice($.inArray(node,toPasted),1);
                        }
                    }
                }
            }
        }else{

            if(node.x>maxX){
                maxX = node.x;
            }
            if(node.x<minX){
                minX = node.x;
            }
            if(node.y>maxY){
                maxY = node.y;
            }
            if(node.y<minY){
                minY = node.y;
            }
        }
    }

    middleX = (minX+maxX)/2;
    middleY = (minY+maxY)/2;
    // console.log("len:"+toPasted.length);
    // console.log(middleX+";"+middleY);

    for(var i = 0;i<toPasted.length;i++){
        var node = toPasted[i];

        if(node.node_type=='link'){
            var snode = node.nodeA;
            var enode = node.nodeZ;
            var enew,snew;

            if(snode.node_type=='body'){

                if(bs[snode.id]!=null&&bs[snode.id]!=-1){
                    snew = bodyList[bs[snode.id]]['node'];
                }else{
                    var body = bodyList[snode.id];
                    snew = drawBody(false,snode.x+mouse_x-middleX,snode.y+mouse_y-middleY,null,snode.text,snode.content,body);
                    nodes.push(snew);
                    bs[snode.id] = snew.id;
                }

                if(hs[enode.id]!=null&&hs[enode.id]!=-1){
                    enew = headerList[hs[enode.id]];
                }else{
                    enew = drawHeader(false,enode.x+mouse_x-middleX,enode.y+mouse_y-middleY,null,enode.text,enode.content,enode.keyText);
                    nodes.push(enew);
                    hs[enode.id] = enew.id;
                }
            }else if(snode.node_type=='joint'){

                if(js[snode.id]!=null&&js[snode.id]!=-1){
                    snew = jointList[js[snode.id]];
                }else{
                    snew = drawJoint(false,snode.x+mouse_x-middleX,snode.y+mouse_y-middleY,null,snode.text,snode.content);
                    nodes.push(snew);
                    js[snode.id] = snew.id;
                }

                if(fs[enode.id]!=null&&fs[enode.id]!=-1){
                    enew = factList[fs[enode.id]]['node'];
                }else{
                    enew = drawFact(false,enode.x+mouse_x-middleX,enode.y+mouse_y-middleY,null,enode.text,enode.content,
                        factList[enode.id]['logicNodeID'],factList[enode.id]['textID'],factList[enode.id]['confirm']);
                    nodes.push(enew);
                    fs[enode.id] = enew.id;
                }
            }

            var nl = addLink(snew,enew);
            nodes.push(nl);

        }else if(node.node_type=='arrow'){
            var snode = node.nodeA;
            var enode = node.nodeZ
            var snew;

            var enew = drawJoint(false,enode.x+mouse_x-middleX,enode.y+mouse_y-middleY,null,enode.text,enode.content);

            if(hs[snode.id]!=null&&hs[snode.id]!=-1){
                snew = headerList[hs[snode.id]];
            }else{
                snew = drawHeader(false,snode.x+mouse_x-middleX,snode.y+mouse_y-middleY,null,snode.text,snode.content,snode.keyText);
                nodes.push(snew);
                hs[snode.id] = snew.id;
            }

            var na = addArrow(snew,enew,null,node.text,node.content);
            nodes.push(enew);
            nodes.push(na);

        }else if(node.node_type=='header'){

            var node_new = drawHeader(false,node.x+mouse_x-middleX,node.y+mouse_y-middleY,null,node.text,node.content,node.keyText);
            nodes.push(node_new);

        }else if(node.node_type=='body'){

            var body = bodyList[node.id];
            var node_new = drawBody(false,node.x+mouse_x-middleX,node.y+mouse_y-middleY,null,node.text,node.content,body);
            nodes.push(node_new);

        }else if(node.node_type=='joint'){

            var node_new = drawJoint(false,node.x+mouse_x-middleX,node.y+mouse_y-middleY,null,node.text,node.content);
            nodes.push(node_new);

        }else if(node.node_type=='fact'){

            var node_new = drawFact(false,node.x+mouse_x-middleX,node.y+mouse_y-middleY,null,node.text,node.content,
                factList[node.id]['logicNodeID'],factList[node.id]['textID'],factList[node.id]['confirm']);
            nodes.push(node_new);
        }
    }

    //添加操作至operationList
    operationList.push({'type':'copy','nodes':nodes});
}

//右侧链体、链头、箭头、联结点button绑定
function bindRightPanel() {
    //链体
    $('#body-save-btn').click(function () {
        var bid = $('#body-panel').attr('data-bid');
        bodyList[bid]['node'].text = $('#body-name').val();
        bodyList[bid]['type'] = $('#body-evidenceType').val();
        bodyList[bid]['committer'] = $('#body-committer').val();
        bodyList[bid]['reason'] = $('#body-evidenceReason').val();
        bodyList[bid]['conclusion'] = $('#body-evidenceConclusion').val();
        var con = $('#body-content').val();
        bodyList[bid]['node'].content = con;
        var name = $('#body-name').val();
        if(name==null||name.length==0){
            bodyList[bid]['node'].text = con;
        }

        var filter_content = '.evidence[data-id='+bid+']';
        var p_div = $(filter_content);

        if(p_div!=null&&p_div.length>0){
            if(con==null||con.length==0)
                con = $('#body-name').val();
            p_div.find('.evidence_a').html(con);
        }

        if($('#body-evidenceConclusion').val()==0){
            var binContent = "<div class='checkbox' data-bodyID='"+bid+"'><label>" +
                "<input type=\"checkbox\">" + $('#body-content').val() +
                "</label></div>";
            $("#recycleBin_body").append(binContent);
            updateBody({"id":bid,"caseID":cid,"documentid":bodyList[bid]['documentID'],"name":$('#body-name').val(),
                "body":con,"x":bodyList[bid]['node'].x,"y":bodyList[bid]['node'].y, "type":$('#body-evidenceType').val(),
                "committer":$('#body-committer').val(),"reason":$('#body-evidenceReason').val(),"trust":$('#body-evidenceConclusion').val(),
                "isDefendant":bodyList[bid]['isDefendant'],"logicNodeID":bodyList[bid]['logicNodeID']});

            var divContent = "<div class=\"evidence evidence_splitLine\" data-id='"+bid+"'>" +
                "                            <a data-toggle=\"collapse\" href=\"#heads_chain_"+bid+"\" class=\"evidence_a\">\n" +
                con+"</a>" +
                "                            <div id=\"heads_chain_"+bid+"\" class=\"panel-collapse collapse in\">\n" +
                "                                <div class=\"head_div\">";

            var headLi = [];
            var bnode = bodyList[bid]['node'];
            var boutL = bnode.outLinks;
            if(boutL!=null){
                for(var k = 0;k<boutL.length;k++){
                    var hnode = boutL[k].nodeZ;
                    var hT = {"id":hnode.id,"caseID":cid,"documentid":bodyList[bid]['documentID'],"bodyid":bid,
                        "name":hnode.text,"head":hnode.content,"x":hnode.x,"y":hnode.y};
                    headLi.push(hT);
                    divContent+="<span class=\"head_chain\">"+hnode.content+"</span>";

                    if(hnode.outLinks!=null){
                        var outl = hnode.outLinks;
                        for(var i = 0;i<outl.length;i++){
                            deleteArrow(outl[i]);
                        }
                    }
                    scene.remove(hnode);
                }
            }
            divContent+="</div></div></div>";

            scene.remove(bnode);
            $('#body-panel').attr('hidden', 'hidden');

            var filter_content = '.evidence[data-id='+bid+']';
            var p_div = $(filter_content);

            if(p_div!=null&&p_div.length>0){
                p_div.remove();
            }
            $("#rejection").find(".panel-body").append(divContent);
            updateHeads(headLi);
        }
    });

    $('#body-reset-btn').click(function () {
        var bid = $('#body-panel').attr('data-bid');
        $('#body-name').val(bodyList[bid]['node'].text);
        $('#body-evidenceType').val(bodyList[bid]['type']);
        $('#body-committer').val(bodyList[bid]['committer']);
        $('#body-evidenceReason').val(bodyList[bid]['reason']);
        $('#body-evidenceConclusion').val(bodyList[bid]['conclusion']);
        $('#body-content').val(bodyList[bid]['node'].content);
    });

    $('#body-del-btn').click(function () {
        var bid = $('#body-panel').attr('data-bid');
        if(bodyList[bid]!=null){
            var body = bodyList[bid];
            var cont = {'type':body['type'],'committer':body['committer'],'reason':body['reason'],
                'conclusion':body['conclusion'], 'documentID':body['documentID'],'isDefendant':body['isDefendant']};
            //添加操作至operationList
            operationList.push({'type':'delete','nodes':[{'node':body['node'],'content':cont}]});
            deleteBody(bid);
        }
    });

    //链头
    $('#head-save-btn').click(function () {
        var hid = $('#head-panel').attr('data-hid');
        headerList[hid].text = $('#head-name').val();
        var con = $('#head-content').val();
        headerList[hid].content = con;

        var name = $('#head-name').val();
        if(name==null||name.length==0){
            headerList[hid].text = con;
        }

        var filter_content = '.head_chain[data-id='+hid+']';
        var p_div = $(filter_content);

        if(p_div!=null&&p_div.length>0){
            if(con==null||con.length==0)
                con = $('#head-name').val();
            p_div.html(con);
        }
    });

    $('#head-reset-btn').click(function () {
        var hid = $('#head-panel').attr('data-hid');
        $('#head-name').val(headerList[hid].text);
        $('#head-content').val(headerList[hid].content);
    });

    $('#head-del-btn').click(function () {
        var hid = $('#head-panel').attr('data-hid');
        if(headerList[hid]!=null){
            //添加操作至operationList
            var nodes = [];
            var node = headerList[hid];
            if(node.outLinks!=null){
                var outl = node.outLinks;
                for(var i = 0;i<outl.length;i++){
                    var tmp = {'node':outl[i]};
                    if($.inArray(tmp,nodes)==-1)
                        nodes.push({'node':outl[i]});
                }
            }
            if(node.inLinks!=null){
                var inl = node.inLinks;
                for(var i = 0;i<inl.length;i++){
                    var tmp = {'node':inl[i]};
                    if($.inArray(inl,nodes)==-1)
                        nodes.push({'node':inl[i]});
                }
            }
            operationList.push({'type':'delete','nodes':nodes});
            deleteHeader(hid);
        }
    });

    //箭头
    $('#arrow-save-btn').click(function () {
        var aid = $('#arrow-panel').attr('data-aid');
        arrowList[aid].text = $('#arrow-name').val();
        arrowList[aid].content = $('#arrow-content').val();
    });

    $('#arrow-reset-btn').click(function () {
        var aid = $('#arrow-panel').attr('data-aid');
        $('#arrow-name').val(arrowList[aid].text);
        $('#arrow-content').val(arrowList[aid].content);
    });

    $('#arrow-del-btn').click(function () {
        var aid = $('#arrow-panel').attr('data-aid');
        //添加操作至operationList
        operationList.push({'type':'delete','nodes':[{'node':arrowList[aid]}]});
        deleteArrow(arrowList[aid]);
    });

    //联结点
    $('#joint-save-btn').click(function () {
        var jid = $('#joint-panel').attr('data-jid');
        jointList[jid].text = $('#joint-name').val();
        jointList[jid].content = $('#joint-content').val();
    });

    $('#joint-reset-btn').click(function () {
        var jid = $('#joint-panel').attr('data-jid');
        $('#joint-name').val(jointList[jid].text);
        $('#joint-content').val(jointList[jid].content);
    });

    $('#joint-del-btn').click(function () {
        var jid = $('#joint-panel').attr('data-jid');
        //添加操作至operationList
        operationList.push({'type':'delete','nodes':[{'node':jointList[jid]}]});
        deleteJoint(jid);
    });

    //事实节点
    $('#fact-save-btn').click(function () {
        var fid = $('#fact-panel').attr('data-fid');
        factList[fid]['node'].text = $('#fact-name').val();
        factList[fid]['node'].content = $('#fact-content').val();
        $("#factSelector option[value='"+fid+"']").text($('#fact-name').val());
    });

    $('#fact-reset-btn').click(function () {
        var fid = $('#fact-panel').attr('data-fid');
        $('#fact-name').val(factList[fid]['node'].text);
        $('#fact-content').val(factList[fid]['node'].content);
    });

    $('#fact-del-btn').click(function () {
        var fid = $('#fact-panel').attr('data-fid');
        //添加操作至operationList
        operationList.push({'type':'delete','nodes':[{'node':factList[fid]['node'],
                'content':{'logicNodeID':factList[fid]['logicNodeID'],'textID':factList[fid]['textID'],
                    'confirm':factList[fid]['confirm']}}]});
        deleteFact(fid);
    });
}

//节点悬停效果,isover=1悬停,isover=0 mouseout
function nodeMouseOver(node,isover) {
    if(node!=null){
        var outL = node.outLinks;
        if(outL!=null){
            for(var i = 0;i<outL.length;i++){
                outL[i].isMouseOver = isover;
                outL[i].nodeZ.isMouseOver = isover;
            }
        }
        var inL = node.inLinks;
        if(inL!=null){
            for(var i = 0;i<inL.length;i++){
                inL[i].isMouseOver = isover;
                inL[i].nodeA.isMouseOver = isover;
            }
        }
    }
}

//添加连线(链体，链头，id)/(联结点，事实，id)
function addLink(nodeFrom,nodeTo,id){
    var hasLink = false;

    if(nodeFrom.node_type=='body'){
        if(nodeTo.inLinks!=null&&nodeTo.inLinks.length>0){
            hasLink = true;
        }
    }else if(nodeTo.node_type=='fact'){
        if(nodeFrom.outLinks!=null&&nodeFrom.outLinks.length>0){
            hasLink = true;
        }
    }

    // //判断是否已存在连线
    // if(nodeFrom.outLinks!=null)
    //     for(var i = 0;i<nodeFrom.outLinks.length;i++){
    //         if(nodeFrom.outLinks[i].nodeZ.node_type=='body'){
    //             hasLink = true;
    //             break;
    //         }
    //     }

    if(!hasLink){
        if(id==null)
            id = linkIndex++;

        var link = new JTopo.Link(nodeFrom, nodeTo);
        link.id = id;
        link.lineWidth = 0.7; // 线宽
        // link.dashedPattern = dashedPattern; // 虚线
        link.bundleOffset = 60; // 折线拐角处的长度
        link.bundleGap = 20; // 线条之间的间隔
        // link.textOffsetY = 3; // 文本偏移量（向下3个像素）
        link.strokeColor = 'gray';
        link.node_type = 'link';

        link.addEventListener('mousedown', function(event){
            handleNodeMenu(event,'link');
        });

        link.addEventListener('mouseout', function(){
            isNodeClicked_right = false;
            isNodeClicked_left = false;
        });

        // linkList[link.id] = link;
        scene.add(link);

        if(nodeFrom.node_type=='body')
            addHeaderofChain(nodeTo.text,nodeTo.id,nodeFrom.id);

        return link;
    }

    return -1;
}

//删除连线
function deleteLink(link) {
    // linkList[link.id] = null;
    scene.remove(link);
}

//添加箭头(链头，联结点)，返回箭头节点，未创建返回-1
function addArrow(nodeFrom,nodeTo,id,name,content) {

    // var hasArrow = false;
    //
    // //判断是否已存在箭头
    // if(nodeFrom.outLinks!=null)
    //     for(var i = 0;i<nodeFrom.outLinks.length;i++){
    //         if(nodeFrom.outLinks[i].nodeZ==nodeTo){
    //             hasArrow = true;
    //             break;
    //         }
    //     }

    if(nodeFrom!=null)
    if(nodeFrom.outLinks==null||nodeFrom.outLinks.length==0){
        // if(name==null)
        //     name = '新箭头'+(arrowIndex+1);
        if(id==null)
            id = arrowIndex++;

        var arrow = new JTopo.Link(nodeFrom, nodeTo);
        arrow.id = id;
        arrow.content = content;
        arrow.lineWidth = 0.7; // 线宽
        // arrow.dashedPattern = dashedPattern; // 虚线
        arrow.bundleOffset = 60; // 折线拐角处的长度
        arrow.bundleGap = 20; // 线条之间的间隔
        // arrow.textOffsetY = 3; // 文本偏移量（向下3个像素）
        arrow.strokeColor = 'gray';
        arrow.fontColor = 'black';
        arrow.arrowsRadius = 10;
        arrow.node_type = 'arrow';

        arrowList[arrow.id] = arrow;
        scene.add(arrow);

        arrow.click(function () {
            $('#body-panel').attr('hidden', 'hidden');
            $('#head-panel').attr('hidden', 'hidden');
            $('#joint-panel').attr('hidden', 'hidden');
            $('#fact-panel').attr('hidden', 'hidden');

            $('#arrow-name').val(arrow.text);
            $('#arrow-content').val(arrow.content);
            $('#arrow-panel').removeAttr("hidden");
            $('#arrow-panel').attr('data-aid',arrow.id);
        });

        arrow.addEventListener('mousedown', function(event){
            handleNodeMenu(event,'arrow');
        });

        arrow.addEventListener('mouseout', function(event){
            isNodeClicked_right = false;
            isNodeClicked_left = false;
        });

        return arrow;
    }

    return -1;
}

//删除箭头
function deleteArrow(arrow) {
    arrowList[arrow.id] = null;
    scene.remove(arrow);
    $('#arrow-panel').attr('hidden', 'hidden');
}

//绘制链头，返回链头节点
function drawHeader(isNew,x,y,id,name,content,keyText,isinit){

    if(id==null)
        id = -1;

    if(name==null||name.length==0){
        if(content==null||content.length==0)
            name = '链头'+(++headerIndex);
        else if(content.length>10)
            name = content.substring(0,10);
        else
            name = content;
    }
    if(content==null||content.length==0){
        content = name;
    }

    var circleNode = new JTopo.CircleNode(name);
    circleNode.id = id;
    circleNode.content = content;
    circleNode.radius = header_radius; // 半径
    // circleNode.alpha = 0.7;
    // circleNode.shadow = "true";
    circleNode.fillColor = '255, 255, 255'; // 填充颜色
    circleNode.borderColor = header_color_num;
    circleNode.borderWidth = 2;
    circleNode.borderRadius = header_radius+3;
    circleNode.setLocation(x-header_radius, y-header_radius);
    circleNode.textPosition = 'Bottom_Center'; // 文本位置
    circleNode.node_type = 'header';
    circleNode.keyText = keyText;

    headerList[circleNode.id] = circleNode;
    scene.add(circleNode);
    //添加操作至operationList
    if(isNew==true){
        operationList.push({'type':'add','nodes':[circleNode]});
    }
    if(!isinit){
        saveHead(circleNode);
    }

    circleNode.click(function () {
        $('#body-panel').attr('hidden', 'hidden');
        $('#arrow-panel').attr('hidden', 'hidden');
        $('#joint-panel').attr('hidden', 'hidden');
        $('#fact-panel').attr('hidden', 'hidden');

        $('#head-name').val(circleNode.text);
        $('#head-keySentence').val(circleNode.keyText);
        $('#head-content').val(circleNode.content);
        $('#head-panel').removeAttr("hidden");
        $('#head-panel').attr('data-hid',circleNode.id);

        highlightEvidence(0);
    });

    // circleNode.addEventListener('mouseup', function(event){
    //     handleNodeMenu(event,'header');
    // });
    circleNode.addEventListener('mousedown', function(event){
        // console.log(this.x+"&&"+this.y);
        x_origin = this.x;
        y_origin = this.y;
        sourceNode = this;
        handleNodeMenu(event,'header');
    });

    circleNode.addEventListener('mouseover', function(event){
        nodeMouseOver(this,1);
    });
    circleNode.addEventListener('mouseout', function(event){
        isNodeClicked_right = false;
        isNodeClicked_left = false;
        nodeMouseOver(this,0);
    });

    return circleNode;
}

//删除链头
function deleteHeader(headerID) {
    // header_delete.push(headerID);
    var header = headerList[headerID];

    if(header.outLinks!=null){
        var outl = header.outLinks;
        for(var i = 0;i<outl.length;i++){
            deleteArrow(outl[i]);
        }
    }
    deleteHeadData(headerID);
    scene.remove(header);
    headerList[headerID] = null;
    $('#head-panel').attr('hidden', 'hidden');

    var filter_content = '.head_chain[data-id='+headerID+']';
    var p_div = $(filter_content);

    if(p_div!=null&&p_div.length>0){
        p_div.remove();
    }
}

//绘制链体，返回链体节点
function drawBody(isNew,x,y,id,name,content,detail,isinit){

    if(id==null)
        id = -1;

    if(name==null||name.length==0){
        if(content==null||content.length==0)
            name = '链体'+(++bodyIndex);
        else if(content.length>10)
            name = content.substring(0,10);
        else
            name = content;
    }
    if(content==null||content.length==0){
        content = name;
    }

    var documentID = null;
    var isDefendant = null;
    var conclusion = null;
    var logicNodeID = null;
    var type = 5;
    var committer = "";
    var reason = "";
    if(detail!=null){
        documentID = detail.documentid;
        isDefendant = detail.isDefendant;
        conclusion = detail.trust;
        logicNodeID = detail.logicNodeID;
        type = detail.type;
        committer = detail.committer;
        reason = detail.reason;
    }
    if(documentID==null)
        documentID = -1;
    if(isDefendant==null)
        isDefendant = 1;
    if(conclusion==null)
        conclusion = 1;
    if(logicNodeID==null)
        logicNodeID = -1;

    var node = new JTopo.Node(name);
    node.id = id;
    node.content = content;
    // node.alpha = 0.7;
    node.fillColor = '255, 255, 255'; // 填充颜色
    node.borderColor = body_color_num;
    node.borderWidth = 2;
    node.setSize(body_width,body_height);
    node.setLocation(x-(body_width/2),y-(body_height/2));
    // node.shadow = "true";
    node.textPosition = 'Bottom_Center'; // 文本位置
    node.node_type = 'body';

    bodyList[node.id] = {'node':node,'type':type,'committer':committer,'reason':reason,
        'conclusion':conclusion, 'documentID':documentID,'isDefendant':isDefendant,'logicNodeID':logicNodeID};
    scene.add(node);
    //添加操作至operationList
    if(isNew==true)
        operationList.push({'type':'add','nodes':[node]});
    if(!isinit){
        saveBody(node);
    }

    node.click(function () {
        $('#head-panel').attr('hidden', 'hidden');
        $('#arrow-panel').attr('hidden', 'hidden');
        $('#joint-panel').attr('hidden', 'hidden');
        $('#fact-panel').attr('hidden', 'hidden');

        var bid = node.id;
        $('#body-name').val(node.text);
        $('#body-evidenceType').val(bodyList[bid]['type']);
        $('#body-committer').val(bodyList[bid]['committer']);
        $('#body-evidenceReason').val(bodyList[bid]['reason']);
        $('#body-evidenceConclusion').val(bodyList[bid]['conclusion']);
        $('#body-content').val(bodyList[bid]['node'].content);
        $('#body-panel').removeAttr("hidden");
        $('#body-panel').attr('data-bid',node.id);

        highlightEvidence(0);
    });
    // node.addEventListener('mouseup', function(event){
    //     handleNodeMenu(event,'body');
    // });
    node.addEventListener('mousedown', function(event){
        // console.log(this.x+";"+this.y);
        x_origin = this.x;
        y_origin = this.y;
        sourceNode = this;
        handleNodeMenu(event,'body');
    });
    node.addEventListener('mouseover', function(event){
       nodeMouseOver(this,1);
    });
    node.addEventListener('mouseout', function(event){
        isNodeClicked_right = false;
        isNodeClicked_left = false;
        nodeMouseOver(this,0);
    });

    if(content==null)
        content = name;
    addEvidence(node.id,content,isDefendant);

    return node;
}

//删除链体
function deleteBody(bodyID) {
    // body_delete.push(bodyID);
    deleteBodyData(bodyID);
    scene.remove(bodyList[bodyID]['node']);
    bodyList[bodyID] = null;

    $('#body-panel').attr('hidden', 'hidden');

    var filter_content = '.evidence[data-id='+bodyID+']';
    var p_div = $(filter_content);

    if(p_div!=null&&p_div.length>0){
        p_div.remove();
    }
}

//绘制联结点，返回联结点节点
function drawJoint(isNew,x,y,id,name,content,isinit){

    if(id==null)
        id = -1;

    if(name==null||name.length==0){
        if(content==null||content.length==0)
            name = '联结点'+(++jointIndex);
        else if(content.length>10)
            name = content.substring(0,10);
        else
            name = content;
    }
    if(content==null||content.length==0){
        content = name;
    }

    var node = new JTopo.Node(name);
    node.id = id;
    node.content = content;
    node.fillColor = '255, 255, 255'; // 填充颜色
    node.borderColor = joint_color_num;
    node.borderWidth = 2;
    node.setSize(joint_width,joint_width);
    node.setLocation(x-(joint_width/2),y-(joint_width/2));
    node.shadow = "true";
    node.node_type = 'joint';

    jointList[node.id] = node;
    scene.add(node);
    //添加操作至operationList
    if(isNew)
        operationList.push({'type':'add','nodes':[node]});
    if(!isinit)
        saveJoint(node);

    node.click(function () {
        $('#head-panel').attr('hidden', 'hidden');
        $('#arrow-panel').attr('hidden', 'hidden');
        $('#body-panel').attr('hidden', 'hidden');
        $('#fact-panel').attr('hidden', 'hidden');

        $('#joint-name').val(node.text);
        $('#joint-content').val(node.content);
        $('#joint-panel').removeAttr("hidden");
        $('#joint-panel').attr('data-jid',node.id);
    });

    // node.addEventListener('mouseup', function(event){
    //     handleNodeMenu(event,'joint');
    // });
    node.addEventListener('mousedown', function(event){
        // console.log(this.x+"**"+this.y);
        x_origin = this.x;
        y_origin = this.y;
        sourceNode = this;
        handleNodeMenu(event,'joint');
    });

    node.addEventListener('mouseover', function(event){
        nodeMouseOver(this,1);
    });
    node.addEventListener('mouseout', function(event){
        isNodeClicked_right = false;
        isNodeClicked_left = false;
        nodeMouseOver(this,0);
    });

    return node;
}

//删除联结点
function deleteJoint(jointID) {
    // joint_delete.push(jointID);
    var joint = jointList[jointID];

    if(joint.inLinks!=null){
        var inl = joint.inLinks;
        for(var i = 0;i<inl.length;i++){
            deleteArrow(inl[i]);
        }
    }

    deleteJointData(jointID);
    scene.remove(joint);
    jointList[jointID] = null;
    $('#joint-panel').attr('hidden', 'hidden');
}

//绘制事实，返回事实节点
function drawFact(isNew,x,y,id,name,content,logicNodeID,textID,confirm,isinit) {
    if(id==null)
        id = -1;

    if(name==null||name.length==0){
        if(content==null||content.length==0)
            name = '事实节点'+(++factIndex);
        else if(content.length>10)
            name = content.substring(0,10);
        else
            name = content;
    }
    if(content==null||content.length==0){
        content = name;
    }
    if(logicNodeID==null)
        logicNodeID = -1;
    if(textID==null)
        textID = -1;
    if(confirm==null)
        confirm = 1;

    var node = new JTopo.Node(name);
    node.id = id;
    node.content = content;
    node.fillColor = '255, 255, 255'; // 填充颜色
    node.borderColor = fact_color_num;
    node.borderWidth = 2;
    node.borderRadius = fact_borderRadius;
    node.setSize(body_width,body_height);
    node.setLocation(x-(body_width/2),y-(body_height/2));
    node.shadow = "true";
    node.node_type = 'fact';

    factList[node.id] = {'node':node,'logicNodeID':logicNodeID,'textID':textID,
        'confirm':confirm};
    scene.add(node);
    //添加操作至operationList
    if(isNew)
        operationList.push({'type':'add','nodes':[node]});
    if(!isinit){
        saveFact(node);
    }

    node.click(function () {
        $('#head-panel').attr('hidden', 'hidden');
        $('#arrow-panel').attr('hidden', 'hidden');
        $('#body-panel').attr('hidden', 'hidden');
        $('#joint-panel').attr('hidden', 'hidden');

        $('#fact-name').val(node.text);
        $('#fact-content').val(node.content);
        $('#fact-panel').removeAttr("hidden");
        $('#fact-panel').attr('data-fid',node.id);
    });

    // node.addEventListener('mouseup', function(event){
    //     handleNodeMenu(event,'fact');
    // });
    node.addEventListener('mousedown', function(event){
        // console.log(this.x+"**"+this.y);
        x_origin = this.x;
        y_origin = this.y;
        sourceNode = this;
        handleNodeMenu(event,'fact');
    });

    node.addEventListener('mouseover', function(event){
        nodeMouseOver(this,1);
    });
    node.addEventListener('mouseout', function(event){
        isNodeClicked_right = false;
        isNodeClicked_left = false;
        nodeMouseOver(this,0);
    });

    return node;
}

//删除事实节点
function deleteFact(factID) {
    // fact_delete.push(factID);
    var fact = factList[factID]['node'];

    deleteFactData(factID);
    scene.remove(fact);
    factList[factID] = null;
    $('#fact-panel').attr('hidden', 'hidden');
    updateFactListofGraph();
}

//点击图元左侧列表相应证据高亮
function highlightEvidence(type) {
    $('.evidence').css('background-color', 'white');
    $('.evidence_plaintiff').css('background-color', '#5ed7e5');
    var nodeList_selected = [];
    if(type==0)
        nodeList_selected = scene.selectedElements;
    if(type==1)
        nodeList_selected = scene_sketch.selectedElements;

    if(nodeList_selected.length>=1){

        for(var i = 0;i<nodeList_selected.length;i++){

            if(nodeList_selected[i].node_type=='header'){
                if(nodeList_selected[i].inLinks!= null){
                    var hid = nodeList_selected[i].id;
                    var filter_content = '.head_chain[data-id='+hid+']';
                    var e_div = $(filter_content);

                    e_div.css('background-color', 'yellow');
                }
            }

            if(nodeList_selected[i].node_type=='body'){
                var bid = nodeList_selected[i].id;
                var filter_content = '.evidence[data-id='+bid+']';
                var e_div = $(filter_content);

                e_div.css('background-color', 'yellow');
                e_div.find('.head_chain').css('background-color', 'yellow');
            }
        }
    }
}

//初始化右侧建模图
function initGraph(trusts,freeHeaders,facts,freeJoints,arrows) {

    var x = 10 + (body_width/2);
    var y = 10 + header_radius;

    var pre_bx = -1;
    var pre_by = -1;
    var pre_hx = -1;
    var pre_hy = -1;
    var pre_jx = -1;
    var pre_jy = -1;
    var pre_fx = -1;
    var pre_fy = -1;

    for(var i = 0;i<trusts.length;i++){
        var body = trusts[i]['body'];
        var b_x = body['x'];
        var b_y = body['y'];

        if(b_x<=0){
            if(pre_bx>=0){
                b_x = pre_bx;
            }else{
                b_x = x;
            }
        }
        pre_bx = b_x;

        if(b_y<=0){
            if(pre_by>=0){
                b_y = pre_by + body_height + headerGap_y;
            }else{
                b_y = y;
                y+=body_height + headerGap_y;
            }
        }
        pre_by = b_y;
        var b = drawBody(false,b_x,b_y,body['id'],body['name'],body['body'],body,true);

        var headers = trusts[i]['headers'];
        for(var j = 0;j<headers.length;j++){
            var header = headers[j];
            var h_x = header['x'];
            var h_y = header['y'];

            if(h_x<=0){
                if(pre_hx>=0){
                    h_x = pre_hx;
                }else{
                    h_x = x + body_width/2 + headerGap_x + header_radius;
                }
            }
            pre_hx = h_x;

            if(h_y<=0){
                if(pre_hy>=0){
                    h_y = pre_hy + headerGap_y + (header_radius*2);
                }else{
                    h_y = y;
                    y += headerGap_y + (header_radius*2);
                }
            }
            pre_hy = h_y;

            var h = drawHeader(false,h_x,h_y,header['id'],header['name'],header['head'],header['keyText'],true);
            addLink(b,h);

            if(headerIndex<header['id']){
                headerIndex = header['id']+1;
            }
        }

        if(bodyIndex<body['id']){
            bodyIndex = body['id']+1;
        }
    }

    for(var i = 0;i<freeHeaders.length;i++){
        var header = freeHeaders[i];
        var h_x = header['x'];
        var h_y = header['y'];

        if(h_x<=0){
            if(pre_hx>=0){
                h_x = pre_hx;
            }else{
                h_x = x + body_width/2 + headerGap_x + header_radius;
            }
        }
        pre_hx = h_x;

        if(h_y<=0){
            if(pre_hy>=0){
                h_y = pre_hy + headerGap_y + (header_radius*2);
            }else{
                h_y = y;
                y += headerGap_y + (header_radius*2);
            }
        }
        pre_hy = h_y;

        drawHeader(false,h_x,h_y,header['id'],header['name'],header['head'],header['keyText'],true);

        if(headerIndex<header['id']){
            headerIndex = header['id']+1;
        }
    }

    y = 10 + header_radius;
    x+=body_width/2 + headerGap_x + header_radius;
    for(var i = 0;i<facts.length;i++){
        var fact = facts[i]['fact'];

        if(fact['confirm']==1){
            var f_x = fact['x'];
            var f_y = fact['y'];

            if(f_x<=0){
                if(pre_fx>=0){
                    f_x = pre_fx;
                }else{
                    f_x = x + header_radius + jointGap + joint_width/2 + body_width/2 + headerGap_x + (joint_width/2);
                }
            }
            pre_fx = f_x;

            if(f_y<=0){
                if(pre_fy>=0){
                    f_y = pre_jy + body_height + headerGap_y;
                }else{
                    f_y = y;
                    y+=joint_width + headerGap_y;
                }
            }
            pre_fy = f_y;

            var fnode = drawFact(false,f_x,f_y,fact['id'],fact['name'],fact['content'],fact['logicNodeID'],fact['textID'],fact['confirm'],true);

            var joints = facts[i]['joints'];
            for(var j = 0;j<joints.length;j++){
                var joint = joints[j];
                var j_x = joint['x'];
                var j_y = joint['y'];

                if(j_x<=0){
                    if(pre_jx>=0){
                        j_x = pre_jx;
                    }else{
                        j_x = x + header_radius + jointGap + joint_width/2;
                    }
                }
                pre_jx = j_x;

                if(j_y<=0){
                    if(pre_jy>=0){
                        j_y = pre_jy + joint_width + headerGap_y;
                    }else{
                        j_y = y;
                        y+=joint_width + headerGap_y;
                    }
                }
                pre_jy = j_y;

                var jnode = drawJoint(false,j_x,j_y,joint['id'],joint['name'],joint['content'],true);
                addLink(jnode,fnode);

                if(jointIndex<joint['id']){
                    jointIndex = joint['id']+1;
                }
            }
        }

        if(factIndex<fact['id']){
            factIndex = fact['id']+1;
        }
    }

    for(var i = 0;i<freeJoints.length;i++){
        var joint = freeJoints[i];
        var j_x = joint['x'];
        var j_y = joint['y'];

        if(j_x<=0){
            if(pre_jx>=0){
                j_x = pre_jx;
            }else{
                j_x = x + header_radius + jointGap + joint_width/2;
            }
        }
        pre_jx = j_x;

        if(j_y<=0){
            if(pre_jy>=0){
                j_y = pre_jy + joint_width + headerGap_y;
            }else{
                j_y = y;
                y+=joint_width + headerGap_y;
            }
        }
        pre_jy = j_y;

        drawJoint(false,j_x,j_y,joint['id'],joint['name'],joint['content'],true);

        if(jointIndex<joint['id']){
            jointIndex = joint['id']+1;
        }
    }

    for(var i = 0;i<arrows.length;i++){
        var arrow = arrows[i];
        if(headerList[arrow['nodeFrom_hid']]!=null&&jointList[arrow['nodeTo_jid']]!=null)
            addArrow(headerList[arrow['nodeFrom_hid']],jointList[arrow['nodeTo_jid']],arrow['id'],arrow['name'],arrow['content']);
    }

    updateFactListofGraph();
}

//排版
function typeSetting() {
    var nodes = [];
    var x = 10 + (body_width/2);
    var y = 10 + header_radius;

    for(var bid in bodyList){
        if(bodyList[bid]!=null){
            var body = bodyList[bid]['node'];
            var ox = body.x;
            var oy = body.y;
            body.x = x;

            var outLinks = body.outLinks;
            if(outLinks!=null&&outLinks.length>0)
                body.y = y+((outLinks.length-1)*(2*header_radius + headerGap_y)/2);
            else{
                y+=body_height + headerGap_y;
                body.y = y;
            }

            nodes.push({'node':body,'x':ox,'y':oy});

            if(outLinks!=null&&outLinks.length>0){
                for (var i = 0; i < outLinks.length; i++) {
                    var header = outLinks[i].nodeZ;
                    var hox = header.x;
                    var hoy = header.y;
                    header.x = x + body_width / 2 + headerGap_x + header_radius;
                    header.y = y;
                    y += headerGap_y + (header_radius * 2);

                    nodes.push({'node': header, 'x': hox, 'y': hoy});
                }
            }
        }
    }

    x+=body_width/2 + headerGap_x + header_radius;
    for(var hid in headerList){
        if(headerList[hid]!=null){
            var header = headerList[hid];
            if(header.inLinks==null||header.inLinks.length==0){
                var hox = header.x;
                var hoy = header.y;
                header.x = x;
                header.y = y;
                y += headerGap_y + (header_radius*2);

                nodes.push({'node':header,'x':hox,'y':hoy});
            }
        }
    }

    y = 10 + header_radius;
    for(var fid in factList){
        if(factList[fid]!=null){
            var fact = factList[fid]['node'];
            var ox = fact.x;
            var oy = fact.y;
            fact.x = x + header_radius + jointGap + joint_width/2 + body_width/2 + headerGap_x + (joint_width/2);

            var inLinks = fact.inLinks;
            if(inLinks!=null&&inLinks.length>0)
                fact.y = y+((inLinks.length-1)*(joint_width + headerGap_y)/2);
            else{
                y+=body_height + headerGap_y;
                fact.y = y;
            }
            nodes.push({'node':fact,'x':ox,'y':oy});

            if(inLinks!=null&&inLinks.length>0){
                for(var i = 0;i<inLinks.length;i++){
                    var joint = inLinks[i].nodeA;
                    var jox = joint.x;
                    var joy = joint.y;
                    joint.x = x + header_radius + jointGap + joint_width/2;
                    joint.y = y;
                    y += headerGap_y + joint_width;

                    nodes.push({'node':joint,'x':jox,'y':joy});
                }
            }
        }
    }

    x += header_radius + jointGap + joint_width/2;
    for(var jid in jointList){
        if(jointList[jid]!=null) {
            var joint = jointList[jid];
            if (joint.inLinks == null || joint.inLinks.length == 0) {
                var jox = joint.x;
                var joy = joint.y;
                joint.x = x;
                joint.y = y;
                y += headerGap_y + joint_width;

                nodes.push({'node': joint, 'x': jox, 'y': joy});
            }
        }
    }

    // t = 0;
    // y = 10 + header_radius;
    // for(var jid in jointList){
    //     if(jointList[jid]!=null){
    //         var joint = jointList[jid]['node'];
    //         var ox = joint.x;
    //         var oy = joint.y;
    //         joint.x = x + header_radius + jointGap + joint_width/2;
    //         var y_max = 0;
    //         var y_min = 10000000;
    //         var inLinks = joint.inLinks;
    //
    //         if(inLinks!=null&&inLinks.length>0){
    //             for(var i = 0;i<inLinks.length;i++){
    //                 var header = inLinks[i].nodeA;
    //                 if(header.y>y_max){
    //                     y_max = header.y;
    //                 }
    //                 if(header.y<y_min){
    //                     y_min = header.y;
    //                 }
    //             }
    //             joint.y = (y_min + y_max)/2;
    //             y = joint.y;
    //         }else{
    //             y += joint_width + headerGap_y;
    //             joint.y = y;
    //         }
    //         t++;
    //         nodes.push({'node':joint,'x':ox,'y':oy});
    //     }
    // }
    //
    // t = 0;
    // y = 10 + header_radius;
    // x+=header_radius + jointGap + joint_width/2;
    // for(var fid in factList){
    //     if(factList[fid]!=null){
    //         var fact = factList[fid]['node'];
    //         var ox = fact.x;
    //         var oy = fact.y;
    //         fact.x = x + body_width/2 + headerGap_x + (joint_width/2);
    //         var y_max = 0;
    //         var y_min = 10000000;
    //         var inLinks = fact.inLinks;
    //
    //         if(inLinks!=null&&inLinks.length>0){
    //             for(var i = 0;i<inLinks.length;i++){
    //                 var joint = inLinks[i].nodeA;
    //                 if(joint.y>y_max){
    //                     y_max = joint.y;
    //                 }
    //                 if(joint.y<y_min){
    //                     y_min = joint.y;
    //                 }
    //             }
    //             fact.y = (y_min + y_max)/2;
    //             y = fact.y;
    //         }else{
    //             y+=body_height + headerGap_y;
    //             fact.y = y;
    //         }
    //         t++;
    //         nodes.push({'node':fact,'x':ox,'y':oy});
    //     }
    // }

    operationList.push({'type':'typesetting','nodes':nodes});
}