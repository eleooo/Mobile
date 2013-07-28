/// <reference path="../../js/app.js" />

(function () {
    var _Review = function () {
        var reviewList = false, pList, mall_cate = false, rw_num = false, deal_link = false, _box;
        var pageIndex = 0;
        var scroller, isLoading;
        var fType = { t: 'data-reply', v: 'all' };
        var p = _Review.prototype;

        function showReviewList() {
            if (isLoading)
                return;
            else
                isLoading = true; ;
            var args = {
                t: 3,
                b: DS.CompanyID(),
                i: pageIndex + 1,
                d1: $("#txtBeginReviewDate", _box).val(),
                d2: $("#txtEndReviewDate", _box).val()
            };
            WS.FacebookQuery(args, function (result) {
                if (result.code > -1) {
                    rw_num.eq(0).text(result.data.good);
                    rw_num.eq(1).text(result.data.normal);
                    rw_num.eq(2).text(result.data.bad);
                    if (result.data.html.length == 0 && pageIndex == 0) {
                        reviewList.html('').attr('empty', 1);
                    } else {
                        var len = result.data.html.length / 2;
                        var index = 0;
                        var id = 0, html = '';
                        var item;
                        var isEmpty = reviewList.attr('empty') == '1';
                        var tempContainer = isEmpty ? reviewList.clone() : reviewList;
                        //var filter = mall_cate.attr("data-type");
                        //reviewList.remove();
                        for (var i = 0; i < len; i++) {
                            id = result.data.html[index];
                            html = result.data.html[index + 1];
                            item = tempContainer.find("#r" + id);
                            if (item.length > 0)
                                item.replaceWith(html);
                            else {
                                item = $(html);
                                if (fType.v != 'all') {
                                    item.attr(fType.t) == fType.v ? item.show() : item.hide();
                                }
                                tempContainer.append(item);
                            }
                            index = index + 2;
                        }
                        if (isEmpty)
                            reviewList.html(tempContainer.html());
                        if (len > 0)
                            reviewList.attr('empty', 0);
                    }
                    pageIndex++;
                    scroller.refresh();
                }
                isLoading = false;
            });
        }

        p.box = function (el) {
            if (el) _box = el;
            return _box;
        }
        p.reset = function () {
            pageIndex = 0
            reviewList.html('').attr('empty', 1);
        }
        p.show = function () {
            p.reset();
            showReviewList();
        }
        p.init = function (isReturn) {
            reviewList = $("#reviewList", _box);
            pList = reviewList.parent();
//            mall_cate = $("#rmall_cate", _box).bind('mouseout', function () {
//                mall_cate.removeClass('mall_on');
//                deal_link.hide();
//            });
//            deal_link = $(".deal_link", _box).bind('mouseout', function () {
//                console.log("mouseout");
//                mall_cate.removeClass('mall_on');
//                deal_link.hide();
//            });
            rw_num = $("#rw_number", _box).find('i');
            app.bindDateSelector("txtBeginReviewDate", _box);
            app.bindDateSelector("txtEndReviewDate", _box);
//            mall_cate.parent().tap(function () {
//                var el = $(this).toggleClass("mall_on");
//                deal_link.toggle();
//                //el.hasClass('mall_on') ? deal_link.css('z-index', '10000') : deal_link.css('z-index', '0');
//            });
            //scroller = new IScroll(pList.get(0), { bounceTime: 50, scrollbars: true, interactiveScrollbars: true });
            scroller = app.iscroll(pList.get(0));
            scroller.on('scrollEnd', function () {
                if (Math.abs(scroller.y) >= Math.abs(scroller.maxScrollY)) {
                    showReviewList();
                }
            });
        }
        p.renderView = function (fnCallback) {
            var d = new Date();
            var d1 = d.DateAdd('d', 1 - d.getDate()).format("yyyy-MM-dd");
            fnCallback({ beginDate: d1, endDate: d.format("yyyy-MM-dd") });
        }
        p.showReview = function () {
            p.reset();
            showReviewList();
        }
        p.filter = function (el) {
            var dtype = el.attr("data-type");
            reviewList.find("li").each(function (i, item) {
                if (item.getAttribute('data-rate') === dtype)
                    item.style.display = 'list-item';
                else
                    item.style.display = 'none';
            });
            fType.t = 'data-rate';
            fType.v = dtype;
            scroller.refresh();
        }
        p.filterR = function (el) {
            var dtype = el.attr("data-type");
            var desc = el.text();
            if (dtype == "all")
                reviewList.find("li").show();
            else {
                reviewList.find("li").each(function (i, item) {
                    if (item.getAttribute('data-reply') === dtype)
                        item.style.display = 'list-item';
                    else
                        item.style.display = 'none';
                });
            }
            //el.attr("data-type", mall_cate.attr("data-type")).text(mall_cate.text());
            //mall_cate.attr("data-type", dtype).text(desc).trigger("mouseout");
            fType.t = 'data-reply';
            fType.v = dtype;
            scroller.refresh();
        }
        p.showReplyBox = function (el) {
            $("#box" + el.attr("data-id"), reviewList).toggle();
            scroller.refresh();
        }
        p.replyFaceBook = function (el) {
            var val = $("#txtbox" + el.attr("data-id"), reviewList).val();
            if (!val || val.length == 0) {
                app.logInfo("请输入回复内容.");
                return;
            }
            var args = { fbID: el.attr("data-id"), content: encodeURIComponent(val) };
            WS.ReplyFacebook(args, function (result) {
                if (result.code >= 0) {
                    var html = result.data.replace('[0]', val);
                    $("#r" + args.fbID, reviewList).append(html).find(".rw4,.rw5").remove();
                    scroller.refresh();
                    app.logInfo("回复成功.");
                } else
                    app.logInfo(result.message);
            });
        }
    }
    window.$_Review = _Review;
})(window);