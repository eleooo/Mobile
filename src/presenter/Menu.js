/// <reference path="../lib/jquery/jquery-1.7.js" />
/// <reference path="../DS.js" />
/// <reference path="../WS.js" />


(function () {
    var _Menu = function () {
        var pageIndex = 0, pageCount = 1;
        var txtMenuName, container, wrap, _box;
        var curDir = false;
        var scroller;
        var p = _Menu.prototype;
        function getDirItem(ct, dirId, dirName) {
            if (curDir && curDir.attr('data-id') == dirId)
                return curDir;
            else {
                curDir = $("#__" + dirId, ct);
                if (curDir.length == 0) {
                    curDir = $("<li id='__" + dirId + "' data-id='" + dirId + "'><h2>" + dirName + "</h2></li>");
                    ct.append(curDir);
                }
                return curDir;
            }
        }
        function getMenuItem(menu) {
            return VT["MenuItem"](menu);
        }
        function renderMenu(menus) {
            var dir, menu, item, i;
            var isEmpty = container.attr('empty') == '1';
            var tempContainer = isEmpty ? container.clone() : container;
            curDir = false;
            for (i = 0; i < menus.length; i++) {
                menu = menus[i];
                dir = getDirItem(tempContainer, menu.dirid, menu.dirname);
                item = dir.find("#_" + menu.id);
                var m = getMenuItem(menu);
                if (item.length == 0)
                    dir.append(m);
                else
                    item.replaceWith(m);
            }
            if (isEmpty)
                container.html(tempContainer.html());
            if (i > 0)
                container.attr('empty', 0);
        }
        function getMenuList() {
            if (pageIndex >= pageCount)
                return;
            var args = { q: getInputQueryVal(),
                p: pageIndex + 1
            };
            WS.GetMenus(args, function (result) {
                if (pageIndex == 0)
                    container.html('').attr('empty', 1);
                if (result.code > -1) {
                    renderMenu(result.data.menus);
                    pageIndex++;
                    pageCount = result.data.pageCount;
                }
                scroller.refresh();
            });
        }
        function getInputQueryVal() {
            var v = txtMenuName.val();
            return (v == txtMenuName.attr('defVal')) ? "" : v;
        }

        p.box = function (el) {
            if (el) _box = el;
            return _box;
        }
        p.show = function () {
            p.reset();
            getMenuList();
        }
        p.reset = function () {
            pageIndex = 0;
            pageCount = 1;
            container.html('').attr('empty', 1);
        }
        p.init = function () {
            txtMenuName = $("#txtMenuName", _box).focusin(function () {
                if ($(this).val() == $(this).attr('defVal'))
                    $(this).val('');
            }).focusout(function () {
                if ($(this).val() == '')
                    $(this).val($(this).attr('defVal'));
            });
            container = $("#menuContainer", _box);
            wrap = container.parent();
            //scroller = new IScroll(wrap.get(0), { bounceTime: 50, scrollbars: true, interactiveScrollbars: true });
            scroller = app.iscroll(wrap.get(0));
            scroller.on('scrollEnd', function () {
                if (Math.abs(scroller.y) >= Math.abs(scroller.maxScrollY)) {
                    getMenuList();
                }
            });
        }
        p.changePrice = function (el) {
            var item = $(el);
            var val = numeral(item.val()).round(2);
            var price = numeral(item.attr("data-price")).round(2);
            if (val == price) {
                app.logInfo("新价与原价相同.");
                return;
            }
            var args = {
                cmd: 'chg',
                v: val,
                id: item.attr("data-id")
            };
            WS.SaveMenus(args, function (result) {
                if (result.code > -1) {
                    container.find("#_" + args.id).replaceWith(getMenuItem(result.data));
                }
            });
        }
        p.outOfStockItem = function () {
            var item = $(this);
            var args = {
                cmd: 'out',
                v: !(item.attr("data-isout") == "true"),
                id: item.attr("data-id")
            };
            WS.SaveMenus(args, function (result) {
                if (result.code > -1) {
                    container.find("#_" + args.id).replaceWith(getMenuItem(result.data));
                }
            });
        }
        p.deleteItem = function () {
            var item = $(this);
            var args = {
                cmd: 'del',
                id: item.attr("data-id")
            };
            WS.SaveMenus(args, function (result) {
                if (result.code > -1) {
                    container.find("#_" + args.id).remove();
                    scroller.refresh();
                }
            });
        }
        p.searchMenu = function () {
            p.show();
        }
    }
    window.$_Menu = _Menu;
})(window);