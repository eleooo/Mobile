/// <reference path="../lib/jquery/jquery-1.7.js" />
/// <reference path="../DS.js" />
/// <reference path="../WS.js" />


(function () {
    var _Menu = function () {
        var txtMenuName, container, wrap, _box;
        var curDir = false, dirInfos;
        var scroller, isLoading;
        var p = _Menu.prototype;
        function getDirItem(ct, dirId, dirName) {
            if (curDir && curDir.id == dirId)
                return curDir;
            else {
                var dc = ct.find("#__" + dirId);
                if (dc.length == 0) {
                    dc = $("<li><h2 tap='toggleMenus' data-id='" + dirId + "'>" + dirName + "</h2><div id='__" + dirId + "' data-id='" + dirId + "' style='display:none'></div></li>");
                    ct.append(dc);
                    var di = { s: 1, i: 0, d: dc.find("#__" + dirId), v: false, id: dirId, c: 0 };
                    dirInfos[dirId] = di;
                } else {
                    di = dirInfos[dirId];
                    di.d = dc;
                }
                return di;
            }
        }
        function renderDirs(ct, dirs) {
            var i, dr, di;
            for (i = 0; i < dirs.length; i++) {
                dr = dirs[i];
                di = getDirItem(ct, dr.id, dr.name);
                if (i == 0) {
                    di.d.show();
                    di.v = true;
                    curDir = di;
                }
            }
        }
        function getMenuItem(menu) {
            return VT["MenuItem"](menu);
        }

        function renderMenu(data) {
            var di, menu, item, i;
            var isEmpty = container.attr('empty') == '1';
            var tempContainer = isEmpty ? container.clone() : container;
            var menus = data.menus;
            if (data.dirs && data.dirs.length > 0)
                renderDirs(tempContainer, data.dirs);
            for (i = 0; i < menus.length; i++) {
                menu = menus[i];
                di = getDirItem(tempContainer, menu.dirid);
                item = di.d.find("#_" + menu.id);
                var m = getMenuItem(menu);
                if (item.length == 0) {
                    di.d.append(m);
                    di.c = di.c + 1;
                }
                else
                    item.replaceWith(m);
            }
            if (isEmpty) {
                container.html(tempContainer.html());
                for (i in dirInfos)
                    dirInfos[i].d = container.find("#__" + i);
            }
            if (i > 0)
                container.attr('empty', 0);
        }
        function getMenuList() {
            if (isLoading || (curDir && curDir.s && curDir.i >= curDir.s))
                return;
            var args = { q: getInputQueryVal(),
                p: curDir.i || 1,
                d: curDir.id || 0
            };
            isLoading = true;
            WS.GetMenus(args, function (result) {
                if (result.code > -1) {
                    renderMenu(result.data);
                    curDir.i = curDir.i + 1;
                    curDir.s = result.data.pageCount;
                }
                scroller.refresh();
                isLoading = false;
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
            dirInfos = {};
            isLoading = false;
            curDir = false;
            txtMenuName.val('');
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
                    var di = dirInfos[item.attr('data-dir')];
                    if (di) di.c = di.c - 1;
                    scroller.refresh();
                }
            });
        }
        p.searchMenu = function () {
            p.show();
        }
        p.toggleMenus = function (el) {
            if (isLoading) return;
            var di = dirInfos[el.attr('data-id')];
            //{ s: 1, i: 0, d: dr, v: false };
            if (di.v) {
                if (curDir && di.id == curDir.id) curDir = false;
                el.siblings("#__" + di.id).hide();
                scroller.refresh();
                di.v = false;
            } else {
                if (curDir) {
                    curDir.d.hide();
                    //container.find("#__" + curDir.id).hide();
                    curDir.v = false;
                }
                curDir = di;
                //el.siblings("#__" + di.id).show();
                di.v = true;
                di.d.show();
                if (di.c <= 0)
                    getMenuList();
                else
                    scroller.refresh();
            }
        }
    }
    window.$_Menu = _Menu;
})(window);