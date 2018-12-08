
var sketchBodyList = {};//存储链体，{id:node}
var sketchFactList = {};//存储事实节点，{id:node}
var sketchOperationList = [];//存储每一步操作，[{'type':'add/copy','nodes':[]},{'type':'move','nodes':[],'position_origin':[x,y]},
// {'type':'delete','nodes':[{'node':node,'content':{'',''}}]},{'type':'typesetting','nodes':[{'node':node,'x':x,'y':y}]}]
var x_origin_sketch,y_origin_sketch = 0;//拖拽节点的初始位置
var tranX_scene_sketch,tranY_scene_sketch = 0;//拖拽场景的初始位置
// var x_now,y_now = 0;
var sourceNode_sketch;//拖拽节点（当选中多个节点进行拖拽时，鼠标拖拽的节点即参照节点）

$(document).ready(function(){

    canvas_sketch = document.getElementById('canvas-sketch');
    stage_sketch = new JTopo.Stage(canvas_sketch); // 创建一个舞台对象
    scene_sketch = new JTopo.Scene(stage_sketch); // 创建一个场景对象
    stage_sketch.mode = "normal";
    oContext_sketch = canvas_sketch.getContext("2d");
    stage_sketch.wheelZoom = null;
    
    stage_sketch.addEventListener("mousedown", function(event){
        console.log("mouse down");

        tranX_scene_sketch = scene_sketch.translateX;
        tranY_scene_sketch = scene_sketch.translateY;
        // console.log(tranX_scene+'@@'+tranY_scene);
    });

    stage_sketch.addEventListener("mouseup", function(event){
        console.log("mouse up");

        if(event.button == 2){
            console.log ('松开右键');

        }

        if(event.button == 0){
            console.log ( '松开左键');
           addMoveOperations_sketch();
        }
    });

    stage_sketch.addEventListener("mousemove", function(event){
        
    },false);

    this.addEventListener("keydown", function(event){
        if(event.ctrlKey == true){
            
        }
    });
    this.addEventListener("keyup", function(event){
    });

    $("#boxSelection-sketch").change(function() {

        if($(this).is(':checked')==true){
            stage_sketch.mode = "select";
            
        }else{
            stage_sketch.mode = "normal";
        }
    });

    $('#zoomOut-sketch-btn').click(function () {
        stage_sketch.zoomOut(0.85);
        scene_sketch.translateToCenter();
        $("#canvasDiv-sketch").scrollLeft((canvas_sketch.width-$("#canvasDiv-sketch").width())/2);
        $("#canvasDiv-sketch").scrollTop((canvas_sketch.height-$("#canvasDiv-sketch").height())/2);
    });
    $('#zoomIn-sketch-btn').click(function () {
        stage_sketch.zoomIn(0.85);
        scene_sketch.translateToCenter();
        $("#canvasDiv-sketch").scrollLeft((canvas_sketch.width-$("#canvasDiv-sketch").width())/2);
        $("#canvasDiv-sketch").scrollTop((canvas_sketch.height-$("#canvasDiv-sketch").height())/2);
    });

    $('#save-sketch-btn').click(function () {
        saveSketchList(getSketchList(),false);
    });
    $('#saveImg-sketch-btn').click(function () {
        stage_sketch.saveImageInfo(undefined, undefined, "证据链模型简图");
    });
    
    $('#revoke-sketch-btn').click(function () {
        undo_sketch();
    });

    $('#layout-sketch-btn').click(function () {
        typeSetting_sketch();
    });

    bindRightPanel_sketch();
});

function generateSketch() {
    emptySketch();
    var sketchList = [];
    var x = 30 + (body_width/2);
    var y1 = 30 + header_radius;
    var y2 = 30 + header_radius;

    for(var bid in bodyList){
        if(bodyList[bid]!=null){

            var body = bodyList[bid]['node'];
            var outLinks = body.outLinks;
            var iList = [];

            if(outLinks!=null) {
                for (var i = 0; i < outLinks.length; i++) {

                    var header = outLinks[i].nodeZ;
                    if(header.outLinks != null && header.outLinks.length > 0) {

                        var joint = header.outLinks[0].nodeZ;
                        if (joint.outLinks != null && joint.outLinks.length > 0) {

                            var fact = joint.outLinks[0].nodeZ;
                            var fid = fact.id;
                            if (factList[fid]!=null&&iList.indexOf(fid) < 0) {

                                iList.push(fid);
                                if(sketchBodyList[bid]==null){
                                    drawBody_sketch(false,x,y1,bid);
                                    y1+=body_height + headerGap_y;
                                }
                                if(sketchFactList[fid]==null){
                                    drawFact_sketch(false,x+(body_width*4),y2,fid);
                                    y2+=body_height + headerGap_y*2;
                                }
                                addLink_sketch(sketchBodyList[bid],sketchFactList[fid]);
                                sketchList.push({'caseID':cid,'bodyID':bid,'factID':fid});
                            }
                        }
                    }
                }
            }
        }
    }
    // typeSetting_sketch();
    saveSketchList(sketchList,true);
}

