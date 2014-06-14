// ==UserScript==
// @name        Super Bawu
// @namespace   http://tieba.baidu.com
// @include     http://tieba.baidu.com/bawu2/*
// @version     1.2
// @description  吧务拉黑封禁功能增强，让拉黑功能成为再简单不过的事情
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// ==/UserScript==

;(function($){

	//会员列表封禁
	
	var block = {menber:0,blocked:0}
	
	$(".btn_group").each(function(){
		$(this).append('<input type="checkbox">');
	})
	
	var cHTML = '<a id="check_all" data-all="0" class="ui_btn ui_btn_s"\
	onclick="return false;"href="#">\
	<span><em>全选</em></span></a>\
	<a id="block_all" class="ui_btn ui_btn_s"\
	onclick="return false;"href="#">\
	<span><em>拉黑所选</em></span></a>\ ';
	$('.help_wrap').append(cHTML);

	function message(e){
		var d = $("#page_message").text(e);
		d.css("marginLeft", - (d.outerWidth() / 2));
		d.animate({
		  top: 0
		}, 500).delay(3000).animate({
		  top: -39
		}, 500)	
	}
	
	function blockID(id){
		var data = {ie:"utf-8",
					tbs:unsafeWindow.PageData.user.tbs,
					user_id:id,
					word:$("#wd1").attr("value")
					};
		$.post("http://tieba.baidu.com/bawu2/platform/addBlack",data,function(r){
			block.blocked += 1;
			if(block.menber === block.blocked){
				message('操作完成，本次共拉黑'+block.blocked+'人！');
				block.menber = 0;
				block.blocked = 0;
			}
		});	
	}	
		
	$("#check_all").click(function(){
		if(!$(this).data("all")){
			$("input[type='checkbox']").each(function() {
				$(this).attr("checked", true);
			})	
			$(this).find("em").text("全消");
			$(this).data("all",1);
		}
		else{
			$("input[type='checkbox']").each(function() {
				$(this).attr("checked", false);
			})	
			$(this).find("em").text("全选");
			$(this).data("all",0);
		}
	})
	
	$("#block_all").click(function(){
		$("input[type='checkbox']").each( function(){
				if($(this).attr("checked") === "checked"){
					block.menber += 1;
					blockID($(this).parent(".btn_group").attr("id"));
				}
			}
		)		
	});
	
	//用户封禁列表
	
	var bHTML = '<a id="block_check" class="ui_btn ui_btn_s"\
	onclick="return false;"href="#">\
	<span><em>选中项加入黑名单</em></span></a>\ ';
	$("#restoreChecked").before(bHTML);
	
	$("#block_check").click(function(){
		$("#dataTable tbody input[type='checkbox']").each(function(){
			if($(this).attr("checked") === "checked"){
				block.menber += 1;
				var userID = $(this).parent().parent().find(".ui_btn").data("user-id");
				blockID(userID);
			}
		});
	});
})(unsafeWindow.$);
