function getFilterParams(){
  //从后端获取筛选条件
  var filter_parmas = [
    {
      "name":"single_condition",
      "type":"single",
      "title":"单选条件",
      "params":[
        {
          "id":"0-50",
          "value":"0-50"
        },
        {
          "id":"51-100",
          "value":"51-100"
        },
        {
          "id":"101-150",
          "value":"101-150"
        },
        {
          "id":"150-",
          "value":"150-"
        },
      ],
      "costom":[
        {
          "id":"start",
          "default":"",
          "type":"text",
        },
        {
          "id":"end",
          "default":"",
          "type":"text",
        },
      ]
    },
    {
      "name":"multi_condition1",
      "type":"multi",
      "title":"多选条件1",
      "max_choice":3,
      "params":[
        {
          "id":"multi_condition1_1",
          "value":"条件1-1"
        },
        {
          "id":"multi_condition1_2",
          "value":"条件1-2"
        },
        {
          "id":"multi_condition1_3",
          "value":"条件1-3"
        },
      ],
      "costom":[
        {
          "id":"custom_condition1",
          "default":"",
          "type":"text",
        },
      ]
    },
    {
      "name":"multi_condition2",
      "type":"multi",
      "title":"多选条件2",
      "max_choice":3,
      "params":[
        {
          "id":"multi_condition2_1",
          "value":"条件2-1"
        },
        {
          "id":"multi_condition2_2",
          "value":"条件2-2"
        },
        {
          "id":"multi_condition2_3",
          "value":"条件2-3"
        },
        {
          "id":"multi_condition2_4",
          "value":"条件2-4"
        },
        {
          "id":"multi_condition2_5",
          "value":"条件2-5"
        },
        {
          "id":"multi_condition2_6",
          "value":"条件2-6"
        },
        {
          "id":"multi_condition2_7",
          "value":"条件2-7"
        },
        {
          "id":"multi_condition2_8",
          "value":"条件2-8"
        },
        {
          "id":"multi_condition2_9",
          "value":"条件2-9"
        },
      ],
    },
    {
      "name":"multi_condition3",
      "type":"multi",
      "title":"多选条件3",
      "max_choice":1,
      "params":[
        {
          "id":"multi_condition3_1",
          "value":"条件3-1"
        },
        {
          "id":"multi_condition3_2",
          "value":"条件3-2"
        },
        {
          "id":"multi_condition3_3",
          "value":"条件3-3"
        },
      ],
    },
  ]
  return filter_parmas
}

function renderFilter(filter_parmas){
  // 渲染筛选栏
  $(".search-list li").remove();
  $.each(filter_parmas, function(idx, obj) {
    var param_tile = $("<p></p>").text(obj.title)
    var div_params = $("<div></div>")
    div_params.attr('id',obj.name)
    var span_param = $("<span></span>").text("全部")
    span_param.addClass('whole')
    div_params.append(span_param)
    $.each(obj.params,function(id,val){
      span_param = $("<span></span>").text(val.value)
      span_param.attr('value',val.id)
      div_params.append(span_param)
    })
    if(obj.params.length>6){
      div_params.addClass('y')
    }
    var li_param = $("<li></li>")
    if(obj.type=="single"){
      li_param.addClass("single")
      li_param.attr('id',obj.name)
    }
    if(obj.type=="multi"){
      li_param.addClass("multiple")
    }
    li_param.append(param_tile)

    //是否有自定义输入框
    i=1
    if('costom' in obj){
      user_define = $("<div></div>")
      div_params.append("<span>自定义:</span>")
      $.each(obj.costom,function(cid,cin){
        //input_html = "<input name='"+cin.id+"' id='"+cin.id+"'"+">"
        input_html = $("<input>")
        input_html.attr('id',cin.id)
        input_html.attr('name',cin.id)
        input_html.addClass('input_param')
        user_define.append(input_html)
        if(obj.costom.length>1&&i==1){
          user_define.append("<span style='margin-right:0px'>--</span>")
        }
        i++
      })
      input_button = $("<button></button>")
      input_button.text("确定")
      input_button.attr("id",obj.name + "_input_button")
      input_button.addClass("input_button")
      user_define.append(input_button)
      user_define.addClass('input_div')
      div_params.append(user_define)
    }

    li_param.append(div_params)
    $(".search-list").append(li_param)
  })
}

