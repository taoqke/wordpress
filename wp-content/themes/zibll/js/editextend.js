(function ($) {
    var PluginManagerAdd = tinymce.PluginManager.add;
    PluginManagerAdd('zib_hide', function (editor, url) {
        editor.addButton('zib_hide', {
            text: '',
            icon: 'preview',
            tooltip: '隐藏内容',
            type: 'menubutton',
            menu: [{
                text: '评论后可查看',
                onclick: function () {
                    editor.selection.setContent('<span>[hidecontent type="reply" desc="隐藏内容：评论后查看"]</span><p>' + editor.selection.getContent() + '</p><span>[/hidecontent]</span>');
                }
            }, {
                text: '登录后可查看',
                onclick: function () {
                    editor.selection.setContent('<span>[hidecontent type="logged" desc="隐藏内容：登录后可查看"]</span><p>' + editor.selection.getContent() + '</p><span>[/hidecontent]</span>');
                }
            }, {
                text: '会员可查看',
                onclick: function () {
                    editor.selection.setContent('<span>[hidecontent type="vip1" desc="隐藏内容：会员可查看"]</span><p>' + editor.selection.getContent() + '</p><span>[/hidecontent]</span>');
                }
            }, ]
        });
    });

    PluginManagerAdd('zib_quote', function (editor, url) {
        editor.addButton('zib_quote', {
            text: '',
            icon: 'blockquote',
            tooltip: '引言',
            type: 'menubutton',
            menu: [{
                text: '灰色',
                onclick: function () {
                    editor.selection.setContent('<div class="quote_q"><i class="fa fa-quote-left"></i><p>' + (editor.selection.getContent() || '<br/>') + '</p></div>');
                }
            }, {
                text: '红色',
                onclick: function () {
                    editor.selection.setContent('<div class="quote_q qe_wzk_c-red"><i class="fa fa-quote-left"></i><p>' + (editor.selection.getContent() || '<br/>') + '</p></div>');
                }
            }, {
                text: '蓝色',
                onclick: function () {
                    editor.selection.setContent('<div class="quote_q qe_wzk_lan"><i class="fa fa-quote-left"></i><p>' + (editor.selection.getContent() || '<br/>') + '</p></div>');
                }
            }, {
                text: '绿色',
                onclick: function () {
                    editor.selection.setContent('<div class="quote_q qe_wzk_lv"><i class="fa fa-quote-left"></i><p>' + (editor.selection.getContent() || '<br/>') + '</p></div>');
                }
            }, ]
        });
    });

    //添加编辑器上传按钮
    PluginManagerAdd('zib_img', function (editor, url) {

        var _input = $('<input type="file" accept="image/gif,image/jpeg,image/jpg,image/png">');
        _input.on('change', function (e) {
            var files = this.files || e.dataTransfer.files;
            var ing_key = 'upload_ing';

            //没有文件退出
            if (!files[0] || $(this).data(ing_key)) return;

            var file = files[0];
            //文件大小判断
            var size_max = mce.img_max || 4;
            if (file.size > size_max * 1024000) {
                return notyf("文件[" + file.name + "]大小超过限制，最大" + size_max + "M，请重新选择", "danger");
            }
            //执行上传
            upload(file, $(this), function (n) {
                if (n.img_url) {
                    editor.insertContent('<img src="' + n.img_url + '" alt="' + file.name + '"><p></p>')
                }
            });
        })

        editor.addButton('zib_img', {
            text: '',
            icon: 'image',
            tooltip: '上传图片',
            onclick: function () {
                is_mobile() || _input.click()
            },
            onTouchEnd: function () {
                is_mobile() && _input.click()
            }
        })
    });

    //添加编辑器上传按钮
    PluginManagerAdd('zib_video', function (editor, url) {
        var _input = $('<input type="file" accept="video/*">');
        _input.on('change', function (e) {
            var files = this.files || e.dataTransfer.files;

            var ing_key = 'upload_ing';

            //没有文件退出
            if (!files[0] || $(this).data(ing_key)) return;

            var file = files[0];
            //文件大小判断
            var size_max = mce.video_max || 30;
            if (file.size > size_max * 1024000) {
                return notyf("文件[" + file.name + "]大小超过限制，最大" + size_max + "M，请重新选择", "danger");
            }
            //执行上传
            upload(file, $(this), function (n) {
                if (n.url) {
                    editor.insertContent('<div contenteditable="false" data-video-url="' + n.url + '" class="new-dplayer post-dplayer dplayer"><span>[视频:' + file.name + ']</span></div><p></p>')
                }
            });
        })

        editor.addButton('zib_video', {
            text: '',
            tooltip: '上传视频',
            icon: 'media',
            onclick: function () {
                is_mobile() || _input.click()
            },
            onTouchEnd: function () {
                is_mobile() && _input.click()
            }
        })
    });

    function upload(file, _input, success_fun) {
        var formData = new FormData();
        var notyf_id = 'mce_notice';
        var ing_key = 'upload_ing';
        formData.append('file', file, file.name);
        formData.append('action', 'edit_upload');
        notice('正在上传请稍候...', "load", "", notyf_id);
        _input.data(ing_key, true);
        $.ajax({
            type: 'POST',
            url: mce.ajax_url,
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            error: function (n) {
                var _msg = "操作失败 " + n.status + ' ' + n.statusText + '，请刷新页面后重试';
                if (n.responseText && n.responseText.indexOf("致命错误") > -1) {
                    _msg = '网站遇到致命错误，请检查插件冲突或通过错误日志排除错误';
                }
                notice(_msg, 'danger', 3, notyf_id);
                _input.data(ing_key, false);
            },
            success: function (n) {
                var ys = (n.ys ? n.ys : (n.error ? 'danger' : ""));
                notice(n.msg || '上传成功', ys, 2, notyf_id);
                $.isFunction(success_fun) && success_fun(n, _input);
                _input.data(ing_key, false);
            }
        })
    }

    function is_mobile() {
        return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
    }

    //系统通知
    function notice(str, ys, time, id) {
        $('.notyn').length || $('body').append('<div class="notyn"></div>');
        ys = ys || "success";
        time = time || 5000;
        time = time < 100 ? time * 1000 : time;
        var id_attr = id ? ' id="' + id + '"' : '';
        var _html = $('<div class="noty1"' + id_attr + '><div class="notyf ' + ys + '">' + str + '</div></div>');
        var is_close = !id;
        if (id && $('#' + id).length) {
            $('#' + id).find('.notyf').removeClass().addClass('notyf ' + ys).html(str);
            _html = $('#' + id);
            is_close = true;
        } else {
            $('.notyn').append(_html);
        }

        is_close && setTimeout(function () {
            notyf_close(_html)
        }, time);

        function notyf_close(_e) {
            _e.addClass('notyn-out')
            setTimeout(function () {
                _e.remove()
            }, 1000);
        }
    }

    function open_media_window() {
        console.log(wp);
    }

})(jQuery);