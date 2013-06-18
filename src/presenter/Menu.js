/// <reference path="../lib/jquery/jquery-1.7.js" />
/// <reference path="../DataStorage.js" />
/// <reference path="../EleoooWrapper.js" />


(function () {
    var _Menu = function () {
        var pageIndex = 0, pageCount = 1;
        var txtMenuName, menuContainer;
        var curDir = false;
        var p = _Menu.prototype;
        function getDirItem(dirId, dirName) {
            if (curDir && curDir.attr('id') == dirId)
                return curDir;
            else {
                curDir = $("#" + dirId, menuContainer);
                if (curDir.length == 0) {
                    curDir = $("<li id='" + dirId + "'><h2>" + dirName + "</h2></li>");
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
                dir = getDirItem(menu.DirID, menu.DirName);
                item = dir.find("#m" + menu.ID);
                if (item.length == 0)
                    dir.append(getMenuItem(menu));
                else
                    item.replaceWith(getMenuItem(menu));
            }
        }
        function getMenuList() {
            var args = { q: getInputQueryVal(),
                p: pageIndex++
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
        p.onLoad = function () {
            txtMenuName = $("#txtMenuName").focusin(function () {
                if ($(this).val() == $(this).attr('defVal'))
                    $(this).val('');
            }).focusout(function () {
                if ($(this).val() == '')
                    $(this).val($(this).attr('defVal'));
            });
            menuContainer = $("#menuContainer");
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
        p.onClose = function () {
            var menus = {
                pageIndex: pageIndex,
                pageCount: pageCount,
                menus: menuContainer.html()
            };
            DataStorage.ViewCache("Menu", menus);
            delete menus;
        }
        p.changePrice = function () {
            var item = $(this);
            var val = Number.round(parseFloat(item.val()) || 0, 2);
            var price = Number.round(parseFloat(item.attr("data-price")) || 0, 2);
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
                    menuContainer.find("#m" + args.id).replaceWith(getMenuItem(result.data));
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
                    menuContainer.find("#m" + args.id).replaceWith(getMenuItem(result.data));
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
                    menuContainer.find("#m" + args.id).remove();
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