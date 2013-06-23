/// <reference path="../../js/app.js" />

(function () {
    var _Review = function () {
        var reviewList = false, mall_cate = false, rw_num = false, deal_link = false, _box;
        var pageIndex = 0;
        var p = _Review.prototype;

        function showReviewList() {
            var args = {
                t: 4,
                b: DataStorage.CompanyID(),
                i: pageIndex + 1,
                d1: $("#txtBeginReviewDate", _box).val(),
                d2: $("#txtEndReviewDate", _box).val()
            };
            EleoooWrapper.FacebookQuery(args, function (result) {
                if (result.code > -1) {
                    rw_num.eq(0).text(result.data.good);
                    rw_num.eq(1).text(result.data.normal);
                    rw_num.eq(2).text(result.data.bad);
                    if (result.data.html.length == 0 && pageIndex == 0) {
                        reviewList.find("li").remove();
                    } else {
                        var len = result.data.html.length / 2;
                        var index = 0;
                        var id = 0, html = '';
                        var item;
                        var filter = mall_cate.attr("data-type");
                        for (var i = 0; i < len; i++) {
                            id = result.data.html[index];
                            html = result.data.html[index + 1];
                            item = reviewList.find("#item" + id);
                            if (item.length > 0)
                                item.replaceWith(html);
                            else {
                                item = $(html);
                                if (filter != 'All' && filter != item.attr("data-reply")) {
                                    item.hide();
                                }
                                reviewList.append(item);
                            }
                            index = index + 2;
                        }
                    }
                    pageIndex++;
                }
            });
        }
        
        p.box = function (el) {
            if (el) _box = el;
            return _box;
        }
        p.onShow = function () {
            showReviewList();
            reviewList.lazyload({ load: showReviewList });
        }
        p.onLoad = function (isReturn) {
            reviewList = $("#reviewList", _box);
            mall_cate = $("#mall_cate", _box);
            deal_link = $(".deal_link", _box);
            rw_num = $("#rw_number > i", _box);
            app.bindDateSelector("txtBeginDate", _box);
            app.bindDateSelector("txtEndDate", _box);
            mall_cate.parent().tap(function () {
                $(this).toggleClass("mall_on");
                deal_link.toggle();
            });
        }
        p.renderView = function (fnCallback) {
            var d = (new Date()).format("yyyy-MM-dd");
            fnCallback({ beginDate: d, endDate: d });
        }
        p.showReview = function () {
            showReviewList();
        }
        p.filterReview = function (el) {
            var dtype = el.attr("data-type");
            var desc = el.text();
            if (dtype == "All")
                reviewList.find("li").show();
            else {
                var result = reviewList.find("li");
                var item;
                for (var i = 0; i < result.length; i++) {
                    var item = result.eq(i);
                    if (item.attr("data-reply") == dtype)
                        item.show();
                    else
                        item.hide();
                }
            }
            el.attr("data-type", mall_cate.attr("data-type")).text(mall_cate.text());
            mall_cate.attr("data-type", dtype).text(desc).trigger("tap");
        }
        p.showReplyBox = function (el) {
            $("#box" + el.attr("data-id"), reviewList).toggle();
        }
        p.replyFaceBook = function (el) {
            var val = $("#txtbox" + el.attr("data-id"), reviewList).val();
            if (!val || val.length == 0) {
                app.logInfo("请输入回复内容.");
                return;
            }
            var args = { fbID: el.attr("data-id"), content: encodeURIComponent(val) };
            EleoooWrapper.ReplyFacebook(args, function (result) {
                if (result.code >= 0) {
                    var html = result.data.replace('[0]', val);
                    $("#item" + args.fbID, reviewList).append(html).find(".rw4,.rw5").remove();
                    app.logInfo("回复成功.");
                } else
                    app.logInfo(result.message);
            });
        }
    }
    window.$_Review = _Review;
})(window);