/*
 * @Author        : Qinver
 * @Url           : zibll.com
 * @Date          : 2020-09-29 13:18:40
 * @LastEditTime: 2021-11-27 23:53:12
 * @Email         : 770349780@qq.com
 * @Project       : Zibll子比主题
 * @Description   : 一款极其优雅的Wordpress主题
 * @Read me       : 感谢您使用子比主题，主题源码有详细的注释，支持二次开发。
 * @Remind        : 使用盗版主题会存在各种未知风险。支持正版，从我做起！
 */

//拼图验证码
$(".slidercaptcha").length && tbquire(["slidercaptcha"]);

/*--图形验证--*/
if ($("[canvas-code]").length) {
    _win.canvas_code = {};
    $("[canvas-code]").each(function () {
        var _this = $(this);
        var _id = _this.attr('id');
        _win.canvas_code[_id] = [];
        draw(_id, _win.canvas_code[_id]);
    });

    _win.bd.on('click', "[canvas-code]", function () {
        var _this = $(this);
        var _id = _this.attr('id');
        _win.canvas_code[_id] = [];
        draw(_id, _win.canvas_code[_id]);
    })

    _win.bd.on('input porpertychange', 'input[name="canvas_yz"]', function () {
        var _this = $(this);
        var _id = _this.attr('canvas-id');
        var val = _this.val().toLowerCase();
        var match_ok = _this.siblings('.match-ok');
        if (val.length > 3) {
            var vcode = _win.canvas_code[_id].join("");
            match_ok.addClass('show')
            if (val == vcode) {
                match_ok.html('<i class="fa fa-check"></i>');
            } else {
                match_ok.html('<i class="fa fa-times c-red"></i>');
            }
        } else {
            match_ok.removeClass('show')
        }
    })
}

//生成图形验证码
function draw(o, t) {
    var a = $("#" + o).attr("width"),
        r = $("#" + o).attr("height");
    var n = document.getElementById(o),
        e = n.getContext("2d");
    n.width = a, n.height = r;
    for (var l = "A,B,C,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0", h = l.split(","), d = h.length, m = 0; m <= 3; m++) {
        var M = Math.floor(Math.random() * d),
            i = 30 * Math.random() * Math.PI / 180,
            s = h[M];
        t[m] = s.toLowerCase();
        var f = 10 + 20 * m,
            g = 20 + 8 * Math.random();
        e.font = "bold 23px 微软雅黑", e.translate(f, g), e.rotate(i), e.fillStyle = randomColor(),
            e.fillText(s, 0, 0), e.rotate(-i), e.translate(-f, -g);
    }
    for (var m = 0; m <= 5; m++) e.strokeStyle = randomColor(), e.beginPath(), e.moveTo(Math.random() * a, Math.random() * r),
        e.lineTo(Math.random() * a, Math.random() * r), e.stroke();
    for (var m = 0; m <= 30; m++) {
        e.strokeStyle = randomColor(), e.beginPath();
        var f = Math.random() * a,
            g = Math.random() * r;
        e.moveTo(f, g), e.lineTo(f + 1, g + 1), e.stroke();
    }
}

function randomColor() {
    return "rgb(" + Math.floor(230 * Math.random() + 20) + "," + Math.floor(190 * Math.random() + 30) + "," + Math.floor(190 * Math.random() + 30) + ")";
}

$('.sign form').keydown(function (e) {
    var e = e || event,
        keycode = e.which || e.keyCode;
    if (keycode == 13) {
        $(this).find('.signsubmit-loader').trigger("click");
    }
})

//输入检测
_win.bd.on('input porpertychange', 'input[change-show]', function () {
    var _this = $(this);
    var val = _this.val();
    if (val.length > 5) {
        var e = _this.attr('change-show') || '.change-show';
        _this.parents('form').find(e).slideDown()
    }
})

/**发送验证码 */
_win.bd.on('click', ".captchsubmit", function () {
    _this = $(this);
    _win.captchsubmit_wait = 60;
    var _text = _this.html();
    var captchsubmit = function () {
        zib_ajax(_this, 0, function (n) {
            n.error || captchdown();
            slidercaptchaBack();
        });
        return !1;
    }

    var captchdown = function () {
        var _captchsubmit = $(".captchsubmit");
        if (_win.captchsubmit_wait > 0) {
            _captchsubmit.html(_win.captchsubmit_wait + '秒后可重新发送').attr('disabled', !0);
            _win.captchsubmit_wait--;
            setTimeout(captchdown, 1000);
        } else {
            _captchsubmit.html(_text).attr('disabled', !1);
            _win.captchsubmit_wait = 60
        }
    }
    if ($(".slidercaptcha").length && !_win.slidercaptcha) {
        ajax_slidercaptcha(function () {
            captchsubmit();
        }, _this);
    } else {
        captchsubmit();
    }
})

//提交
_win.bd.on("click", ".signsubmit-loader", function () {
    _this = $(this);
    var ajax_signsubmit = function () {
        zib_ajax(_this, 0, function (n) {
            n.error || (window.location.reload());
            slidercaptchaBack();
        })
        return !1;
    }
    if ($(".slidercaptcha").length && !_win.slidercaptcha) {
        ajax_slidercaptcha(function (_this) {
            ajax_signsubmit();
        }, _this);
    } else {
        ajax_signsubmit();
    }
})


//返回上一级TAB
function slidercaptchaBack() {
    var _this = $('.slidercaptcha-back');
    var _id = _this.attr('href');
    $(_id).hasClass('active') || _this.click();
    return false;
}

_win.bd.on('click', '.user-verify-submit', function (e) {
    var _this = $(this);
    var _next = _this.parents('.tab-pane').next('.tab-pane').attr('id');
    zib_ajax(_this, 0, function (n) {
        if (!n.error) {
            $('a[href="#' + _next + '"]').tab('show');
            _win.captchsubmit_wait -= 40;
        }
    })
})