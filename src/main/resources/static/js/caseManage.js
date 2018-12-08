var username = $.session.get('username');

var dat_restore = [];
var dat_type = '';
var dat_page = {
    'finished':1,
    'processing':1,
    // 'raw':1,
    'all':1
};

const num_p_page = 10;

$(function () {
    $('#userLabel').text(username.substring(0,1)+"法官");

    $("#tableSelect").click(function (e) {

        if($("#tableSelect").is(':checked')){
            $('input[name="tableCheckbox"]').prop("checked","true");
        }else{
            $('input[name="tableCheckbox"]').removeAttr("checked");
        }
    });

    $('#checkbox_delete').click(function (e) {
        var cidList = [];
        $('input[name="tableCheckbox"]:checked').each(function () {
            cidList.push($(this).val());
        });

        $.ajax({
            type: "POST",
            url: "/ecm/case/delete",
            data: JSON.stringify(cidList),
            contentType: "application/json; charset=utf-8",
            // cache: false, //不缓存此页面
            success: function (data) {
                window.location.reload();
            }
        });
    });

    $('#newCaseForm').submit(function () {
        var judgeList = [];
        judgeList.push(username);
        $('input[name="judgeName"]').each(function () {
            judgeList.push($(this).val());
        });

        $.ajax({
            type: "POST",
            url: "/ecm/case/save",
            data: JSON.stringify({"case":{"id":-1,"caseNum":$('input[name="caseNum_new"]').val(),
                    "name":$('input[name="caseName_new"]').val(),"type":$('input[name="caseType_new"]').val(),
                    "fillingDate":$('input[name="fillingDate_new"]').val(),"closingDate":$('input[name="closingDate_new"]').val()},
                "judgeList":judgeList}),
            // dataType:"json",
            contentType: "application/json; charset=utf-8",
            // cache: false, //不缓存此页面
            success: function (data) {
                console.log("res:"+data)
                if(data==-1){
                    $('span[name="caseNum_new_error"]').text("案号已存在");
                    $('span[name="judge_error"]').text("");
                }else if(data==-2){
                    $('span[name="judge_error"]').text("审判人员不存在");
                    $('span[name="caseNum_new_error"]').text("");
                }else if(data==-3){
                    $('span[name="caseNum_new_error"]').text("案号已存在");
                    $('span[name="judge_error"]').text("审判人员不存在");
                }else{
                    $('span[name="caseNum_new_error"]').text("");
                    $('span[name="judge_error"]').text("");
                    $("#addCaseModal").modal('hide');
                    window.location.reload();
                }
            }
        });
        return false;
    });

    $('#finished-tag').click(function () {
        dat_page['finished']=1
        $(".type_switch").removeClass('active')
        $("#finish_li").addClass('active')
        getCase('finished',dat_page['finished'])

    });
    $('#all-tag').click(function () {
        dat_page['all'] = 1
        $(".type_switch").removeClass('active')
        $("#all_li").addClass('active')
        getCase('all',dat_page['all'])

    });
    $('#processing-tag').click(function () {
        dat_page['processing'] = 1
        $(".type_switch").removeClass('active')
        $("#processing_li").addClass('active')
        getCase('processing',dat_page['processing'])
    });
// $('#raw-tag').click(function () {
//     $(".type_switch").removeClass('active')
//     $("#raw_li").addClass('active')
//     getCase('raw',dat_page['raw'])
// });
    $('#exist_click').click(function () {
        if(confirm('是否确认退出？'))
        {
            $.session.remove('username');
            window.location.href = '/ecm/login';
        }
    });

    $('input[name="caseNum"]').focus(function () {
        $('span[name="caseNum_error"]').text("");
    });

    $('#caseForm').submit(function () {
        var caseID = $('#seeCaseInfo').attr('data-cid');
        $.ajax({
            type: "POST",
            url: "/ecm/case/update",
            data: JSON.stringify({"id":caseID,"caseNum":$('input[name="caseNum"]').val(),
                "name":$('input[name="caseName"]').val(),"type":$('input[name="caseType"]').val(),
                "fillingDate":$('input[name="fillingDate"]').val(),"closingDate":$('input[name="closingDate"]').val()}),
            // dataType:"json",
            contentType: "application/json; charset=utf-8",
            // cache: false, //不缓存此页面
            success: function (data) {
                if(data=="caseNum exists"){
                    $('span[name="caseNum_error"]').text("案号已存在");
                }else{
                    $('span[name="caseNum_error"]').text("");
                    $("#seeCaseInfo").modal('hide');
                }
            }
        });
        return false;
    });

    getCase('all',1);
    $('#all_li').addClass('active');
});

