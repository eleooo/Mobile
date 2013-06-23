/// <reference path="../lib/jquery/jquery-1.7.js" />
/// <reference path="../DataStorage.js" />
/// <reference path="../EleoooWrapper.js" />


(function () {
    var _Menu = function () {
        var pageIndex = 0, pageCount = 1;
        var txtMenuName, menuContainer,_box;
        var curDir = false;
        var p = _Menu.prototype;
        function getDirItem(dirId, dirName) {
            if (curDir && curDir.attr('data-id') == dirId)
                return curDir;
            else {
                curDir = $("#__" + dirId, menuContainer);
                if (curDir.length == 0) {
                    curDir = $("<li id='__" + dirId + "' data-id='" + dirId + "'><h2>" + dirName + "</h2></li>");
                    menuContainer.append(curDir);
                }
                return curDir;
            }
        }
        function getMenuItem(menu) {
            return VT["MenuItem"](menu);
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
            var args = { q: getInputQueryVal(),
                p: pageIndex + 1
            };
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
        function getInputQueryVal() {
            var v = txtMenuName.val();
            return (v == txtMenuName.attr('defVal')) ? "" : v;
        }
        
        p.box = function (el) {
            if (el) _box = el;
            return _box;
        }
        p.onShow = function () {
            if (!app.hasNetwork()) {
                var menus = JSON.parse(DataStorage.ViewCache("Menu") || "{}");
                if (menus.menus) {
                    menuContainer.html(menus.menus);
                }
                pageIndex = menus.pageIndex || 0;
                pageCount = menus.pageCount || 1;
            } else
                getMenuList();
            menuContainer.lazyload({ load: getMenuList });
        }
        p.onLoad = function () {
            txtMenuName = $("#txtMenuName", _box).focusin(function () {
                if ($(this).val() == $(this).attr('defVal'))
                    $(this).val('');
            }).focusout(function () {
                if ($(this).val() == '')
                    $(this).val($(this).attr('defVal'));
            });
            menuContainer = $("#menuContainer", _box);
        }
        p.onClose = function () {
            var menus = {
                pageIndex: pageIndex,
                pageCount: pageCount,
                menus: menuContainer.html()
            };
            DataStorage.ViewCache("Menu", menus);
            delete menus;
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
            EleoooWrapper.SaveMenus(args, function (result) {
                if (result.code > -1) {
                    menuContainer.find("#_" + args.id).replaceWith(getMenuItem(result.data));
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
            EleoooWrapper.SaveMenus(args, function (result) {
                if (result.code > -1) {
                    menuContainer.find("#_" + args.id).replaceWith(getMenuItem(result.data));
                }
            });
        }
        p.deleteItem = function () {
            var item = $(this);
            var args = {
                cmd: 'del',
                id: item.attr("data-id")
            };
            EleoooWrapper.SaveMenus(args, function (result) {
                if (result.code > -1) {
                    menuContainer.find("#_" + args.id).remove();
                }
            });
        }
        p.searchMenu = function () {
            pageCount = 1;
            pageIndex = 0;
            getMenuList();
        }
    }
    window.$_Menu = _Menu;
})(window);