function getSketchList() {
    var sketchList = [];

    for(var bid in sketchBodyList){
        var body = sketchBodyList[bid];
        if(body!=null){
            var outlinks = body.outLinks;
            if(outlinks!=null&&outlinks.length>0){
                for(var i = 0;i<outlinks.length;i++){
                    var fid = outlinks[i].nodeZ.id;
                    sketchList.push({'caseID':cid,'bodyID':bid,'factID':fid});
                }
            }else{
                sketchList.push({'caseID':cid,'bodyID':bid,'factID':-1});
            }
        }
    }
    for(var fid in sketchFactList){
        var fact = sketchFactList[fid];
        if(fact!=null)
            if(fact.inLinks==null||fact.inLinks.length<=0){
                sketchList.push({'caseID':cid,'bodyID':-1,'factID':fid});
            }
    }
    return sketchList;
}

function saveSketchList(sketchList,isAsync) {
    if(sketchList.length<=0){
        sketchList = [{'caseID':cid,'bodyID':-1,'factID':-1}];
    }
    if(isAsync){
        $.ajax({
            type: "post",
            url: "/ecm/model/saveSketchList",
            data: JSON.stringify(sketchList),
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

            }, error: function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });
    }else {
        $('body').loading({
            loadingWidth:240,
            title:'保存中',
            name:'saveSketch',
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
            url: "/ecm/model/saveSketchList",
            data: JSON.stringify(sketchList),
            // dataType:"json",
            contentType: "application/json; charset=utf-8",
            // async: true,

            success: function (data) {
                var cpt = $(".cpt-loading-mask[data-name='saveSketch']");
                cpt.find('.loading').html("<span><i class='fa fa-check' style='font-size: 16px;'></i></span>");
                cpt.find('.loading-title').html("保存成功");
                setTimeout(function(){
                    removeLoading('save');
                },1000);
            }, error: function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });
    }
}

function emptySketch() {
    for(var bid in sketchBodyList){
        deleteBody_sketch(bid);
    }
    for (var fid in sketchFactList){
        deleteFact_sketch(fid);
    }
}

function bindRightPanel_sketch() {
    //链体
    $('#body-sketch-save-btn').click(function () {
        var bid = $('#body-sketch-panel').attr('data-bid');
        var name = $('#body-sketch-name').val();
        // bodyList[bid]['node'].text = $('#body-sketch-name').val();
        bodyList[bid]['type'] = $('#body-sketch-evidenceType').val();
        bodyList[bid]['committer'] = $('#body-sketch-committer').val();
        bodyList[bid]['reason'] = $('#body-sketch-evidenceReason').val();
        // bodyList[bid]['conclusion'] = $('#body-sketch-evidenceConclusion').val();
        var con = $('#body-sketch-content').val();
        bodyList[bid]['node'].content = con;

        if(name==null||name.length==0){
            bodyList[bid]['node'].text = con;
        }

        sketchBodyList[bid].text = name;
        sketchBodyList[bid].content = con;

        var filter_content = '.evidence[data-id='+bid+']';
        var p_div = $(filter_content);

        if(p_div!=null&&p_div.length>0){
            if(con==null||con.length==0)
                con = name;
            p_div.find('.evidence_a').html(con);
        }
    });

    $('#body-sketch-reset-btn').click(function () {
        var bid = $('#body-sketch-panel').attr('data-bid');
        $('#body-sketch-name').val(bodyList[bid]['node'].text);
        $('#body-sketch-evidenceType').val(bodyList[bid]['type']);
        $('#body-sketch-committer').val(bodyList[bid]['committer']);
        $('#body-sketch-evidenceReason').val(bodyList[bid]['reason']);
        // $('#body-sketch-evidenceConclusion').val(bodyList[bid]['conclusion']);
        $('#body-sketch-content').val(bodyList[bid]['node'].content);
    });

    //事实节点
    $('#fact-sketch-save-btn').click(function () {
        var fid = $('#fact-sketch-panel').attr('data-fid');
        var fname = $('#fact-sketch-name').val();
        var fcon = $('#fact-sketch-content').val();
        factList[fid]['node'].text = fname;
        factList[fid]['node'].content = fcon;

        sketchFactList[fid].text = fname;
        sketchFactList[fid].content = fcon;
        $("#factSelector option[value='"+fid+"']").text(fname);
    });

    $('#fact-sketch-reset-btn').click(function () {
        var fid = $('#fact-sketch-panel').attr('data-fid');
        $('#fact-sketch-name').val(factList[fid]['node'].text);
        $('#fact-sketch-content').val(factList[fid]['node'].content);
    });
}