function reverseSelect() {
    $('input[name="tableCheckbox"]').each(function () {
        $(this).prop("checked", !$(this).prop("checked"));
    });
}

function showAddCase() {
    $('#addCaseModal').find('input').val("");
    $("#jList_tr").html('<span style="color: red;" name="judge_error"></span><a onclick="addJudge()"><i class="fa fa-plus"></i>添加其他审判人员</a>');
    $('#addCaseModal').modal('show');
}

function addJudge() {
    // var jList_html = $('#jList_tr').html();
    // $('#jList_tr').html(jList_html+'<br/><td style="width: 80%;display: inline-block;"><input type="text" class="form-control" name="judgeName" required/></td>');
    $('#jList_tr').append('<div style="margin-top: 2%;"><input type="text" class="form-control" name="judgeName" onfocus="clearJudgeError()" required/></div>');
}

function clearJudgeError() {
    $('span[name="judge_error"]').text("");
}

function clearCaseNumError() {
    $('span[name="caseNum_new_error"]').text("");
}

function refresh_table (page) {
    var tr_html = '';
    const case_num = dat_restore.length;
    var count = num_p_page;

    var data_page = dat_restore.slice(num_p_page*(page-1),num_p_page*page);

    for (var item in data_page){
        var html = '<tr><td><input type="checkbox" name="tableCheckbox" value="'+data_page[item].cid+'"/></td>'+
            '<td>'+data_page[item].cid+'</td>'+
            '<td>'+data_page[item].caseNum+'</td>'+
            '<td class="article-title">'+data_page[item].cname+'</td>'+
            '<td>'+data_page[item].fillingDate.split(' ')[0]+'</td>'+
            '<td>'+data_page[item].manageJudge+'</td>'+
            ' <td>'+
            '<a class="a_delete" style="margin-right: 10px" data-cid="'+data_page[item].cid+'">删除</a>'+
            '<a class="a_edit" style="margin-right: 10px" data-cid="'+data_page[item].cid+'">编辑</a>'+
            '<a class="ecm_link" style="margin-right: 10px"> <i class="fa fa-link"></i>证据链建模工具</a>'+
            '<a class="ecm_link" style="margin-right: 10px"> <i class="fa fa-link"></i>文书语段生成工具</a>'+
            '</td>'+
            '</tr>';
        tr_html = tr_html + html
        if (count == 0)
            break;
        count = count-1

    }

    $('#caseTable').html(tr_html)

    var page_label_Html = '<li class="active" id = "pre_page"><a aria-label="Previous"> <span aria-hidden="true">&laquo;</span> </a> </li>\n'
    var page_num = Math.floor(case_num/num_p_page)+1
    if (page_num<=7){
        for (var i =1;i<=page_num;i++){
            if (i == page){
                page_label_Html += '<li class="active"><a class="choosePage">'+i+'</a></li>'
            }else {
                page_label_Html += '<li><a class="choosePage">'+i+'</a></li>'
            }
        }
    }else{
        if(page<=4){
            for (var i =1;i<=5;i++){
                if (i == page){
                    page_label_Html += '<li class="active"><a class="choosePage">'+i+'</a></li>'
                }else {
                    page_label_Html += '<li><a class="choosePage">'+i+'</a></li>'
                }
            }
            page_label_Html +='<li><a>...</a></li>'
            page_label_Html += '<li><a class="choosePage">'+page_num+'</a></li>'
        }else if(page>=page_num-3){
            page_label_Html += '<li><a class="choosePage">'+1+'</a></li>'
            page_label_Html +='<li><a>...</a></li>'
            for (var i =page_num-4;i<=page_num;i++){
                if (i == page){
                    page_label_Html += '<li class="active"><a class="choosePage">'+i+'</a></li>'
                }else {
                    page_label_Html += '<li><a class="choosePage">'+i+'</a></li>'
                }
            }
        }else{
            page_label_Html += '<li><a class="choosePage">'+1+'</a></li>'
            page_label_Html +='<li><a>...</a></li>'

            page_label_Html += '<li><a class="choosePage">'+parseInt(parseInt(page)-1)+'</a></li>'
            page_label_Html += '<li class="active"><a class="choosePage">'+page+'</a></li>'
            page_label_Html += '<li><a class="choosePage">'+parseInt(parseInt(page)+1)+'</a></li>'

            page_label_Html +='<li><a>...</a></li>'
            page_label_Html += '<li><a class="choosePage">'+page_num+'</a></li>'
        }
    }
    page_label_Html = page_label_Html + '<li class="active" id = "next_page"><a aria-label="Next"> <span aria-hidden="true">&raquo;</span> </a> </li>'
    $("#page-switch").html(page_label_Html)
    $(".choosePage").click(function () {
        console.log($(this).html())
        const page = $(this).html()
        dat_page[dat_type] = page
        getCase(dat_type,page)

    })
    $("#pre_page").click(function () {
        if (  dat_page[dat_type] == 1){
            return
        }else
        {
            dat_page[dat_type] = parseInt(dat_page[dat_type])-1
            getCase(dat_type,dat_page[dat_type])
        }

    })
    $("#next_page").click(function () {
        if (  dat_page[dat_type] == page_num){
            return
        }else
        {
            dat_page[dat_type] = parseInt(dat_page[dat_type])+1
            getCase(dat_type,  dat_page[dat_type])
        }

    });

    $("a[class='ecm_link']").click(function () {

        var cid = $(this).parent().parent().find('td:eq(1)').text();
        $.session.set("cid",cid);

        var caseInfo = '{"cid":"'+cid+'","cNum":"'+$(this).parent().parent().find('td:eq(1)').text()+
            '", "cname":"'+$(this).parent().parent().find('td:eq(2)').text()+
            '", "fillingDate":"'+$(this).parent().parent().find('td:eq(3)').text()+
            '", "undertaker":"'+$(this).parent().parent().find('td:eq(4)').text()+'"}';
        $.session.set("caseInfo",caseInfo);
        window.location.href = "/ecm/upload";
    });

    $("a[class='a_delete']").click(function () {
        var caseID = $(this).attr('data-cid');
        if(window.confirm("此操作不可逆，是否确认？"))
        {
            $.ajax({
                type: "POST",
                url: "/ecm/case/delete",
                data: JSON.stringify([caseID]),
                contentType: "application/json; charset=utf-8",
                // cache: false, //不缓存此页面
                success: function (data) {
                    window.location.reload();
                }
            });
        }
    });

    $("a[class='a_edit']").click(function () {
        var caseID = $(this).attr('data-cid');
        $.ajax({
            type: "POST",
            url: "/ecm/case/getCase",
            data: {"caseID":caseID},
            dataType:"json",
            // contentType: "application/json; charset=utf-8",
            // cache: false, //不缓存此页面
            success: function (data) {
                var reg = new RegExp("/","g");
                $('input[name="caseNum"]').val(data['caseNum']);
                $('input[name="caseName"]').val(data['name']);
                $('input[name="caseType"]').val(data['type']);
                $('input[name="fillingDate"]').val(new Date(parseInt(data['fillingDate'])).toLocaleDateString().replace(reg,'-'));
                if(data['closingDate']!=null)
                    $('input[name="closingDate"]').val(new Date(parseInt(data['closingDate'])).toLocaleDateString().replace(reg,'-'));
                $('#seeCaseInfo').attr("data-cid",caseID);
                $('#seeCaseInfo').modal('show');
            }
        });
    });
}

