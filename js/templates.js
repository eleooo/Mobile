var VT={};VT.Balance=function(e){var t='<header> <a href="javascript:void(0);" tap="app.goback" class="return">&nbsp;&nbsp;</a> 结算记录 </header><div class="title-header"> <input type="text" class="date" value="'+e.beginDate+'" id="txtBalanceBeginDate" /> 至 <input type="text" class="date" value="'+e.endDate+'" id="txtBalanceEndDate" /> <span class="qry_btn"><a href="javascript:void(0);" tap="show">查询</a></span></div><div class="content financeContent"> <ul class="scroller detail" id="dList"> </ul></div>';return t},VT.Detail=function(e){var t='<header> <div class="deal_btn"><a href="javascript:void(0)" tap="app.showBalance">结算记录</a></div> 收支明细 </header><div class="title-header"> <div class="th-int"> <input type="text" class="date" value="'+e.beginDate+'" id="txtDetailBeginDate" /> 至 <input type="text" class="date" value="'+e.endDate+'" id="txtDetailEndDate" /> <span class="qry_btn"><a href="javascript:void(0);" tap="show">查询</a></span> </div></div><div class="content financeContent"> <ul class="scroller detail" id="fList"> </ul></div>';return t},VT.Hall=function(e){var t='<header><div class="deal_btn"><a href="javascript:void(0);" tap="app.logout">退出登录</a></div> <a href="javascript:void(0);" class="return" tap="app.goback"></a>餐厅信息 </header><div class="wrap rushwrap"> <ul class="scroller detail rush" id="ctHall"> </ul></div>';return t},VT.HallView=function(e){var t='<li>本店账号：<input type="text" class="input" value="'+e.p+'" id="txtPhone" /></li><li class="open_time">营业时间：<input type="text" class="input" value="'+e.CompanyWorkTime+'" style="width: 120px;" id="txtWorkingTime" /> <a href="javascript:void(0);"> <img src="images/add.png" alt="" align="absmiddle" tap="addWorkingtime" /></a></li><li>起送金额：<input type="number" class="input" value="'+e.OnSetSum+'" id="txtOnSetSum" /></li><li>登录密码：<input type="password" class="input" value="" id="p1" /></li><li>确认密码：<input type="password" class="input" value="" id="p2" /></li><li class="link">当前状态：<img src="images/'+(e.IsSuspend?"off":"on")+'.png" alt="" tap="changeStatus" /></li><li class="link"> <div class="d_right"> '+e.Area+'第<span class="price">'+e.Ranking1+'</span>名</div> 本店人气：<span class="price">'+e.Amount+'</span></li><li class="link"> <div class="d_right"> '+e.Area+'第<span class="price">'+e.Ranking2+'</span>名</div> 送餐速度：<span class="price">'+e.OrderElapsed+'</span></li><li> <input type="button" class="btn green" value="保存" tap="saveMyInfo" /></li><li style="line-height: 10px; border-bottom: 0px;"></li>';return t},VT.Login=function(e){var t='<header> <div class="deal_btn"><a href="javascript:void(0);" tap="showSendMsn" >忘了密码</a></div>用户登录</header><div class="container"> <div class="logo"> <p> <img src="images/logo.png" alt=""></p> <p> 商家操作系统</p> </div> <ul class="login"> <li>帐号：<input class="input" type="tel" id="txtLoginUserPhone" maxlength="11" /></li> <li>密码：<input class="input" type="password" id="txtLoginUserPwd" maxlength="6" /></li> <li id="sendPwd" style="display: none"> <input type="button" class="btn green" value="短信获取密码" tap="sendPassword" /></li> <li class="link"> <input name="" type="checkbox" value="" id="cbAutoLogin" />自动登录 <input name="" type="checkbox" value="" id="cbSavePwd" />记住密码 </li> <li> <input type="button" class="btn green" value="登录" tap="login" /></li> </ul></div>';return t},VT.Menu=function(e){var t='<header class="leftHeader"> <div class="search"><input class="input s_input" type="text" value="输入餐点名称搜索" defVal="输入餐点名称搜索" id="txtMenuName" onchange="app.Menu.searchMenu(this);"/></div> 菜单管理</header><div class="wrap menuwrap"> <ul class="scroller h_order m_order" id="menuContainer">  </ul></div>';return t},VT.MenuItem=function(e){var t='<div class="main_menu" id="_'+e.id+'"> <h4> '+e.name+'</h4> <div class="menu_down"> <span>单价：'+numeral(e.price).format("0.00")+'</span> 调价:<input name="" type="number" class="input zq" onchange="app.Menu.changePrice(this);" data-id="'+e.id+'" data-price="'+e.price+'" /> <input name="input" type="button" value="'+(e.isoutofstock?"缺货":"有货")+'" class="'+(e.isoutofstock?"red":"green")+'" tap="outOfStockItem" data-id="'+e.id+'" data-isout="'+e.isoutofstock+'" /> <input name="" type="button" value="删除" class="red" tap="deleteItem" data-id="'+e.id+'" data-dir="';return e.diridout+='" /> </div></div>',t},VT.OrderHandle=function(e){var t='<header><a href="javascript:void(0);" tap="app.goback" class="return">&nbsp;&nbsp;</a>订单处理</header><div class="title-header2"> <img src="images/user.png" alt="" align="absmiddle" /> <span id="cthnum"></span> <img src="images/clock.png" alt="" style="margin-left: 20px;" /> <span id="cthts"></span></div><div class="content orderHandle"> <div class="scroller" id="cthandler"> </div></div>';return t},VT.OrderHandleView=function(e){var t='<ul class="h_order">';for(var n=0;n<e.details.length;n++){var r=e.details[n];app.OrderHandle.processItem(r),t+=" <li> <h2> "+r.DirName+'</h2> <div class="menu_show"> <span>'+r.MenuName+"</span><span>"+r.OrderQty+"份</span><span>"+numeral(r.OrderSum).format("0.00")+'</span></div> <div class="menu_down"> <span>单价：'+numeral(r.OrderPrice).format("0.00")+'</span><span>调价：<input type="number" class="input zq" onchange="app.OrderHandle.changePrice(this);" data-id="'+r.MenuId+'" data-price="'+r.OrderPrice+'" /></span><span> <input type="button" value="暂缺" class="green" tap="outOfStock" data-id="'+r.MenuId+'" /></span></div> </li>'}return t+='</ul><ul class="warm"> <li>总计：<span class="price">'+numeral(e.OrderSumOk).format("0.00")+'</span> 其中送餐费 <span class="price">'+numeral(e.ServiceSum).format("0.00")+"</span> </li> <li>备注："+e.OrderMemo+" </li> <li>地址："+e.Address+' </li> <li class="em_review" tap="toggleReview">回复<em></em></li></ul><ul class="review" id="reviewContainer"> <li><a href="javascript:void(0)" tap="selectMsn"> <input name="msnType" type="radio" value="0" checked="checked" data-message="订单已经确认，餐厅开始备餐。" /><span>订单已经确认，餐厅开始备餐。</span></a></li> <li><a href="javascript:void(0)" tap="selectMsn"> <input name="msnType" type="radio" value="1" data-message="" /><span>抱歉，XXX今天暂缺，请修改后重新下单。</span></a></li> <li><a href="javascript:void(0)" tap="selectMsn"> <input name="msnType" type="radio" value="1" data-message="" /><span>经餐厅确认：XXX价格调整为XX元。</span></a></li> <li><a href="javascript:void(0)" tap="selectMsn"> <input name="msnType" type="radio" value="2" data-message="抱歉，当前暂不外送，请选择其他餐厅。" /><span>抱歉，当前暂不外送，请选择其他餐厅。</span></a></li> <li><a href="javascript:void(0)" tap="selectMsn"> <input name="msnType" type="radio" value="4" data-message="订单已取消。" /><span>订单已取消。</span></a></li> <li> <input type="button" class="btn green" value="回复" id="btnReview" tap="confirmOrder" /></li></ul>',t},VT.OrderList=function(e){var t='<header class="leftHeader"> <div class="search"><input class="input s_input" type="tel" value="" defVal="输入会员账号搜索" id="txtOrderListUserPhone"/></div> 订单记录 </header><div class="title-header"> <div class="th-int"> <input type="text" class="date" value="'+e.beginDate+'" id="txtOrderListBeginDate" /> 至 <input type="text" class="date" value="'+e.endDate+'" id="txtOrderListEndDate" /> <span class="qry_btn"> <a href="javascript:void(0);" tap="showOrderList">查询</a></span> </div></div><div class="content orderList"> <ul class="scroller" id="orderContainer"> </ul></div><div class="state" id="state"> <div class="s1" id="s1"> <a href="javascript:void(0)" data-status="notstarted"><i class="i_red">0</i>待处理</a> <a href="javascript:void(0)" data-status="modified"><i class="i_yellow">0</i>已修改</a> <a href="javascript:void(0)" data-status="urge"><i class="i_red">0</i>催餐中</a> <a href="javascript:void(0)" data-status="canceled"><i class="i_yellow">0</i>已取消</a> <a href="javascript:void(0)" data-status="all">全部</a> </div> <div class="s2" id="s2"> 总计<i data-status="sumok">0.00</i> 现金<i data-status="sum">0.00</i> 储值<i data-status="sumcash">0.00</i> 积分<i data-status="sumpoint">0.00</i> <span>返回</span> </div></div>';return t},VT.OrderListItem=function(e){var t='<li id="_'+e.ID+'" data-id="'+e.ID+'" data-status="'+e.status.status+'" ><span><img src="images/user.png" alt="" align="absmiddle" tap="showTempView" data-id="'+e.ID+'" /></span> <span tap="showTempView" data-id="'+e.ID+'">'+e.MemberPhoneNumber+'<u tap="showTempView" data-id="'+e.ID+'">NO.'+e.OrderNum+'</u></span><span class="pRight"><input name="" type="button" class="dr_btn '+e.status.cls+'" value="'+e.status.text+'" tap="showHandleView" data-id="'+e.ID+'" data-status="'+e.status.status+'" /></span></li>';return t},VT.Review=function(e){var t='<header> <div class="deal_btn"><a href="javascript:void(0);" tap="app.showHall">餐厅信息</a></div> 会员点评 </header><div class="title-header"> <div class="th-int"> <input type="text" class="date" value="'+e.beginDate+'" id="txtBeginReviewDate" /> 至 <input type="text" class="date" value="'+e.endDate+'" id="txtEndReviewDate" /> <span class="qry_btn"><a href="javascript:void(0);" tap="showReview">查询</a></span> </div></div><div class="rw_number" id="rw_number"> 好评：<i>0</i>中评：<i>0</i>差评：<i>0</i></div><div class="content reviewContent"> <!--已回复--> <ul class="scroller reviewList" id="reviewList"> </ul></div>';return t},VT.Rush=function(e){var t='<header> <a href="javascript:void(0)" class="return" tap="app.goback">&nbsp;&nbsp;</a> 抢购条件 </header><div class="wrap rushwrap"> <ul class="scroller detail rush"> <li><span>积分兑换：</span><input class="input" type="number" id="ItemPoint" t="dec" /></li> <li><span>现金支付：</span><input class="input" type="number" id="ItemNeedPay" t="dec" /></li> <li><span>投放数量：</span><input type="number" class="input" value="" id="ItemAmount" t="int" /></li> <li><span>消费频率：</span><input type="number" class="input" value="" id="OrderFreqLimit" t="int" /></li> <li><span>单次金额：</span><input type="number" class="input" value="" id="OrderSumLimit" t="dec" /></li> <li><span>投放周期：</span><input type="text" class="input" value="" id="ItemDate" /></li> <li><span>至：</span><input type="text" class="input" value="" id="ItemEndDate" /></li> <li><span>促销时段：</span><input class="input" type="text" id="WorkingHours" /></li> <li class="link"><span>抢购次数：</span><input name="ItemLimit" type="radio" value="3" />每天限一次<input name="ItemLimit" type="radio" value="2" />本期限一次</li> <li><span>上传图片：</span><a href="javascript:void(0)" tap="takeaPic"><img src="images/camera.png" alt="" /></a> <img src="" alt="" id="ItemPic" class=\'hide\' style=\'width: 120px; height: 120px\' /> </li> <li> <input type="button" class="btn green" value="提交" tap="saveItem" /></li> <li style="line-height: 10px; border-bottom: 0px;"></li> </ul></div>';return t},VT.RushRecord=function(e){var t='<header> <a href="javascript:void();" tap="app.goback" class="return">&nbsp;&nbsp;</a> 抢购记录 </header><div class="title-header"> <input type="text" class="date" value="'+e.beginDate+'" id="txtRushRecordBeginDate" /> 至 <input type="text" class="date" value="'+e.endDate+'" id="txtRushRecordEndDate" /> <span class="qry_btn"><a href="javascript:void(0);" tap="showRushList">查询</a></span></div><div class="content orderList"> <ul class="scroller rush_record" id="rushList"> </ul></div><div class="state"> 数量总计：<span class="price" id="amountSum">0</span> 积分收入：<span class="price" id="pointSum">0.00</span></div>';return t},VT.RushRecordItem=function(e){var t='<li id="_'+e.ItemID+'" data-point="'+e.ItemPoint+'" data-qty="1"> <img src="images/user.png" alt="" align="absmiddle" /> <div> <span class="user">'+e.MemberPhoneNumber+'</span><span class="time"> '+e.OrderDate+'</span></div> <div class="deal_div"> <span>原价：<b>'+numeral(e.OrderPrice).format("0.00")+"</b></span><span>积分：<b>"+numeral(e.ItemPoint).format("0.00")+"</b></span><span>数量：<b>1</b></span></div></li>";return t},VT.RushView=function(e){var t='<li><span>积分兑换：</span><input class="input" type="number" id="ItemPoint" t="dec" /></li><li><span>现金支付：</span><input class="input" type="number" id="ItemNeedPay" t="dec" /></li><li><span>投放数量：</span><input type="number" class="input" value="" id="ItemAmount" t="int" /></li><li><span>消费频率：</span><input type="number" class="input" value="" id="OrderFreqLimit" t="int" /></li><li><span>单次金额：</span><input type="number" class="input" value="" id="OrderSumLimit" t="dec" /></li><li><span>投放周期：</span><input type="text" class="input" value="" id="ItemDate" /></li><li><span>至：</span><input type="text" class="input" value="" id="ItemEndDate" /></li><li><span>促销时段：</span><input class="input" type="text"></li><li class="link"><span>抢购次数：</span><input name="ItemLimit" type="radio" value="3" />每天限一次<input name="ItemLimit" type="radio" value="2" />本期限一次</li><li><span>上传图片：</span><a href="javascript:void(0)" tap="takeaPic"><img src="images/camera.png" alt="" /></a> <img src="" alt="" id="ItemPic" /></li><li> <input type="button" class="btn green" value="提交" tap="saveItem" /></li><li style="line-height: 10px; border-bottom: 0px;"></li>';return t},VT.Sale=function(e){var t='<header> <div class="deal_btn"><a href="javascript:void(0);" tap="app.showSaleList">促销列表</a></div> 促销方案 </header><div class="wrap menuwrap"> <ul class="scroller h_order m_order" id="saleContainer"> </ul></div>';return t},VT.SaleItem=function(e){var t="",n=numeral(e.price).format("0.00");return t+='<div class="main_menu" id="_'+e.id+'" data-name="'+escape(e.name)+'" data-price="'+n+'"> <h4 style="padding-bottom: 5px;"> '+e.name+' </h4> <div class="menu_down" style="line-height: 26px;"> <span>单价：'+n+' </span> <input type="button" value="加入促销" class="green" style=" float:right;" data-id="'+e.id+'" tap="toggleSale" /> </div></div>',t},VT.SaleList=function(e){var t='<header> <a href="javascript:void();" tap="app.goback" class="return">&nbsp;&nbsp;</a> 促销列表 <div class="deal_btn"><a href="javascript:void(0);" tap="app.showRushRecord">抢购记录</a></div> </header><div class="title-header"> <input type="text" class="date" value="'+e.beginDate+'" id="txtSaleListBeginDate" /> 至 <input type="text" class="date" value="'+e.endDate+'" id="txtSaleListEndDate" /> <span class="qry_btn"><a href="javascript:void(0);" tap="showSaleList">查询</a></span></div><div class="content saleList"> <ul class="scroller slist" id="saleList"> </ul></div>';return t},VT.SaleListItem=function(e){var t='<li id="_'+e.ItemID+'"> <p class="ps1"> <a href="javascript:void(0);">NO.'+e.Row+"</a>"+e.ItemDate+" 至 "+e.ItemEndDate+'</p> <p class="ps2"> '+e.ItemTitle+' </p> <p class="ps3"> <span class="t_red">'+e.ItemStatus+'</span> <span class="ps_right"> <input type="button" value="修改" class="yellow" data-id="'+e.ItemID+'" tap="showRush" /> <input type="button" value="删除" class="red" data-id="'+e.ItemID+'" tap="delItem" /> </span> </p></li>';return t},VT.Temp=function(e){var t='<header> <a href="javascript:void(0);" tap="app.goback" class="return">&nbsp;&nbsp;</a> 送餐进度</header><div class="title-header2"> <img src="images/user.png" alt="" align="absmiddle" /> <span id="phone"></span> <img src="images/clock.png" alt="" style="margin-left: 20px;" /> <span id="timespan"></span></div><div class="content tempContent"> <ul class="scroller temp" id="tempContainer"> </ul></div><ul class="temp_review" id="temp_review"> <li><a href="javascript:void(0)" tap="quickSend"> <input name="" type="radio" />您好，已经送出去了，很快就到^_^</a></li> <li><a href="javascript:void(0)" tap="quickSend"> <input name="" type="radio" />您好，现在是高峰期，请耐心等一下^_^</a></li></ul><div class="rw_footer"> <a href="javascript:void(0)" id="key"> <img src="images/key.png" alt="" /></a> <a href="javascript:void(0)" id="recordVoice"> <img src="images/voice.png" alt="" /></a> <input name="" type="text" class="input" id="txtMessage" /> <a href="javascript:void(0)" id="face"> <img src="images/face.png" alt="" /></a> <a href="javascript:void(0)"> <img src="images/add.png" alt="" tap="sendMessage" /></a></div>';return t},VT.TempItem=function(e){var t="";return e.type==1?(t+='<li class="guest" id="_'+e.id+'" data-id="'+e.id+'"> <time>'+e.time+"</time> <span>"+(e.voice&&e.isplay===0?"<i></i>":"")+"<em></em> ",e.voice&&(t+=' <img src="images/voice2.png" alt="" align="middle" data-id="'+e.id+'" data-isplay="'+e.isplay+'" data-voice="'+e.voice+'" tap="playVoice" /> '),t+=" "+e.desc+"</span></li>"):(t+='<li class="shop" id="_'+e.id+'" data-id="'+e.id+'"> <time>'+e.time+"</time> <span>"+(e.voice&&e.isplay===0?"<i></i>":"")+"<em></em> ",e.voice&&(t+=' <img src="images/voice2.png" alt="" align="middle" data-id="'+e.id+'" data-isplay="'+e.isplay+'" data-voice="'+e.voice+'" tap="playVoice" /> '),t+=" "+e.desc+"</span></li>"),t}