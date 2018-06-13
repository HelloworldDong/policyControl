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

    var delete_id, edit_id, condition_type;
//     $.get('api/rules/', function (data) {//查重还有创建
// console.log('data----',data)
//     })为什么用这个不行

    $.ajax({
        url: 'api/rules/',
        type: 'GET',
        success: function (result) {
            console.log('获取数据',result)
            // if (result.statusCode == '204') {
            //     alert('删除成功！');
            // } else {
            //     alert('删除失败！');
            // }
        }
    })
    var date = [{
        id: '1234567',
        name: 'one',
        rule_if: {
            'or': [
                {
                    'a.level': {
                        'gt': 50
                    },
                },

                {
                    'b.temp': {
                        'gt': 40
                    },
                },
                {
                    'c.level': {
                        'bt': [12, 50]
                    },
                }]
        },
        rthen: [
            {
                'c.level':
                    70
            },
            {
                'D.level':
                    60
            },
            {
                'F.temp':
                    40
            }]
    }, {
        id: '777788888',
        name: 'two',
        rule_if: {
            'and': [
                {
                    'a.temp': {
                        'gt': 300
                    }
                },
                {
                    'b.level': {
                        'gt': 500
                    }
                },
                {
                    'e.level': {
                        'bt': [20, 60]
                    },
                }]

        },
        rthen: [
            {
                'H.level':
                    980
            },
            {
                'c.level':
                    200
            },
            {
                'c.level':
                    100
            }]
    }]
    // function getStr(string,str){
    //     var str_before=string.split(str)[0];
    //     var str_after=string.split(str)[1];
    // }
    var date_copy = JSON.parse(JSON.stringify(date));

    _.each(date_copy, function (x) {
        if (x.rthen) {
            _.each(x.rthen, function (v) {
                var keys = _.keys(v)[0];
                v.number = _.keys(v)[0].split('.')[0];
                v.conditions = _.keys(v)[0].split('.')[1];
                var yp = [v];//变成数组才能用下面的pluck
                v.if_num = _.pluck(yp, keys)[0]
            })
        }
        if (x.rule_if.and) {
            x.cond_type_and = 'and';
            _.each(x.rule_if.and, function (y) {
                var keys = _.keys(y)[0];
                y.number = _.keys(y)[0].split('.')[0];
                y.conditions = _.keys(y)[0].split('.')[1];
                var yp = [y];//变成数组才能用下面的pluck
                var ypp = [_.pluck(yp, keys)[0]]
                var final_if_num = _.pluck(ypp, _.keys(_.pluck(yp, keys)[0])[0])[0];
                y.if_type = _.keys(_.pluck(yp, keys)[0])[0];
                if (final_if_num.length) {//这种情况就是在值之间
                    y.start_if_num = final_if_num[0];
                    y.if_num = final_if_num[1];
                } else {
                    y.if_num = final_if_num;
                }
            })
        } else {
            x.cond_type_or = 'or';
            _.each(x.rule_if.or, function (y) {
                var keys = _.keys(y)[0];
                y.number = _.keys(y)[0].split('.')[0];
                y.conditions = _.keys(y)[0].split('.')[1];
                var yp = [y];//变成数组才能用下面的pluck
                var ypp = [_.pluck(yp, keys)[0]]
                var final_if_num = _.pluck(ypp, _.keys(_.pluck(yp, keys)[0])[0])[0];
                y.if_type = _.keys(_.pluck(yp, keys)[0])[0];
                if (final_if_num.length) {//这种情况就是在值之间
                    y.start_if_num = final_if_num[0];
                    y.if_num = final_if_num[1];
                } else {
                    y.if_num = final_if_num;
                }
            })
        }
    })
    var post_date;

    //封装------
    // var final_date;
    // var Handlebars=function(tem_id,date,html_id){
    // final_date= Handlebars.compile($(tem_id).html())(date)
    //    return $(html_id).html(final_date)
    // }
    // Handlebars('#list_template',date,'#strategic_body');
    //封装------

    var list_template = Handlebars.compile($('#list_template').html());
    var list_date = list_template(date_copy);
    $("#strategic_body").html(list_date);

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
            if (e_date.rule_if.and) {
                condition_type = 'if_and';
            } else {
                condition_type = 'if_or';
            }
            e_date = [e_date]
            var edit_date = edit_template(e_date);
            console.log('e_date', e_date)
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
            } else if (!reg.test($('#strategic_name').val())) {
                $('.add-tip').html('仅能使用汉字，字母，数字或者下划线');
                $('.add-tip').show();
            } else {
                $('#AddModal').modal('hide');
            }
            var post_data = {
                name: $('#strategic_name').val()
            }
            $.post('api/rules/add', post_data, function (data) {//查重还有创建

            })
        })
        .on('click', '.list-delete', function (e) { // 删除策略
            e.preventDefault();
            delete_id = $(this).data('id');//要删除的策略的id
        })
        .on('click', '#sure_del', function (e) { // 确定删除策略
            console.log('delete_id',delete_id)
            e.preventDefault();
            $.ajax({
                url: 'api/rules/'+delete_id,
                type: 'DELETE',
                success: function (result) {
                    console.log('result000',result)
                    if (result.statusCode == '204') {
                        alert('删除成功！');
                    } else {
                        alert('删除失败！');
                    }
                }
            })
        })
        .on('keyup', '#search_name', function (e) {//搜索
            e.stopPropagation();
            if (e.keyCode == 13) {
                console.log($('#search_name').val());
                var post_data = {
                    search_name: $('#search_name').val()
                }
                $.post('api/rules/search', post_data, function (data) {
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
            console.log('length', data_num)

            var arr_c = ['等于', '小于', '大于', '至'];
            var arre_c = ['eq', 'lt', 'gt', 'bt'];
            var cif_c = arr_c[arre_c.indexOf(cif)]

            var condions_obj = {};
            var str = '';
            condions_obj[number + '.' + select] = {};
            if ($('.condions-if').val() == 'bt') {//如果选择了between的逻辑
                condions_obj[number + '.' + select][cif] = [firstno, lastno]
                if ($('.condions-number').val() && $('.condions-firstno').val() && $('.condions-lastno')) {
                    if (condition_type == 'if_and') {//符合所有条件
                        post_date.rule_if.and.push(condions_obj);
                    } else {//符合任何一个条件 if_or
                        post_date.rule_if.or.push(condions_obj);
                    }
                    str = '<tr> <td>' + number + '</td> <td>' + select_t + '</td> <td>' + firstno + '</td> <td>' + cif_c + '</td> <td>' + lastno + '</td> <td><i data-num=' + data_num + ' class="condions-del icon-trash"></i></td> </tr>'
                    $('#condions tbody').append(str);
                } else {
                    alert('不能为空值！');
                }
            } else if ($('.condions-number').val() && $('.condions-lastno').val()) {//输入了值的情况下才能添加
                condions_obj[number + '.' + select][cif] = lastno;
                if (condition_type == 'if_and') {//符合所有条件
                    post_date.rule_if.and.push(condions_obj);
                } else {//符合任何一个条件 if_or
                    post_date.rule_if.or.push(condions_obj);
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
            if (condition_type == 'if_and') {//符合所有条件
                post_date.rule_if.and = _.without(post_date.rule_if.and, post_date.rule_if.and[del_num]);
            } else {//符合任何一个条件 if_or
                post_date.rule_if.or = _.without(post_date.rule_if.or, post_date.rule_if.or[del_num]);
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
        .on('click', '#save_edit', function (e) {//保存修改
            if (condition_type == 'if_or') {//选择了满足任一条件
                if (post_date.rule_if.and) {//这种情况下才需要改变
                    post_date.rule_if = { 'or': post_date.rule_if.and }
                }
            } else {//选择了满足所以条件
                if (post_date.rule_if.or) {//这种情况下才需要改变
                    post_date.rule_if = { 'and': post_date.rule_if.or }
                }
            }
            $.ajax({
                url: 'api/rules/:edit_id',
                type: 'PUT',
                success: function (result) {
                    if (result.statusCode == '200') {
                    } else {
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
            // console.log('111111')
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