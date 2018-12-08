userID = "";
$(function(){
    $.ajax({
        type: "POST",
        url: "/ecm/user/getUserInfo",
        data: {"realName":username},
        dataType:"json",
        // contentType: "application/json; charset=utf-8",
        // cache: false, //不缓存此页面
        success: function (data) {
            // console.log(data);
            $('input[name="truename"]').val(data['realName']);
            $('input[name="username"]').val(data['name']);
            if(data['role']!=null){
                $('input[name="userRole"]').val(data['role']);
            }
            userID = data['id'];
        }
    });

    $('input[name="username"]').focus(function () {
        $('span[name="name_error"]').text("");
    });

    $('#userForm').submit(function () {
        var realName = $('input[name="truename"]').val();
        var name = $('input[name="username"]').val();
        var userRole = $('input[name="userRole"]').val();
        // var old_pswd = $('input[name="old_password"]').val();
        // var pswd = $('input[name="new_password"]').val();
        // var new_pswd = $('input[name="password"]').val();

        $.ajax({
            type: "POST",
            url: "/ecm/user/updateUserInfo",
            data: {"id":userID,"name":name,"realName":realName,"role":userRole},
            // dataType:"json",
            // contentType: "application/json; charset=utf-8",
            // cache: false, //不缓存此页面
            success: function (data) {
                if(data=="name exists"){
                    $('span[name="name_error"]').text("用户名已存在");
                }else{
                    $('span[name="name_error"]').text("");
                    $("#seeUserInfo").modal('hide');
                }
            }
        });
        return false;
    });
});