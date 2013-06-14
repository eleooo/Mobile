/*
* MultiSelect v0.9.5
* Copyright (c) 2012 Louis Cuny
*
* This program is free software. It comes without any warranty, to
* the extent permitted by applicable law. You can redistribute it
* and/or modify it under the terms of the Do What The Fuck You Want
* To Public License, Version 2, as published by Sam Hocevar. See
* http://sam.zoy.org/wtfpl/COPYING for more details.
*/

!function ($) {

    "use strict";


    /* MULTISELECT CLASS DEFINITION
    * ====================== */

    var MultiSelect = function (element, options) {
        this.options = options;
        this.$element = $(element);

        var id = this.$element.attr('id');

        this.$container = $('<div/>', { 'id': "ms-" + id, 'class': "ms-container" });
        this.$selectableContainer = $('<div/>', { 'class': 'ms-selectable' });
        this.$selectionContainer = $('<div/>', { 'class': 'ms-selection' });
        this.$selectableUl = $('<ul/>', { 'class': "ms-list" });
        this.$selectionUl = $('<ul/>', { 'class': "ms-list" });
        this.scrollTo = 0;
        this.selectedVal = [];
        this.sanitizeRegexp = new RegExp("\\W+", 'gi');
    };

    MultiSelect.prototype = {
        constructor: MultiSelect,

        init: function () {
            var that = this,
          ms = this.$element;

            if (ms.next('.ms-container').length === 0) {
                ms.css({ position: 'absolute', left: '-9999px' });
                ms.attr('id', ms.attr('id') ? ms.attr('id') : 'ms-' + Math.ceil(Math.random() * 1000));

                var optgroupLabel = null,
            optgroupId = null,
            optgroupCpt = 0,
            optgroupContainerTemplate = '<li class="ms-optgroup-container"></li>',
            optgroupUlTemplate = '<ul class="ms-optgroup"></ul>',
            optgroupLiTemplate = '<li class="ms-optgroup-label"><span></span></li>';

                ms.find('optgroup, option').each(function () {
                    if ($(this).is('optgroup')) {
                        optgroupLabel = '<span>' + $(this).attr('label') + '</span>';
                        optgroupId = 'ms-' + ms.attr('id') + '-optgroup-' + optgroupCpt;

                        var optgroup = $(this),
                optgroupSelectable = $(optgroupContainerTemplate),
                optgroupSelection = $(optgroupContainerTemplate),
                optgroupSelectionLi = $(optgroupLiTemplate),
                optgroupSelectableLi = $(optgroupLiTemplate);

                        //                        if (that.options.selectableOptgroup) {
                        //                            optgroupSelectableLi.on('click', function () {
                        //                                var values = optgroup.children(':not(:selected)').map(function () { return $(this).val(); }).get();
                        //                                that.select(values);
                        //                            });

                        //                            optgroupSelectionLi.on('click', function () {
                        //                                var values = optgroup.children(':selected').map(function () { return $(this).val(); }).get();
                        //                                that.deselect(values);
                        //                            });
                        //                        }

                        optgroupSelectableLi.html(optgroupLabel);

                        optgroupSelectable.attr('id', optgroupId + '-selectable')
              .append($(optgroupUlTemplate)
                .append(optgroupSelectableLi));

                        that.$selectableUl.append(optgroupSelectable);

                        //                        optgroupSelectionLi.html(optgroupLabel);

                        //                        optgroupSelection.attr('id', optgroupId + '-selection')
                        //              .append($(optgroupUlTemplate)
                        //                .append(optgroupSelectionLi));

                        //that.$selectionUl.append(optgroupSelection);

                        optgroupCpt++;

                    } else {

                        var attributes = "";
                        for (var cpt = 0; cpt < this.attributes.length; cpt++) {
                            var attr = this.attributes[cpt];

                            if (!that.isDomNode(attr.name)) {
                                attributes += attr.name + '="' + attr.value + '" ';
                            }
                        }
                        var selectableLi = $('<li ' + attributes + '><span>' + $(this).text() + '</span></li>'), selectedLi = selectableLi.clone();
                        var value = $(this).val(), msId = that.sanitize(value, that.sanitizeRegexp);
                        selectableLi.data('ms-value', value).addClass('ms-elem-selectable').attr('id', msId + '-selectable');

                        //that.$selectionUl.find('.ms-optgroup-label').hide();

                        //                        if ($(this).prop('disabled') || ms.prop('disabled')) {
                        //                            if (this.selected) {
                        //                                selectedLi.prop('disabled', true);
                        //                                selectedLi.addClass(that.options.disabledClass);
                        //                            } else {
                        //                                selectableLi.prop('disabled', true);
                        //                                selectableLi.addClass(that.options.disabledClass);
                        //                            }
                        //                        }

                        if (optgroupId) {
                            that.$selectableUl.children('#' + optgroupId + '-selectable').find('ul').first().append(selectableLi);
                            //that.$selectionUl.children('#' + optgroupId + '-selection').find('ul').first().append(selectedLi);
                        } else {
                            that.$selectableUl.append(selectableLi);
                            //that.$selectionUl.append(selectedLi);
                        }
                    }
                });

                if (that.options.selectableHeader) {
                    that.$selectableContainer.append(that.options.selectableHeader);
                }
                that.$selectableContainer.append(that.$selectableUl);
                if (that.options.selectableFooter) {
                    that.$selectableContainer.append(that.options.selectableFooter);
                }

                if (that.options.selectionHeader) {
                    that.$selectionContainer.append(that.options.selectionHeader);
                }
                that.$selectionContainer.append(that.$selectionUl);
                if (that.options.selectionFooter) {
                    that.$selectionContainer.append(that.options.selectionFooter);
                }

                that.$container.append(that.$selectableContainer);
                that.$container.append(that.$selectionContainer);
                ms.after(that.$container);
                that.$selectableUl.on('mouseenter', '.ms-elem-selectable', function () {
                    $('li', that.$container).removeClass('ms-hover');
                    $(this).addClass('ms-hover');
                }).on('mouseleave', function () {
                    $('li', that.$container).removeClass('ms-hover');
                });

                var action = that.options.dblClick ? 'dblclick' : 'click';

                that.$selectableUl.on(action, '.ms-elem-selectable', function () {
                    that.select($(this).data('ms-value'));
                });
                that.$selectionUl.on(action, '.ms-elem-selection', function () {
                    that.deselect($(this).data('ms-value'));
                });


                that.$selectionUl.on('mouseenter', '.ms-elem-selection', function () {
                    $('li', that.$selectionUl).removeClass('ms-hover');
                    $(this).addClass('ms-hover');
                }).on('mouseleave', function () {
                    $('li', that.$selectionUl).removeClass('ms-hover');
                });

                that.$selectableUl.on('focusin', function () {
                    $(this).addClass('ms-focus');
                    that.$selectionUl.focusout();
                }).on('focusout', function () {
                    $(this).removeClass('ms-focus');
                    $('li', that.$container).removeClass('ms-hover');
                });

                that.$selectionUl.on('focusin', function () {
                    $(this).addClass('ms-focus');
                }).on('focusout', function () {
                    $(this).removeClass('ms-focus');
                    $('li', that.$container).removeClass('ms-hover');
                });

                ms.on('focusin', function () {
                    ms.focusout();
                    that.$selectableUl.focusin();
                }).on('focusout', function () {
                    that.$selectableUl.removeClass('ms-focus');
                    that.$selectionUl.removeClass('ms-focus');
                });
            }
            if (typeof that.options.afterInit === 'function') {
                that.options.afterInit.call(this, this.$container);
            }
        },

        'refresh': function () {
            this.destroy();
            this.$element.multiSelect(this.options);
        },

        'destroy': function () {
            $("#ms-" + this.$element.attr("id")).remove();
            this.$element.removeData('multiselect');
        },
        'vals': function (fnCallback) {
            if ($.isFunction(fnCallback)) {
                var slItems = [];
                var that = this;
                $.each(that.selectedVal, function (i, val) {
                    var id = that.sanitize(val, that.sanitizeRegexp);
                    slItems.push(that.$selectionUl.find('#' + id + '-selection'));
                });
                fnCallback(slItems);
            }
        },
        'select': function (value, method) {
            if (typeof value === 'string') { value = [value]; }
            var that = this;
            //console.log(JSON.stringify(that.selectedVal));
            $.each(value, function (i, val) {
                if ($.inArray(that.selectedVal, val) > -1) return;
                var id = that.sanitize(val, that.sanitizeRegexp);
                var stLi = that.$selectableUl.find('#' + id + '-selectable');
                if (stLi.length == 0) return;
                var stOptGroup = stLi.parent().parent();
                var gId = stOptGroup.attr('id');
                var optGroup = that.$selectionUl.find(".ms-optgroup-container").last();
                if (optGroup.attr('optgid') !== gId) {
                    optGroup = $(["<li class=\"ms-optgroup-container\" optgid=\"" + gId + "\">",
                                  "<ul class=\"ms-optgroup\"><li class=\"ms-optgroup-label\">",
                                  stOptGroup.find("ul li:first-child").html() + "</li></ul></li>"].join(''));
                    that.$selectionUl.append(optGroup);
                }
                var ssLi = stLi.clone().data("ms-value", val).attr("class", "ms-elem-selection").attr("id", id + '-selection');
                stLi.hide();
                if (stOptGroup.find("li :visible").length <= 1)
                    stOptGroup.hide();
                optGroup.find("ul").append(ssLi);
                that.selectedVal.push(val);
            });
        },

        'deselect': function (value) {
            if (typeof value === 'string') { value = [value]; }
            var that = this;
            $.each(value, function (i, val) {
                var id = that.sanitize(val, that.sanitizeRegexp);
                var ssLi = that.$selectionUl.find('#' + id + '-selection');
                if (ssLi.length == 0) return;
                var ssOptGroup = ssLi.parent().parent();
                //that.$selectableUl.find("#" + ssOptGroup.attr("optgid")).show();
                that.$selectableUl.find("#" + id + "-selectable").show().parent().parent().show();
                ssLi.remove();
                if (ssOptGroup.find("li :visible").length <= 1)
                    ssOptGroup.remove();
                var pos = $.inArray(that.selectedVal, val);
                if (pos > -1)
                    that.selectedVal.splice(pos, 1);
            });
        },

        'select_all': function () {
            var ms = this.$element,
          values = ms.val();
            ms.find('option').prop('selected', true);
            this.$selectableUl.find('.ms-elem-selectable').addClass('ms-selected').hide();
            this.$selectionUl.find('.ms-optgroup-label').show();
            this.$selectableUl.find('.ms-optgroup-label').hide();
            this.$selectionUl.find('.ms-elem-selection').addClass('ms-selected').show();
            this.$selectionUl.focusin();
            this.$selectableUl.focusout();
            ms.trigger('change');
            if (typeof this.options.afterSelect === 'function') {
                var selectedValues = $.grep(ms.val(), function (item) {
                    return $.inArray(item, values) < 0;
                });
                this.options.afterSelect.call(this, selectedValues);
            }
        },

        'deselect_all': function () {
            var ms = this.$element,
          values = ms.val();

            ms.find('option').prop('selected', false);
            this.$selectableUl.find('.ms-elem-selectable').removeClass('ms-selected').show();
            this.$selectionUl.find('.ms-optgroup-label').hide();
            this.$selectableUl.find('.ms-optgroup-label').show();
            this.$selectionUl.find('.ms-elem-selection').removeClass('ms-selected').hide();
            this.$selectableUl.focusin();
            this.$selectionUl.focusout();
            ms.trigger('change');
            if (typeof this.options.afterDeselect === 'function') {
                this.options.afterDeselect.call(this, values);
            }
        },

        isDomNode: function (attr) {
            return (
        attr &&
        typeof attr === "object" &&
        typeof attr.nodeType === "number" &&
        typeof attr.nodeName === "string"
      );
        },

        sanitize: function (value, reg) {
            return (value.replace(reg, '_'));
        }
    };

    /* MULTISELECT PLUGIN DEFINITION
    * ======================= */

    $.fn.multiSelect = function () {
        var option = arguments[0],
        args = arguments;

        return this.each(function () {
            var $this = $(this),
          data = $this.data('multiselect'),
          options = $.extend({}, $.fn.multiSelect.defaults, $this.data(), typeof option === 'object' && option);

            if (!data) { $this.data('multiselect', (data = new MultiSelect(this, options))); }

            if (typeof option === 'string') {
                data[option](args[1]);
            } else {
                data.init();
            }
        });
    };

    $.fn.multiSelect.defaults = {
        selectableOptgroup: false,
        disabledClass: 'disabled',
        dblClick: false
    };

    $.fn.multiSelect.Constructor = MultiSelect;

} (window.jQuery);