//添加连线(链体，事实，id)
function addLink_sketch(nodeFrom,nodeTo){
    var hasLink = false;

    //判断是否已存在连线
    if(nodeFrom.outLinks!=null)
        for(var i = 0;i<nodeFrom.outLinks.length;i++){
            if(nodeFrom.outLinks[i].nodeZ==nodeTo){
                hasLink = true;
                break;
            }
        }

    if(!hasLink){
        var link = new JTopo.Link(nodeFrom, nodeTo);
        // link.id = id;
        link.lineWidth = 0.7; // 线宽
        // link.dashedPattern = dashedPattern; // 虚线
        link.bundleOffset = 60; // 折线拐角处的长度
        link.bundleGap = 20; // 线条之间的间隔
        // link.textOffsetY = 3; // 文本偏移量（向下3个像素）
        link.strokeColor = 'gray';
        link.node_type = 'link';

        scene_sketch.add(link);

        return link;
    }

    return -1;
}

//删除连线
function deleteLink_sketch(link) {
    scene_sketch.remove(link);
}

//绘制链体，返回链体节点
function drawBody_sketch(isNew,x,y,id,isinit){
    
    if(id!=null){
        var name = bodyList[id].node.text;
        var content = bodyList[id].node.content;
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

        sketchBodyList[id] = node;
        scene_sketch.add(node);

        //添加操作至operationList
        if(isNew==true)
            sketchOperationList.push({'type':'add','nodes':[node]});

        node.click(function () {
            $('#fact-sketch-panel').attr('hidden', 'hidden');
            
            var bid = node.id;
            $('#body-sketch-name').val(node.text);
            $('#body-sketch-evidenceType').val(bodyList[bid]['type']);
            $('#body-sketch-committer').val(bodyList[bid]['committer']);
            $('#body-sketch-evidenceReason').val(bodyList[bid]['reason']);
            $('#body-sketch-evidenceConclusion').val(bodyList[bid]['conclusion']);
            $('#body-sketch-content').val(bodyList[bid]['node'].content);
            $('#body-sketch-panel').removeAttr("hidden");
            $('#body-sketch-panel').attr('data-bid',bid);

            highlightEvidence(1);
        });

        node.addEventListener('mousedown', function(event){
            // console.log(this.x+";"+this.y);
            x_origin_sketch = this.x;
            y_origin_sketch = this.y;
            sourceNode_sketch = this;
        });

        node.addEventListener('mouseover', function(event){
            nodeMouseOver(this,1);
        });
        node.addEventListener('mouseout', function(event){
            nodeMouseOver(this,0);
        });
        return node;
    }
    return null;
}

//删除链体
function deleteBody_sketch(bodyID) {
    scene_sketch.remove(sketchBodyList[bodyID]);
    sketchBodyList[bodyID] = null;
    $('#body-sketch-panel').attr('hidden', 'hidden');
}

//绘制事实，返回事实节点
function drawFact_sketch(isNew,x,y,id,isinit) {
    if(id!=null){
        var node = new JTopo.Node(factList[id].node.text);
        node.id = id;
        node.content = factList[id].node.content;
        node.fillColor = '255, 255, 255'; // 填充颜色
        node.borderColor = fact_color_num;
        node.borderWidth = 2;
        node.borderRadius = fact_borderRadius;
        node.setSize(body_width,body_height);
        node.setLocation(x-(body_width/2),y-(body_height/2));
        node.shadow = "true";
        node.node_type = 'fact';

        sketchFactList[node.id] = node;
        scene_sketch.add(node);
        //添加操作至operationList
        if(isNew)
            sketchOperationList.push({'type':'add','nodes':[node]});

        node.click(function () {
            $('#body-panel').attr('hidden', 'hidden');

            $('#fact-sketch-name').val(node.text);
            $('#fact-sketch-content').val(node.content);
            $('#fact-sketch-panel').removeAttr("hidden");
            $('#fact-sketch-panel').attr('data-fid',node.id);
        });

        node.addEventListener('mousedown', function(event){
            // console.log(this.x+";"+this.y);
            x_origin_sketch = this.x;
            y_origin_sketch = this.y;
            sourceNode_sketch = this;
        });

        node.addEventListener('mouseover', function(event){
            nodeMouseOver(this,1);
        });
        node.addEventListener('mouseout', function(event){
            nodeMouseOver(this,0);
        });
        return node;
    }
    return null;
}

