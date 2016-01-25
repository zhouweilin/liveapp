<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>登录</title>
<script type="text/javascript" src="/Public/js/jquery-2.1.1.min.js"></script>
<style>
#boxlogin{ width:558px; height:203px; background: url(/Public/images/loginbj.gif) no-repeat; margin:0px auto; margin-top:200px; padding-top:100px;}
.boxlogintable{ margin:0px auto;}
#boxlogin table strong{ font-size:14px; color:#286c9c;}
.boxloginput{ width:195px; height:20px; border:1px solid #ccc;}
.boxloginbutton{ width:81px; height:29px; background:url(/Public/images/loginbutton1.gif) no-repeat; border:none; font-weight:bold; font-size:14px; color:#fff; cursor:pointer; line-height:29x;}
.loginmargin{ width:300px; height:200px;}
</style>
</head>
<body>
<div id="boxlogin">
<form>
  <table width="306" cellpadding="0" cellspacing="0" class="boxlogintable">
    <tr>
	  <td width="70" height="52"><strong>用户名：</strong></td>
	  <td colspan="2"><input name="user" id="user" type="text"  class="boxloginput"/>
	    </td>
	</tr>
	<tr>
	  <td><strong>密&nbsp;&nbsp;&nbsp;码：</strong></td>
	  <td colspan="2"><input name="pwd" type="password" id="pwd" class="boxloginput" /></td>
	</tr>
	<tr>
	  <td height="61">&nbsp;</td>
	  <td width="93" valign="bottom"><label>
	    <input type="button" id="sub" name="Submit" value="登 录"  class="boxloginbutton"/>
	  </label></td>
	  <td width="141" valign="bottom"><label>
	    <input type="reset" name="Submit2" value="重 设"  class="boxloginbutton"/>
	  </label></td>
	</tr>
  </table>
  </form>
</div>
<script type="text/javascript">
	$("#sub").click(function(){
		if($("#user").val() == ''){
			alert("用户名不能为空!");
			return false;
		}
		if($("#pwd").val() == ''){
			alert("密码不能为空!");
			return false;
		}
		$.post('/?a=loginsave',{
			  user : $("#user").val(),
			  pwd : $("#pwd").val()
			   },function(data){
				   var d = parseInt(data);
				   if(d == 1){
					   //alert("登录成功!");
					   window.location.href="/?c=admin";
				   }else if(d == -1){
					   alert("用户名或密码错误!");
				   }else if(d == -2){
					   alert("用户名或密码不能为空!");
				   }
			   });
	});
</script>
</body>
</html>