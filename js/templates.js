var VT=function(){return new Function};VT.Balance=function(e){var t='﻿<!DOCTYPE html><html><head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" /> <meta name="HandheldFriendly" content="true" /> <meta http-equiv="pragma" content="no-cache">  <meta http-equiv="cache-control" content="no-cache">  <meta http-equiv="expires" content="-1">  <meta name="apple-mobile-web-app-status-bar-style" content="black">  <meta name="format-detection" content="telephone=no">  <meta name="format-detection" content="email=no">  <meta name="apple-mobile-web-app-capable" content="yes"> <meta name="apple-mobile-web-app-title" content="乐多分">  <title>结算记录</title> <link href="css/Global.css" rel="stylesheet" /> <link href="css/eleoooMobile.css" rel="stylesheet" /></head><body><div> <header> <a href="#" class="return"></a> 结算记录 </header> <div class="title-header"> <div class="th-int">2013-03-18 至 2013-03-18</div>  </div> <div class="content"> <ul class="detail"> <li><span>结算日期：</span>2013-04-02       </li> <li><span>结算金额：</span>382.00        </li> </ul></div></div> <footer> <a href="#"><span class="order">订单</span></a> <a href="#"><span class="menu">菜单</span></a> <a href="#"><span class="sale">促销</span> </a> <a href="#"><span class="service">客服 </span></a> <a href="#" class="nav_on"><span class="finance">财务</span></a> </footer></body></html>';return t},VT.Detail=function(e){var t='﻿<!DOCTYPE html><html><head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" /> <meta name="HandheldFriendly" content="true" /> <meta http-equiv="pragma" content="no-cache"> <meta http-equiv="cache-control" content="no-cache"> <meta http-equiv="expires" content="-1"> <meta name="apple-mobile-web-app-status-bar-style" content="black"> <meta name="format-detection" content="telephone=no"> <meta name="format-detection" content="email=no"> <meta name="apple-mobile-web-app-capable" content="yes"> <meta name="apple-mobile-web-app-title" content="乐多分"> <title>收支明细</title> <link href="css/Global.css" rel="stylesheet" /> <link href="css/eleoooMobile.css" rel="stylesheet" /></head><body> <div> <header> <div class="deal_btn"><a href="#">结算记录</a></div> 收支明细 </header> <div class="title-header"> <div class="th-int"> 2013-03-18 至 2013-03-18</div> </div> <div class="content"> <ul class="detail"> <li><span>现金收入：</span>4738.00 </li> <li><span>储值收入：</span>00.00 </li> <li><span>积分收入：</span>92.00 </li> <li><span>收入总计：</span>4830.00 </li> <li><span>分成比例：</span>10% </li> <li><span>应付佣金：</span>382.00 </li> </ul> </div> </div> <footer> <a href="#"><span class="order">订单</span></a> <a href="#"><span class="menu">菜单</span></a> <a href="#"><span class="sale">促销</span> </a> <a href="#"><span class="service">客服 </span></a> <a href="#" class="nav_on"><span class="finance">财务</span></a> </footer></body></html>';return t},VT.Hall=function(e){var t='﻿<header><div class="deal_btn"><a href="javascript:void(0);" tap="app.logout">退出登录</a></div> <a href="javascript:void(0);" class="return" tap="app.closeDlg"></a>餐厅信息 </header><div> <div class="wrap"> <ul class="detail rush"> <li>本店账号：<input type="text" class="input" value="'+e.p+'" id="txtPhone" /></li> <li class="open_time">营业时间：<input type="text" class="input" value="'+e.CompanyWorkTime+'" style="width: 120px;" id="txtWorkingTime" /> <a href="javascript:void(0);"> <img src="images/add.png" alt="" align="absmiddle" tap="addWorkingtime" /></a></li> <li>起送金额：<input type="number" class="input" value="'+e.OnSetSum+'" id="txtOnSetSum" /></li> <li>登录密码：<input type="password" class="input" value="" id="p1" /></li> <li>确认密码：<input type="password" class="input" value="" id="p2" /></li> <li class="link">当前状态：<img src="images/'+(e.IsSuspend?"off":"on")+'.png" alt="" tap="changeStatus" /></li> <li class="link"> <div class="d_right"> '+e.Area+'第<span class="price">'+e.Ranking1+'</span>名</div> 本店人气：<span class="price">'+e.Amount+'</span></li> <li class="link"> <div class="d_right"> '+e.Area+'第<span class="price">'+e.Ranking2+'</span>名</div> 送餐速度：<span class="price">'+e.OrderElapsed+'</span></li> <li> <input type="button" class="btn green" value="保存" tap="saveMyInfo" /></li> </ul> </div></div>';return t},VT.Login=function(e){var t='﻿<header> <div class="deal_btn"><a href="javascript:void(0);" tap="showSendMsn" >忘了密码</a></div>用户登录</header><div class="container"> <div class="logo"> <p> <img src="images/logo.png" alt=""></p> <p> 商家操作系统</p> </div> <ul class="login"> <li>帐号：<input class="input" type="text" id="txtLoginUserPhone" maxlength="11" /></li> <li>密码：<input class="input" type="password" id="txtLoginUserPwd" maxlength="6" /></li> <li id="sendPwd" style="display: none"> <input type="button" class="btn gray" value="短信获取密码" tap="sendPassword" /></li> <li class="link"> <input name="" type="checkbox" value="" id="cbAutoLogin" />自动登录 <input name="" type="checkbox" value="" id="cbSavePwd" />记住密码 </li> <li> <input type="button" class="btn green" value="登录" tap="login" /></li> </ul></div>';return t},VT.Menu=function(e){var t='﻿<header class="leftHeader"> <div class="search"><input class="input s_input" type="text" value="输入餐点名称搜索" defVal="输入餐点名称搜索" id="txtMenuName" onchange="app.Menu.searchMenu(this);"/></div> 菜单管理</header><div class="wrap"> <ul class="h_order m_order" id="menuContainer">  </ul></div>';return t},VT.MenuItem=function(e){var t='﻿<div class="main_menu" id="m'+e.ID+'"> <h4> '+e.Name+'</h4> <div class="menu_down"> <span>单价：'+e.Price+'</span> 调价:<input name="" type="number" class="input zq" onchange="app.Menu.changePrice(this);" data-id="'+e.ID+'" data-price="'+e.Price+'" /> <input name="input" type="button" value="'+(e.IsOutOfStock?"缺货":"有货")+'" class="green" tap="outOfStockItem" data-id="'+e.ID+'" data-isout="'+e.IsOutOfStock+'" /> <input name="" type="button" value="删除" class="red" tap="deleteItem" data-id="'+e.ID+'" /> </div></div>';return t},VT.OrderHandle=function(e){var t='﻿<header><a href="javascript:app.closeDlg();" class="return"></a>订单处理</header><div class="title-header2"> <img src="images/user.png" alt="" align="absmiddle" /> <span>'+e.MemberPhoneNumber+'</span> <img src="images/clock.png" alt="" style="margin-left: 20px;" /> <span>'+e.Timespan+'</span></div><div class="content"> <ul class="h_order">';for(var n=0;n<e.details.length;n++){var r=e.details[n];app.OrderHandle.processItem(r),t+=" <li> <h2> "+r.DirName+'</h2> <div class="menu_show"> <span>'+r.MenuName+"</span><span>"+r.OrderQty+"份</span><span>"+numeral(r.OrderSum).format("0.00")+'</span></div> <div class="menu_down"> <span>单价：'+numeral(r.OrderPrice).format("0.00")+'</span><span>调价：<input type="number" class="input zq" onchange="app.OrderHandle.changePrice(this);" data-id="'+r.MenuId+'" data-price="'+r.OrderPrice+'" /></span><span> <input type="button" value="暂缺" class="green" tap="outOfStock" data-id="'+r.MenuId+'" /></span></div> </li>'}return t+=' </ul> <ul class="warm"> <li>总计：<span class="price">'+numeral(e.OrderSumOk).format("0.00")+'</span> 其中送餐费 <span class="price">'+numeral(e.ServiceSum).format("0.00")+"</span> </li> <li>备注："+e.OrderMemo+" </li> <li>地址："+e.Address+' </li> <li class="em_review" tap="toggleReview">回复<em></em></li> </ul> <ul class="review" id="reviewContainer"> <li><a href="javascript:void(0)" tap="selectMsn"> <input name="msnType" type="radio" value="0" checked="checked" data-message="订单已经确认，餐厅开始备餐。" /><span>订单已经确认，餐厅开始备餐。</span></a></li> <li><a href="javascript:void(0)" tap="selectMsn"> <input name="msnType" type="radio" value="1" data-message="" /><span>抱歉，XXX今天暂缺，请修改后重新下单。</span></a></li> <li><a href="javascript:void(0)" tap="selectMsn"> <input name="msnType" type="radio" value="1" data-message="" /><span>经餐厅确认：XXX价格调整为XX元。</span></a></li> <li><a href="javascript:void(0)" tap="selectMsn"> <input name="msnType" type="radio" value="2" data-message="抱歉，当前暂不外送，请选择其他餐厅。" /><span>抱歉，当前暂不外送，请选择其他餐厅。</span></a></li> <li><a href="javascript:void(0)" tap="selectMsn"> <input name="msnType" type="radio" value="4" data-message="订单已取消。" /><span>订单已取消。</span></a></li> <li> <input type="button" class="btn green" value="回复" id="btnReview" tap="confirmOrder" /></li> </ul></div>',t},VT.OrderList=function(e){var t='﻿<header class="leftHeader"> <div class="search"><input class="input s_input" type="text" value="" defVal="输入会员账号搜索" id="txtOrderListUserPhone"/></div> 订单记录 </header><div class="title-header"> <div class="th-int"> <input type="text" value="'+e.beginDate+'" id="txtOrderListBeginDate" /> 至 <input type="text" value="'+e.endDate+'" id="txtOrderListEndDate" /> <input type="button" value="确定" tap="showOrderList" /> </div></div><div class="content" style="padding-bottom: 120px;"> <ul class="orderList" id="orderContainer"> </ul> <div class="state"> <div class="s1" id="s1"> <a href="javascript:void(0)" status="notstarted"><i class="i_red">0</i>待处理</a> <a href="javascript:void(0)" status="modified"> <i class="i_yellow">0</i>已修改</a> <a href="javascript:void(0)" status="urge"><i class="i_red">0</i>催餐中</a> <a href="javascript:void(0)" status="canceled"><i class="i_yellow">0</i>已取消</a> <a href="javascript:void(0)" status="all">全部</a> </div> <div class="s2" id="s2"> 总计<i status="sumok">0.00</i> 现金<i status="sum">0.00</i> 储值<i status="sumcash">0.00</i> 积分<i status="sumpoint">0.00</i> <span>返回</span> </div> </div></div>';return t},VT.OrderListItem=function(e){var t='﻿<li id="'+e.ID+'" status="'+e.status.status+'"><span><img src="images/user.png" alt="" align="absmiddle"></span> <span orderid="'+e.ID+'" tap="showTempView">'+e.MemberPhoneNumber+'<u tap="showTempView">NO.'+e.OrderNum+'</u></span><span class="pRight"><input name="" type="button" class="dr_btn red" value="'+e.status.text+'" tap="showHandleView" orderid="'+e.ID+'" status="'+e.status.status+'" /></span></li>';return t},VT.Review=function(e){var t='﻿<header> <div class="deal_btn"><a href="javascript:void(0);" tap="app.showHallView">餐厅信息</a></div> 会员点评 </header><div class="deal_link"> <a href="javascript:void(0);" data-type="True" tap="filterReview">已回复</a>  <a href="javascript:void(0);" data-type="False" tap="filterReview">未回复</a></div><div class="title-header"> <div class="mall_cate"> <label data-type="All" id="mall_cate"> 默认</label><em></em></div> <div class="th-int"> <input type="text" value="'+e.beginDate+'" id="txtBeginDate" /> 至 <input type="text" value="'+e.endDate+'" id="txtEndDate" /> <input type="button" value="确定" tap="showReview" /> </div></div><div class="content" style="padding-top: 85px;"> <div class="rw_number" id="rw_number"> 好评：<i>0</i>中评：<i>0</i>差评：<i>0</i></div> <!--已回复--> <ul class="reviewList" id="reviewList"> </ul></div>';return t},VT.Rush=function(e){var t='﻿<!DOCTYPE html><html><head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" /> <meta name="HandheldFriendly" content="true" /> <meta http-equiv="pragma" content="no-cache">  <meta http-equiv="cache-control" content="no-cache">  <meta http-equiv="expires" content="-1">  <meta name="apple-mobile-web-app-status-bar-style" content="black">  <meta name="format-detection" content="telephone=no">  <meta name="format-detection" content="email=no">  <meta name="apple-mobile-web-app-capable" content="yes"> <meta name="apple-mobile-web-app-title" content="乐多分">  <title>抢购条件</title> <link href="css/Global.css" rel="stylesheet" /> <link href="css/eleoooMobile.css" rel="stylesheet" /></head><body><div> <header> <a href="#" class="return"></a> 抢购条件 </header> <div class="wrap"> <ul class="detail rush"> <li>积分兑换：<input class="input" type="text" ></li> <li>投放数量：<input type="text" class="input" value="/天"/></li> <li>消费频率：<input type="text" class="input" value="上两周订餐次数" ></li> <li>单次金额：<input type="text" class="input" value="平均订餐金额"/></li> <li>投放周期：<input type="text" class="input" value="2013-03-18至2013-03-18" ></li> <li class="link">抢购次数：<input name="" type="checkbox" value="">每天限一次<input name="" type="checkbox" value="">本期限一次</li> <li><input type="button" class="btn green" value="提交" /></li> </ul> </div></div> <footer> <a href="#"><span class="order">订单</span></a> <a href="#"><span class="menu">菜单</span></a> <a href="#" class="nav_on"><span class="sale">促销</span> </a> <a href="#"><span class="service">客服 </span></a> <a href="#"><span class="finance">财务</span></a> </footer></body></html>';return t},VT.RushRecord=function(e){var t='﻿<!DOCTYPE html><html><head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" /> <meta name="HandheldFriendly" content="true" /> <meta http-equiv="pragma" content="no-cache">  <meta http-equiv="cache-control" content="no-cache">  <meta http-equiv="expires" content="-1">  <meta name="apple-mobile-web-app-status-bar-style" content="black">  <meta name="format-detection" content="telephone=no">  <meta name="format-detection" content="email=no">  <meta name="apple-mobile-web-app-capable" content="yes"> <meta name="apple-mobile-web-app-title" content="乐多分">  <title>抢购记录</title> <link href="css/Global.css" rel="stylesheet" /> <link href="css/eleoooMobile.css" rel="stylesheet" /></head><body><div> <header> <a href="#" class="return"></a> 抢购记录 </header> <div class="title-header"><div class="th-int">2013-03-18 至 2013-03-18 </div> </div> <div class="content" style="padding:85px 0 90px 0"> <ul class="rush_record"> <li> <img src="images/user.png" alt="" align="absmiddle"> <div><span class="user">18665900149</span><span class="time"> 03-05  11:26:39</span></div> <div class="deal_div"><span>原价：<b>19.00</b></span><span>积分：<b>10.00</b></span><span>数量：<b>1</b></span></div> </li> <li> <img src="images/user.png" alt="" align="absmiddle"> <div><span class="user">13715185457</span><span class="time"> 03-05  11:26:39</span></div> <div class="deal_div"><span>原价：<b>19.00</b></span><span>积分：<b>10.00</b></span><span>数量：<b>1</b></span></div> </li> <li> <img src="images/user.png" alt="" align="absmiddle"> <div><span class="user">1354875457</span><span class="time"> 03-05  11:26:39</span></div> <div class="deal_div"><span>原价：<b>19.00</b></span><span>积分：<b>10.00</b></span><span>数量：<b>1</b></span></div> </li> <li> <img src="images/user.png" alt="" align="absmiddle"> <div><span class="user">18975421458</span><span class="time"> 03-05  11:26:39</span></div> <div class="deal_div"><span>原价：<b>19.00</b></span><span>积分：<b>10.00</b></span><span>数量：<b>1</b></span></div> </li> <li> <img src="images/user.png" alt="" align="absmiddle"> <div><span class="user">18665900149</span><span class="time"> 03-05  11:26:39</span></div> <div class="deal_div"><span>原价：<b>19.00</b></span><span>积分：<b>10.00</b></span><span>数量：<b>1</b></span></div> </li> <li> <img src="images/user.png" alt="" align="absmiddle"> <div><span class="user">13715185457</span><span class="time"> 03-05  11:26:39</span></div> <div class="deal_div"><span>原价：<b>19.00</b></span><span>积分：<b>10.00</b></span><span>数量：<b>1</b></span></div> </li> <li> <img src="images/user.png" alt="" align="absmiddle"> <div><span class="user">1354875457</span><span class="time"> 03-05  11:26:39</span></div> <div class="deal_div"><span>原价：<b>19.00</b></span><span>积分：<b>10.00</b></span><span>数量：<b>1</b></span></div> </li> <li> <img src="images/user.png" alt="" align="absmiddle"> <div><span class="user">18975421458</span><span class="time"> 03-05  11:26:39</span></div> <div class="deal_div"><span>原价：<b>19.00</b></span><span>积分：<b>10.00</b></span><span>数量：<b>1</b></span></div> </li> </ul> <div class="state"> 数量总计：<span class="price">5</span> 　　积分收入：<span class="price">50.00</span> </div> </div></div> <footer> <a href="#" class="nav_on"><span class="order">订单</span></a> <a href="#"><span class="menu">菜单</span></a> <a href="#"><span class="sale">促销</span> </a> <a href="#"><span class="service">客服 </span></a> <a href="#"><span class="finance">财务</span></a> </footer></body></html>';return t},VT.Sale=function(e){var t='﻿<!DOCTYPE html><html><head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" /> <meta name="HandheldFriendly" content="true" /> <meta http-equiv="pragma" content="no-cache">  <meta http-equiv="cache-control" content="no-cache">  <meta http-equiv="expires" content="-1">  <meta name="apple-mobile-web-app-status-bar-style" content="black">  <meta name="format-detection" content="telephone=no">  <meta name="format-detection" content="email=no">  <meta name="apple-mobile-web-app-capable" content="yes"> <meta name="apple-mobile-web-app-title" content="乐多分">  <title>促销方案</title> <link href="css/Global.css" rel="stylesheet" /> <link href="css/eleoooMobile.css" rel="stylesheet" /> <style type="text/css">.m_order h4{ padding-bottom:5px;}.h_order li h2{ color:#333; cursor:pointer;}.menu_down{ position:relative; line-height:26px;}.m_order .green{ position:absolute; right:0px; }.main_menu{ display:none}</style></head><body><div> <header> <div class="deal_btn"><a href="#">促销列表</a></div> <a href="#" class="return"></a> 促销方案 </header> <div class="wrap"> <ul class="h_order m_order"> <li> <h2>超值汉堡单品(可配冷饮)  </h2> <div class="main_menu"> <h4>烟肉芝士汉堡 </h4> <div class="menu_down"><span>单价：609.00 </span><input name="" type="button" value="加入促销" class="green"></div> </div> <div class="main_menu"> <h4>地中海风情 </h4> <div class="menu_down"><span>单价：9.00 </span><input name="" type="button" value="加入促销" class="green"></div> </div> <div class="main_menu"> <h4>烟肉芝士汉堡超惠套餐啊标题要长些再长些 </h4> <div class="menu_down"><span>单价：69.00 </span><input name="" type="button" value="加入促销" class="green"></div> </div> <div class="main_menu"> <h4>地中海风情 </h4> <div class="menu_down"><span>单价：69.00 </span><input name="" type="button" value="加入促销" class="green"></div> </div> </li> <li> <h2>12"半分天下（自选两种口味）</h2> <div class="main_menu"> <h4>超级夏威夷 </h4> <div class="menu_down"><span>单价：69.00 </span><input name="" type="button" value="加入促销" class="green"></div> </div> <div class="main_menu"> <h4>美式腊肉肠</h4> <div class="menu_down"><span>单价：69.00 </span><input name="" type="button" value="加入促销" class="green"></div> </div> </li> <li> <h2>超值汉堡单品(可配冷饮)  </h2> <div class="main_menu"> <h4>烟肉芝士汉堡 </h4> <div class="menu_down"><span>单价：69.00 </span><input name="" type="button" value="加入促销" class="green"></div> </div> <div class="main_menu"> <h4>地中海风情 </h4> <div class="menu_down"><span>单价：69.00 </span><input name="" type="button" value="加入促销" class="green"></div> </div> </li> </ul>  </div></div> <footer> <a href="#"><span class="order">订单</span></a> <a href="#"><span class="menu">菜单</span></a> <a href="#" class="nav_on"><span class="sale">促销</span> </a> <a href="#"><span class="service">客服 </span></a> <a href="#"><span class="finance">财务</span></a> </footer><script src="js/jquery.min.js" type="text/javascript"></script><script type="text/ecmascript">$(function(){$(".h_order li h2").click(function(){$(this).siblings().toggle();})})</script></body></html>';return t},VT.SaleList=function(e){var t='﻿<!DOCTYPE html><html><head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" /> <meta name="HandheldFriendly" content="true" /> <meta http-equiv="pragma" content="no-cache">  <meta http-equiv="cache-control" content="no-cache">  <meta http-equiv="expires" content="-1">  <meta name="apple-mobile-web-app-status-bar-style" content="black">  <meta name="format-detection" content="telephone=no">  <meta name="format-detection" content="email=no">  <meta name="apple-mobile-web-app-capable" content="yes"> <meta name="apple-mobile-web-app-title" content="乐多分">  <title>促销列表</title> <link href="css/Global.css" rel="stylesheet" /> <link href="css/eleoooMobile.css" rel="stylesheet" /></head><body><div> <header> <a href="#" class="return"></a> 促销列表 </header> <div class="deal_link"> <a href="#">已审核</a> <a href="#">待审核</a> </div> <div class="title-header"> <div class="mall_cate">默认<em></em></div> <div class="th-int"> 2013-03-18 至 2013-03-18  </div> </div> <div class="content"> <ul class="slist"> <li> <p class="ps1"><a href="#">NO.02</a>2013-03-012 至 2013-03-18</p> <p class="ps2">铁板牛肉饭套餐+配茶树菇老鸭汤 </p> <p class="ps3"> <span class="t_red">待审核</span> <span class="ps_right"> <input name="" type="button" value="修改" class="yellow"> <input name="" type="button" value="删除" class="red"> </span>  </p> </li> <li> <p class="ps1"><a href="#">NO.03</a>2013-03-012 至 2013-03-18</p> <p class="ps2">铁板牛肉饭套餐+配茶树菇老鸭汤 </p> <p class="ps3"> <span class="t_red">待审核</span> <span class="ps_right"> <input name="" type="button" value="修改" class="yellow"> <input name="" type="button" value="删除" class="red"> </span>  </p> </li> <li> <p class="ps1"><a href="#">NO.01</a>2013-03-012 至 2013-03-18</p> <p class="ps2">铁板牛肉饭套餐+配茶树菇老鸭汤 </p> <p class="ps3"> <span class="t_green">已审核</span> <span class="ps_right"> <input name="" type="button" value="修改" class="yellow"> <input name="" type="button" value="查看" class="green"> </span>  </p> </li> </ul></div></div> <footer> <a href="#"><span class="order">订单</span></a> <a href="#"><span class="menu">菜单</span></a> <a href="#"><span class="sale">促销</span> </a> <a href="#"><span class="service">客服 </span></a> <a href="#" class="nav_on"><span class="finance">财务</span></a> </footer><script src="js/jquery.min.js" type="text/javascript"></script><script type="text/ecmascript">$(function(){$(".mall_cate").click(function(){$(this).toggleClass("mall_on");$(".deal_link").toggle();})})</script></body></html>';return t},VT.Temp=function(e){var t='﻿<header> <a href="javascript:app.closeDlg();" class="return"></a> 送餐进度</header><div class="title-header2"> <img src="images/user.png" alt="" align="absmiddle" /> <span id="phone"></span> <img src="images/clock.png" alt="" style="margin-left: 20px;" /> <span id="timespan"></span></div><div class="content"> <ul class="temp" id="tempContainer"> </ul> <ul class="temp_review" id="temp_review"> <li><a href="javascript:void(0)"> <input name="" type="radio" value="您好，已经送出去了，很快就到^_^" tap="quickSend" />您好，已经送出去了，很快就到^_^</a></li> <li><a href="javascript:void(0)"> <input name="" type="radio" value="您好，现在是高峰期，请耐心等一下^_^" tap="quickSend" />您好，现在是高峰期，请耐心等一下^_^</a></li> </ul> <div class="rw_footer"> <a href="javascript:void(0)" id="key"> <img src="images/key.png" alt="" /></a> <a href="javascript:void(0)" id="recordVoice"> <img src="images/voice.png" alt="" /></a> <input name="" type="text" class="input" id="txtMessage" /> <a href="javascript:void(0)" id="face"> <img src="images/face.png" alt="" /></a> <a href="javascript:void(0)"> <img src="images/add.png" alt="" tap="sendMessage" /></a> </div></div>';return t},VT.TempItem=function(e){var t="﻿",n=e;return e.type==1?(t+='<li class="guest" id="'+e.id+'"> <time>'+e.time+"</time> <span>"+(e.voice&&e.isplay===0?"<i></i>":"")+"<em></em> ",e.voice&&(t+=' <img src="images/voice2.png" alt="" align="middle" tempid="'+e.id+'" voice="'+e.voice+'" tap="playVoice"/> '),t+=" "+e.desc+"</span></li>"):(t+='<li class="shop" id="'+e.id+'"> <time>'+e.time+"</time> <span>"+(e.voice&&e.isplay===0?"<i></i>":"")+"<em></em> ",e.voice&&(t+=' <img src="images/voice2.png" alt="" align="middle" tempid="'+e.id+'" voice="'+e.voice+'" tap="playVoice"/> '),t+=" "+e.desc+"</span></li>"),t}