//删除事实节点
function deleteFact_sketch(factID) {
    scene_sketch.remove(sketchFactList[factID]);
    sketchFactList[factID] = null;
    $('#fact-sketch-panel').attr('hidden', 'hidden');
}

//将移动操作加入operationList
function addMoveOperations_sketch() {
    var x_now,y_now;
    var nodeList_selected = scene_sketch.selectedElements;

    if(nodeList_selected.length==0){
        x_now = scene_sketch.translateX;
        y_now = scene_sketch.translateY;
        if(x_now!=tranX_scene_sketch||y_now!=tranY_scene_sketch)
            sketchOperationList.push({'type':'move','nodes':null,'position_origin':[tranX_scene_sketch,tranY_scene_sketch]});

    }else{
        if(sourceNode_sketch!=null){
            x_now = sourceNode_sketch.x;
            y_now = sourceNode_sketch.y;
            if(x_now!=x_origin_sketch||y_now!=y_origin_sketch)
                sketchOperationList.push({'type':'move','nodes':nodeList_selected,'position_origin':[x_origin_sketch,y_origin_sketch],'source':sourceNode_sketch});
        }
    }
}

//撤销
function undo_sketch() {
    if(sketchOperationList.length<=0)
        return -1;

    var operation = sketchOperationList.pop();

    if(operation['type']=='move'){
        if(operation['nodes']==null){
            scene_sketch.translateX = operation['position_origin'][0];
            scene_sketch.translateY = operation['position_origin'][1];
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

//初始化
function initSketch(sketchList) {
    var x = 30 + (body_width/2);
    var y1 = 30 + header_radius;
    var y2 = 30 + header_radius;

    for(var i = 0;i<sketchList.length;i++){
        var bid = sketchList[i]['bodyID'];
        var fid = sketchList[i]['factID'];

        if(bid>=0&&sketchBodyList[bid]==null){
            drawBody_sketch(false,x,y1,bid);
            y1+=body_height + headerGap_y;
        }
        if(fid>=0&&sketchFactList[fid]==null){
            drawFact_sketch(false,x+(body_width*4),y2,fid);
            y2+=body_height + headerGap_y*2;
        }
        if(bid>=0&&fid>=0)
            addLink_sketch(sketchBodyList[bid],sketchFactList[fid]);
    }
}

//排版
function typeSetting_sketch() {
    var nodes = [];
    var x = body_width*1.5;
    var y = body_height*2;
    var body_num = 0;

    for(var bid in sketchBodyList){
        if(sketchBodyList[bid]!=null){
            var body = sketchBodyList[bid];
            var ox = body.x;
            var oy = body.y;
            body.x = x;
            body.y = y;
            y+=body_height*3;
            body_num++;

            nodes.push({'node':body,'x':ox,'y':oy});
        }
    }

    x += body_width*5.5;
    y = body_height*4;

    var fyList = [];
    for(var fid in sketchFactList){
        if(sketchFactList[fid]!=null) {
            var fact = sketchFactList[fid];
            var fox = fact.x;
            var foy = fact.y;
            fact.x = x;

            var inLinks = fact.inLinks;
            if(inLinks!=null&&inLinks.length>0){
                var fbnum = inLinks.length;
                var ytmp = (inLinks[0].nodeA.y+inLinks[fbnum-1].nodeA.y)/2;
                if(checkFactY(fyList,ytmp)) {
                    fact.y = ytmp;
                }else {
                    fact.y = ytmp+y;
                    y += body_height*4;
                }
                fyList.push(y);
            }else{
                fact.y = y;
                fyList.push(y);
                y += body_height*4;
            }

            nodes.push({'node': fact, 'x': fox, 'y': foy});
        }
    }

    sketchOperationList.push({'type':'typesetting','nodes':nodes});
}

function checkFactY(fyList,y) {
    for(var i = 0;i<fyList.length;i++){
        if(y<=fyList[i]+2*body_height&&y>=fyList[i]-2*body_height)
            return false;
    }

    return true;
}
