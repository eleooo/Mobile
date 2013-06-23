/// <reference path="../Common.js" />
/// <reference path="../Application.js" />
/// <reference path="../EleoooWrapper.js" />

(function () {
    var _Sale = function () {
        var pageIndex = 0, pageCount = 1;
        var menuContainer, _box = false;
        var curDir = false;
        var itemInfo = false;
        var sumPrice = numeral(0);
        var p = _Sale.prototype;
        function getItemObj() {
            var d = new Date().format("yyyy-MM-dd");
            var d1 = new Date(d).DateAdd('d', 7).format("yyyy-MM-dd");
            var obj = {
                ItemPoint: null, //积分兑换
                ItemNeedPay: null, //现金支付
                ItemAmount: 1, //投放数量
                OrderFreqLimit: null, //消费频率
                OrderSumLimit: null, //平均金额
                ItemDate: d, //投放周期
                ItemEndDate: d1, //投放周期
                WorkingHours: null, //促销时段
                ItemLimit: 3, //抢购次数
                ItemPic: null,
                ItemSum: sumPrice.value(), //总额
                CompanyID: null,
                ItemInfo: JSON.stringify(itemInfo),
                ItemID: 0
            };
            return obj;
        }
        function getDirItem(dirId, dirName) {
            if (curDir && curDir.attr('data-id') == dirId)
                return curDir;
            else {
                curDir = $("#__" + dirId, menuContainer);
                if (curDir.length == 0) {
                    curDir = $("<li id='__" + dirId + "' data-id='" + dirId + "'><h2 style=\"color: #333; cursor: pointer;\" tap=\"toggleMenus\">" + dirName + "</h2></li>");
                    menuContainer.append(curDir);
                }
                return curDir;
            }
        }
        function getMenuItem(menu) {
            return VT["SaleItem"](menu);
        }
        function renderMenu(menus) {
            var dir, menu, item;
            curDir = false;
            for (var i = 0; i < menus.length; i++) {
                menu = menus[i];
                dir = getDirItem(menu.dirid, menu.dirname);
                item = dir.find("#_" + menu.id);
                var m = getMenuItem(menu);
                if (item.length == 0)
                    dir.append(m);
                else
                    item.replaceWith(m);
            }
        }
        function getMenuList() {
            var args = { p: pageIndex + 1 };
            EleoooWrapper.GetMenus(args, function (result) {
                if (pageIndex == 0)
                    menuContainer.find("li").remove();
                if (result.code > -1) {
                    renderMenu(result.data.menus);
                    pageIndex++;
                    pageCount = result.data.pageCount;
                }
            });
        }
        p.box = function (el) {
            if (el !== undefined)
                _box = el;
            return _box;
        }
        p.onShow = function (arg) {
            if (arg) {
                pageIndex = 0;
                pageCount = 1;
                itemInfo = [];
            }
            if (pageIndex == 0)
                getMenuList();
        }
        p.onLoad = function () {
            menuContainer = $("#saleContainer");
            itemInfo = [];
        }
        p.toggleSale = function (el) {
            if (el.hasClass('red')) {
                app.confirm("还需要继续选择菜单吗?", "促销方案", "继续选择,下一步", function (ret) {
                    if (ret == '1') {
                        Array.remove(itemInfo, parseInt(el.attr('data-id')));
                        sumPrice.subtract(el.attr('data-price'));
                        el.removeClass('red').addClass('green');
                    } else
                        app.showRushView(getItemObj());
                });
            } else {
                itemInfo.push(parseInt(el.attr('data-id')));
                sumPrice.add(el.attr('data-price'));
                el.removeClass('green').addClass('red');
                app.confirm("还需要继续选择菜单吗?", "促销方案", "继续选择,下一步", function (ret) {
                    if (ret != '1')
                        app.showRushView(getItemObj());
                });
            }
        }
        p.toggleMenu = function (el) {
            el.siblings().toggle();
        }
    }
    var _Rush = function () {
        var _itemInfo = false, _box = false;
        var imgItem, inputs, itemLimits;
        var imgData = false;
        function _takePicData(data) {
            imgData = data;
            imgItem.attr("src", "data:image/jpeg;base64," + data);
            imgItem.show();
        }
        function getInputdata() {
            var v, att;
            inputs.each(function (i, el) {
                v = el.value;
                att = el.getAttribute('t');
                if (t == 'dec')
                    v = parseFloat(v) || 0;
                else if (t == 'int')
                    v = parseInt(v) || 0;
                _itemInfo[el.id] = v;
            });
            _itemInfo["ItemLimit"] = parseInt(itemLimits.find(':checked').val());
            if (_itemInfo.ItemSum < _itemInfo.ItemNeedPay) {
                app.showtips("现金支付额不能大于促销总额.", undefined, false);
                return false;
            }
            if (!(_itemInfo.ItemPoint >= 0.5 && _itemInfo.ItemPoint <= 1.5)) {
                app.showtips("抢购积分必须在0.5-1.5之间.", undefined, false);
                return false;
            }
            return true;
        }
        var p = _Rush.prototype;
        p.box = function (el) {
            if (el) _box = el;
            return _box;
        }
        p.onLoad = function () {
            imgItem = $("#ItemPic", _box);
            inputs = $("input .input", _box);
            itemLimits = $("input[name='ItemLimit']", _box);
            app.bindDateSelector("ItemDate", _box);
            app.bindDateSelector("ItemEndDate", _box);
        }
        p.onShow = function (arg) {
            _itemInfo = arg;
            var v, att;
            inputs.each(function (i, el) {
                v = _itemInfo[el.id];
                att = el.getAttribute('t');
                if (v && t == 'dec')
                    v = numeral(v).format('0.00');
                el.value = v || '';
            });
            v = _itemInfo["ItemLimit"];
            itemLimits.find("[value='" + v + "']").attr('checked', true);
            v = _itemInfo["ItemPic"];
            imgData = false;
            if (v) {
                imgItem.attr("src", v);
                imgItem.show();
            } else
                imgItem.hide();
        }
        p.takeaPic = function (el) {
            if (!app.isCordovaApp()) {
                app.showtips("暂不支持此功能.", undefined, true);
                return;
            }
            navigator.camera.getPicture(_takePicData, function (ex) { }, { quality: 30, destinationType: destinationType.DATA_URL });
        }
        p.saveItem = function (el) {
            if (getInputdata()) {
                var arg = {
                    item: JSON.stringifty(_itemInfo),
                    img: imgData || ''
                };
                EleoooWrapper.SaveItem(arg, function (result) {
                    app.showtips(result.message,undefined,true);
                });
            }
        }
    }
    window.$_Sale = _Sale;
    window.$_Rush = _Rush;
})(window);