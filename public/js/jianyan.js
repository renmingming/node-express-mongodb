/**
 * Created by Administrator on 2017/3/7 0007.
 * 失去焦点判断用户名是否存在
 */
$(function(){
    $("#signupName").blur(function(){
        var val = $.trim($(this).val());
        //console.log(val)
        $.ajax({
            type: 'POST',
            url: '/userlist',
            data: {name: val}
        })
        .done(function(results) {
            //console.log(results.success)
            switch(results.success){
                case 1:
                    $("#signupName").css("border-color","red");
                    break;
                case 0:
                    $("#signupName").css("border-color","green");
                    break;
                case -1:
                    $("#signupName").css("border-color","red").attr("placeholder", "用户名不能为空");
            }
        })
    })
})