function getCase(type,page) {
    if(dat_type == type)
    {
        refresh_table(page);
    }else {
        if(type=='all'){
            $.ajax({
                url:"/ecm/case/getAll",
                type:'POST',
                data:{"username":username},
                success:function (data) {
                    dat_restore = data;
                    dat_type = type;
                    refresh_table(page);
                }
            });
        }else if(type=='finished'){
            $.ajax({
                url:"/ecm/case/getFinishedCases",
                type:'POST',
                data:{"username":username},
                success:function (data) {
                    dat_restore = data;
                    dat_type = type;
                    refresh_table(page);
                }
            });
        }else if(type=='processing'){
            $.ajax({
                url:"/ecm/case/getProcessingCases",
                type:'POST',
                data:{"username":username},
                success:function (data) {
                    dat_restore = data;
                    dat_type = type;
                    refresh_table(page);
                }
            });
        }
    }
}

function searchCase() {
    $('body').loading({
        loadingWidth:240,
        title:'搜索中...',
        name:'searchCase',
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
        url:"/ecm/case/search",
        type:'POST',
        data:{"username":username,"casename":$('#searchInput').val()},
        async: true,
        success:function (data) {

            dat_restore = data;
            dat_type = 'search';
            refresh_table(1);
            removeLoading('searchCase');
        }
    });
}