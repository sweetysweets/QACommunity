$(function(){
    var cid = $.session.get('cid');
    var username = $.session.get('username');
    $('#userLabel').text(username.substring(0,1)+"法官");

    $('#exist_click').click(function () {
        if(confirm('是否确认退出？'))
        {
            $.session.remove('username');
            window.location.href = '/ecm/login';
        }
    });

    $.ajax({
        url: "/ecm/text/getTextContent",
        type: 'POST',
        // dataType:"json",
        data: {"caseID": cid},
        beforeSend: function (data) {
            //这里判断，如果没有加载数据，会显示loading
            if (data.readyState == 0) {

            }
        },
        success: function (data) {
            // console.log(data);
            $('#evidencePara').text(data["evidence"]);
            $('#factPara').text(data["fact"]);
            $('#resultPara').text(data["result"]);

        }, error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });




});
function edit(){
    $('#evidencePara').attr("contenteditable",true);
    $('#factPara').attr("contenteditable",true);
    $('#resultPara').attr("contenteditable",true);
}
function downloadWord() {
    var cid=$.session.get('cid');
    var evidence=$("#evidencePara").text();
    var fact=$("#factPara").text();
    var result=$("#resultPara").text();
    var url="/ecm/text/exportWord?cid="+cid+"&evidence="+evidence+"&fact="+fact+"&result="+result;
    window.location.href=url;
}
function downloadPDF() {
    var cid=$.session.get('cid');
    var evidence=$("#evidencePara").text();
    var fact=$("#factPara").text();
    var result=$("#resultPara").text();
    var url="/ecm/text/exportPDF?cid="+cid+"&evidence="+evidence+"&fact="+fact+"&result="+result;
    window.location.href=url;
}
function update(){
    $('#evidencePara').attr("contenteditable",false);
    $('#factPara').attr("contenteditable",false);
    $('#resultPara').attr("contenteditable",false);
    var cid=$.session.get('cid');
    var evidence=$("#evidencePara").text();
    var fact=$("#factPara").text();
    var result=$("#resultPara").text();

    console.log("evidence"+evidence);
    $.ajax({
        url: "/ecm/text/updateTextContent",
        type: 'POST',
        // dataType:"json",
        data: {"caseID": cid,"evidence":evidence,"fact":fact,"result":result},
        beforeSend: function (data) {
            //这里判断，如果没有加载数据，会显示loading
            if (data.readyState == 0) {

            }
        },
        success: function (data) {
            // console.log(data);
            // $('#evidencePara').text(data["evidence"]);
            // $('#factPara').text(data["fact"]);
            // $('#resultPara').text(data["result"]);

        }, error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });
}