$(function () {
  // 渲染筛选框
  renderFilter(getFilterParams())
  //多选
	$(".multiple span").click(function(){
        var that=$(this);
        if(that.text()!="自定义:"&&that.text()!="--"){
          if(that.hasClass("whole")){
              $(this).addClass("current").siblings().removeClass("current");
          }else{
              if(that.hasClass("current")){
                that.removeClass("current");
                that.parent().find(".whole").removeClass("current");
             }else{
                that.addClass("current");
                that.parent().find(".whole").removeClass("current");
             }
          }
          GetSearchList()
        }
	})
  //单选
  $(".single span").click(function(){
      if($(this).text()!="自定义:"&&($(this).text()!="--")) {
        $(this).addClass("current").siblings().removeClass("current");
        GetSearchList()
      }
  })

  //自定义
  $(".input_button").click(function(){
    input_div = $(this).parent()
    check = 0;
    input_count = 0
    $.each(input_div.children(),function(k,v){
      if($(this).prop('tagName').toLowerCase()=="input"){
        input_count = input_count + 1
        if($(this).val()==""){
          $(this).attr("placeholder","请输入内容")
        }else{
          $(this).addClass("udefine")
          check = check +1
        }
      }
    });

    if(check==input_count&&($(this).parent().parent().parent().hasClass('single'))){
      $(this).parent().siblings().removeClass("current")
      GetSearchList()
    } else if(check==input_count&&($(this).parent().parent().parent().hasClass('multiple'))){
      GetSearchList()
    }
  });

  //获取搜索的json数据
  function GetSearchList(){
    var query_dict = {'custom_choice':[]}
    $(".search-list").children().each(function(k,v){
      this_li = $(this)
      $(this).children().each(function(k1,v1){
        if($(this).prop('tagName').toLowerCase()=="div"){
          param_key = $(this).attr('id')
          query_dict[param_key] = {'name_choice':[],'value_choice':[]}
        }
      })
    })

    $(".current").each(function(k,v){
      li_param = $(this).parent().parent()
      div_param = $(this).parent()
      if(li_param.hasClass('single')) {
        if($(this).text()=='全部'){
          query_dict[div_param.attr('id')]['name_choice'] = []
        } else {
          query_dict[div_param.attr('id')]['name_choice'] = []
          query_dict[div_param.attr('id')]['name_choice'] = [$(this).attr('value')]
          query_dict[div_param.attr('id')]['value_choice'] = [$(this).text()]
        }
      }
      if(li_param.hasClass('multiple')) {
        if($(this).text()=='全部'){
          //获取该条件下的自定义值并删除
          query_dict[div_param.attr('id')]['name_choice'] = []
          query_dict[div_param.attr('id')]['value_choice'] = []
        } else {
          query_dict[div_param.attr('id')]['name_choice'].push([$(this).attr('value')])
          query_dict[div_param.attr('id')]['value_choice'].push($(this).text())
        }
      }
    })

    $(".udefine").each(function(k,v){
      conditions = $(this).parent().siblings()
      input_ok = true
      that = $(this)
      grand = $(this).parent().parent().parent()
      if(grand.prop("tagName").toLowerCase()=='li'&&grand.hasClass('single')){
        pass = false
        $.each(conditions,function(c,d){
          if($(this).hasClass('current')){
            pass = true
          }
        })
        if(pass){
          input_ok = false
          that.val("")
        }
      }
      $.each(conditions,function(c,d){
        if($(this).hasClass('whole')&&$(this).hasClass('current')){
          input_ok = false
          that.val("")
        }
      })
      if(input_ok){
        c_k = $(this).attr('id')
        c_v = $(this).val()
        query_dict['custom_choice'].push({'name':c_k,'value':c_v})
      }
    })

    //选取的查询条件在这！！！
    console.log(JSON.stringify(query_dict))

    //远程筛选
    $.ajax({
      type: "POST",
      url: "getfilterresult",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(query_dict),
      dataType: "json",
      success: function (message) {
        if (message > 0) {
            alert("请求已提交！我们会尽快与您取得联系");
        }
      },
      error: function (message) {
        $("#request-process-patent").html("提交数据失败！")
      }
    })
  }
})