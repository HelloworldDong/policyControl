(function () {
    Handlebars.registerHelper('equal', function (v1, v2, options) {
        console.log('11', v1)
        console.log('1111', v2)
        if (v1 == v2) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
    Handlebars.registerHelper("iftype", function (value) {
        var arr = ['亮度', '温度'];
        var arre = ['level', 'temp'];
        if (value) {
            return arr[arre.indexOf(value)]
        }
    })
    Handlebars.registerHelper("value_type", function (value) {
        var arr = ['等于', '小于', '大于', '至'];
        var arre = ['eq', 'lt', 'gt', 'bt'];
        if (value) {
            return arr[arre.indexOf(value)]
        }
    })
    var delete_id, edit_id, condition_type, date, date_copy, post_date;
    //     $.get('api/rules/', function (data) {//查重还有创建
    // console.log('data----',data)
    //     })为什么用这个不行
    $.ajax({
        url: 'api/rules/count',
        type: 'GET',
        success: function (result) {
            if (result.num <= 20) {
                console.log('不满一页')
                $('#right').removeClass('black').addClass('gray');
                $('#last').removeClass('black').addClass('gray');
            }
        }
    })
    $.ajax({
        url: 'api/rules/',
        type: 'GET',
        success: function (result) {
            console.log('获取数据', result)
            if (result.length) {
                date = result;
                date_copy = JSON.parse(JSON.stringify(date));
                _.each(date_copy, function (x) {
                    if (x.rthen) {
                        x.rthen = JSON.parse(x.rthen);
                        _.each(x.rthen, function (v) {
                            var keys = _.keys(v)[0];
                            v.number = _.keys(v)[0].split('.')[0];
                            v.conditions = _.keys(v)[0].split('.')[1];
                            var yp = [v];//变成数组才能用下面的pluck
                            v.if_num = _.pluck(yp, keys)[0];
                        })
                    }
                    x.rif = x.rif==null?null:JSON.parse(x.rif);
                    if (x && x.rif && x.rif.and) {
                        console.log('111111111111111')
                        x.cond_type_and = 'and';
                        _.each(x.rif.and, function (y) {
                            var keys = _.keys(y)[0];
                            y.number = _.keys(y)[0].split('.')[0];
                            y.conditions = _.keys(y)[0].split('.')[1];
                            var yp = [y];//变成数组才能用下面的pluck
                            var ypp = [_.pluck(yp, keys)[0]]
                            var final_if_num = _.pluck(ypp, _.keys(_.pluck(yp, keys)[0])[0])[0];
                            y.if_type = _.keys(_.pluck(yp, keys)[0])[0];
                            if (y.if_type=='bt') {//这种情况就是在值之间
                                y.start_if_num = final_if_num[0];
                                y.if_num = final_if_num[1];
                            } else {
                                y.if_num = final_if_num;
                            }
                        })
                    } else if (x && x.rif && x.rif.or) {
                        console.log('222222222222')
                        x.cond_type_or = 'or';
                        _.each(x.rif.or, function (y) {
                            // console.log('yyyyy',y)
                            var keys = _.keys(y)[0];
                            y.number = _.keys(y)[0].split('.')[0];
                            y.conditions = _.keys(y)[0].split('.')[1];
                            var yp = [y];//变成数组才能用下面的pluck
                            var ypp = [_.pluck(yp, keys)[0]]
                            var final_if_num = _.pluck(ypp, _.keys(_.pluck(yp, keys)[0])[0])[0];
                            y.if_type = _.keys(_.pluck(yp, keys)[0])[0];
                            // console.log(' y.if_type', y.if_type)
                            // console.log('final_if_num',final_if_num)
                            if (y.if_type=='bt') {//这种情况就是在值之间
                                y.start_if_num = final_if_num[0];
                                y.if_num = final_if_num[1];
                            } else {
                                y.if_num = final_if_num;
                            }
                        })
                    }
                })
            }
            var list_template = Handlebars.compile($('#list_template').html());
            var list_date = list_template(date_copy);
            $("#strategic_body").html(list_date);
        }
    })
    //封装------
    // var final_date;
    // var Handlebars=function(tem_id,date,html_id){
    // final_date= Handlebars.compile($(tem_id).html())(date)
    //    return $(html_id).html(final_date)
    // }
    // Handlebars('#list_template',date,'#strategic_body');
    //封装------

    $('body')
        .on('click', '.list-edit', function (e) { // 编辑策略
            e.preventDefault();
            var id = $(this).data('id');
            edit_id = $(this).data('id');
            var e_date = _.find(date_copy, function (x) {
                return id.toString() == x.id.toString();
            })//要编辑的这条数据
            post_date = _.find(date, function (x) {
                return edit_id.toString() == x.id.toString();
            })//在所有原始数据里找到当前编辑的这条原始数据
            var edit_template = Handlebars.compile($('#edit_template').html());
            if (e_date && e_date.rif && e_date.rif.and) {
                condition_type = 'if_and';
            } else {
                condition_type = 'if_or';
                e_date.cond_type_or = "or"//默认初始值是符合任一条件
            }
            console.log('e_date---',e_date)
            e_date = [e_date]
            var edit_date = edit_template(e_date);//yyy
            $("#edit_body").html(edit_date);
        })
        .on('click', '#add_strategic', function (e) { // 列表里新增策略
            e.preventDefault();
            $('#strategic_name').val('')//清空策略名称
        })
        .on('click', '#sure_add', function (e) {//确定增加策略
            e.preventDefault();
            var reg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
            if (!$('#strategic_name').val()) {
                $('.add-tip').html('策略名称不能为空！');
                $('.add-tip').show();
                return
            } else if (!reg.test($('#strategic_name').val())) {
                $('.add-tip').html('仅能使用汉字，字母，数字或者下划线');
                $('.add-tip').show();
                return
            } else {
                $('#AddModal').modal('hide');
            }
            var post_data = {
                policy_name: $('#strategic_name').val()
            }
            $.ajax({
                url: 'api/rules/',
                type: 'post',
                data: post_data,
                success: function (result) {
                    // console.log('result', result)
                },
                error: function (result) {
                    console.log('error-result', result.status)
                    if (result.status == '400') {
                        alert('策略名称不能重复！')
                    } else {
                        console.log('没有重复')
                        location.reload();
                    }
                }
            })
        })
        .on('click', '.list-delete', function (e) { // 删除策略
            e.preventDefault();
            delete_id = $(this).data('id');//要删除的策略的id
        })
        .on('click', '#sure_del', function (e) { // 确定删除策略
            console.log('delete_id', delete_id)
            e.preventDefault();
            $.ajax({
                url: 'api/rules/' + delete_id,
                type: 'DELETE',
                success: function (result) {
                    alert('删除成功！');
                    location.reload();
                }
            })
        })
        .on('keyup', '#search_name', function (e) {//搜索
            e.stopPropagation();
            if (e.keyCode == 13) {
                var post_data = {
                    search_name: $('#search_name').val()
                }
                $.get('api/rules/', post_data, function (data) {
                    console.log('搜索的回调---data--', data)
                    if (!data.length) {
                        console.log('没有搜索到匹配的策略')
                        $('#strategic_body tr').remove();
                        var str = '<tr><td width="87%">没有搜索到匹配的结果</td><td width="13%"></td></tr>';
                        $('#strategic_body').append(str);
                        $('#one_num').html('0');
                    } else {
                        $('#one_num').html('1');
                        var list_template = Handlebars.compile($('#list_template').html());
                        var list_date = list_template(data);
                        $("#strategic_body").html(list_date);
                    }
                })
            }
        })
        .on('click', 'input[name="radio"]', function (e) {//点击单选按钮
            if ($(this).is(':checked')) {
                condition_type = $(this).val();
            }
        })
        .on('click', '#add_condions', function (e) {//添加条件
            var number = $('.condions-number').val();//编号
            var select = $('.condions-select').val();//属性
            var firstno = $('.condions-firstno').val();//第一个数值
            var cif = $('.condions-if').val();//数值逻辑
            var lastno = $('.condions-lastno').val();//第二个数值

            var data_num;//垃圾桶的data-num属性值
            var arr_t = ['亮度', '温度'];
            var arre_t = ['level', 'temp'];
            var select_t = arr_t[arre_t.indexOf(select)];
            data_num = $('#condions').find('td i');
            data_num = data_num.length;

            var arr_c = ['等于', '小于', '大于', '至'];
            var arre_c = ['eq', 'lt', 'gt', 'bt'];
            var cif_c = arr_c[arre_c.indexOf(cif)]

            var condions_obj = {};
            var str = '';
            condions_obj[number + '.' + select] = {};
            if ($('.condions-if').val() == 'bt') {//如果选择了between的逻辑
                condions_obj[number + '.' + select][cif] = [firstno, lastno]
                if ($('.condions-number').val() && $('.condions-firstno').val() && $('.condions-lastno')) {
                    if (_.isString(post_date.rif)) {//是string类型才转换，如果不是string类型。而进行转换的话会报错
                        post_date.rif = JSON.parse(post_date.rif);
                    }
                    if (condition_type == 'if_and') {//符合所有条件
                        post_date.rif.and.push(condions_obj);
                    } else {//符合任何一个条件 if_or
                        post_date.rif.or.push(condions_obj);
                    }
                    str = '<tr> <td>' + number + '</td> <td>' + select_t + '</td> <td>' + firstno + '</td> <td>' + cif_c + '</td> <td>' + lastno + '</td> <td><i data-num=' + data_num + ' class="condions-del icon-trash"></i></td> </tr>'
                    $('#condions tbody').append(str);
                } else {
                    alert('不能为空值！');
                }
            } else if ($('.condions-number').val() && $('.condions-lastno').val()) {//输入了值的情况下才能添加
                condions_obj[number + '.' + select][cif] = lastno;
                if (condition_type == 'if_and') {//符合所有条件
                    if (!post_date.rif) {//因为新建的策略是没有这些默认值的，所以这里要初始化
                        post_date.rif = {};
                        post_date.rif.and = [];
                    }
                    if (_.isString(post_date.rif)) {//是string类型才转换，如果不是string类型。而进行转换的话会报错
                        post_date.rif = JSON.parse(post_date.rif);
                    }
                    post_date.rif.and.push(condions_obj);
                } else {//符合任何一个条件 if_or //因为新建的策略是没有这些默认值的，所以这里要初始化
                    console.log('333333')

                    if (!post_date.rif) {
                        console.log('!post_date.rif')
                        post_date.rif = {};
                        post_date.rif.or = [];
                    }
                    if (_.isString(post_date.rif)) {//是string类型才转换，如果不是string类型。而进行转换的话会报错
                        post_date.rif = JSON.parse(post_date.rif);
                    }
                    post_date.rif.or.push(condions_obj);
                }
                str = '<tr> <td>' + number + '</td> <td>' + select_t + '</td> <td>' + firstno + '</td> <td>' + cif_c + '</td> <td>' + lastno + '</td> <td><i data-num=' + data_num + ' class="condions-del icon-trash"></i></td> </tr>'
                $('#condions tbody').append(str);
            } else {
                alert('不能为空值！');
            }
        })
        .on('click', '#add_action', function (e) {//添加  动作
            var number = $('.action-number').val();//编号
            var select = $('.action-select').val();//属性
            var lastno = $('.action-lastno').val();//第二个数值
            var action_obj = {};
            action_obj[number + '.' + select] = {};
            var str = '';
            var data_num;//垃圾桶的data-num属性值
            var arr_t = ['亮度', '温度'];
            var arre_t = ['level', 'temp'];
            var select_t = arr_t[arre_t.indexOf(select)];
            data_num = $('#action').find('td i');
            data_num = data_num.length;
            if ($('.action-number').val() && $('.action-lastno').val()) {
                action_obj[number + '.' + select] = lastno;
                if (!post_date.rthen) {//新建的策略是没有这个值的，所以需要初始化//////////////////////////
                    post_date.rthen = [];
                }
                if (_.isString(post_date.rthen)) {
                    post_date.rthen = JSON.parse(post_date.rthen);
                }
                post_date.rthen.push(action_obj);
            } else {
                alert('不能为空值！');
            }
            str = '<tr> <td>' + number + '</td> <td>' + select_t + '</td> <td>' + lastno + '</td> <td><i data-num=' + data_num + ' class="action-del icon-trash"></i></td> </tr>'
            $('#action tbody').append(str);
        })
        .on('change', '.condions-if', function (e) {//添加条件的select
            if ($('.condions-if').val() == 'bt') {
                $('.condions-firstno').show();
            } else {
                $('.condions-firstno').hide();
            }
        })
        .on('change', '.action-if', function (e) {//添加动作的select
            if ($('.action-if').val() == 'bt') {
                $('.action-firstno').show();
            } else {
                $('.action-firstno').hide();
            }
        })
        .on('click', '.condions-del', function (e) {//删除条件
            var del_num = $(this).data('num');//每个垃圾桶的序号
            console.log('del_num---', del_num)
            console.log('删除条件post_date---', post_date)
            if(_.isString(post_date.rif)){
                post_date.rif = JSON.parse(post_date.rif);
            }
            if (condition_type == 'if_and') {//符合所有条件
                post_date.rif.and = _.without(post_date.rif.and, post_date.rif.and[del_num]);
            } else {//符合任何一个条件 if_or
                post_date.rif.or = _.without(post_date.rif.or, post_date.rif.or[del_num]);
            }
            $(this).parent('td').parent('tr').remove();
            $('#condions').find('td i').each(function (x) {
                $(this).attr('data-num', x);
            })
        })
        .on('click', '.action-del', function (e) {//删除动作
            $(this).parent('td').parent('tr').remove();
            var del_num = $(this).data('num');//每个垃圾桶的序号
            post_date.rthen = _.without(post_date.rthen, post_date.rthen[del_num]);//对数据操作
            $('#action').find('td i').each(function (x) {//对页面操作
                $(this).attr('data-num', x);
            })
        })
        .on('click', '#save_edit', function (e) {//确定保存编辑
            if (!post_date.rif) {
                alert('请选择条件再保存！');
                return
            }
            if (condition_type == 'if_or') {//选择了满足任一条件
                if (post_date.rif.and) {//这种情况下才需要改变
                    post_date.rif = { 'or': post_date.rif.and }
                }
            } else {//选择了满足所以条件
                if (post_date.rif.or) {//这种情况下才需要改变
                    post_date.rif = { 'and': post_date.rif.or }
                }
            }
            post_date.policy_name = post_date.name;
            delete post_date["name"]
            console.log('JSON.stringify(post_date)', JSON.stringify(post_date))
            $.ajax({
                url: 'api/rules/' + edit_id,
                type: 'PUT',
                data: { data: JSON.stringify(post_date) },
                success: function (data) {
                    console.log('更新的正确返回值-----', data)
                    if (result.statusCode == '200') {
                        console.log('保存成功！')
                        window.location.reload()
                    }
                },
                error: function (data) {
                    if (data.status == '200') {
                        alert('保存成功！')
                        location.reload();
                    } else {
                        alert('保存失败！')
                    }
                }
            })
        })
        .on('click', '#first', function (e) {//最前页面
            if (!$(this).hasClass('gray')) {
                $.ajax({
                    url: 'api/rules/?name=&&limit=10&&offert=&&10',
                    type: 'GET',
                    success: function (result) {
                        if (result.statusCode == '200') {
                        } else {
                        }
                    }
                })
            }
        })
        .on('click', '#left', function (e) {//前一页
            if (!$(this).hasClass('gray')) {
                $.ajax({
                    url: 'api/rules/?name=&&limit=10&&offert=&&10',
                    type: 'PUT',
                    success: function (result) {
                        if (result.statusCode == '200') {
                        } else {
                        }
                    }
                })
            }
        })
        .on('click', '#right', function (e) {//后一页 one_num/two_num
            if (!$(this).hasClass('gray')) {
                $.ajax({
                    url: 'api/rules/?name=&&limit=10&&offert=&&10',
                    type: 'GET',
                    success: function (result) {
                        if (result.statusCode == '200') {
                        } else {
                        }
                    }
                })
            }
        })
        .on('click', '#last', function (e) {//最后页面
            // $('#last i').removeClass('gray');
            if (!$(this).hasClass('gray')) {
                $.ajax({
                    url: 'api/rules/?name=&&limit=10&&offert=&&10',
                    type: 'GET',
                    success: function (result) {
                        if (result.statusCode == '200') {
                            alert('保存成功！');
                        } else {
                            alert('保存失败！');
                        }
                    }
                })
            }
        })
})()