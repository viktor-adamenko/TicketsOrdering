"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DataTableController =
/*#__PURE__*/
function () {
  function DataTableController() {
    _classCallCheck(this, DataTableController);
  }

  _createClass(DataTableController, [{
    key: "create",
    value: function create(config) {
      var table = $(config.selector).DataTable({
        ordering: false,
        searching: false,
        pageLength: 6,
        columns: config.columns,
        ajax: config.ajax
      });

      var _parent = $(config.selector).parent();

      var _pageSize = _parent.find('.dataTables_length');

      _pageSize.hide();

      return table;
    }
  }]);

  return DataTableController;
}();

$.fn.datepicker.language['ua'] = {
  days: ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четверг', 'П\'ятниця', 'Субота'],
  daysShort: ['Нед', 'Пон', 'Вів', 'Сер', 'Чет', 'П\'я', 'Суб'],
  daysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  months: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
  monthsShort: ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'],
  today: 'Сьгодні',
  clear: 'Відміна',
  dateFormat: 'dd/mm/yyyy',
  timeFormat: 'hh:ii aa',
  firstDay: 1
};

var _listNotification;

function _createElement(element, className, parent) {
  var _element = $(document.createElement(element));

  if (className) {
    _element.addClass(className);
  }

  if (parent) {
    $(parent).append(_element);
  }

  return _element;
}

function _initNotificationList(initElement) {
  var $initElement = $(initElement);

  if ($initElement.find(".notification-list").length > 0) {} else {
    var initElementWidth = $initElement.innerWidth();

    var $listElement = _createElement("div", "notification-list");

    $listElement.css({
      'left': initElementWidth + 20 + 'px',
      'top': 0
    });
    $initElement.append($listElement);
  }
}

function _initNotificationListForBody() {
  var $initElement = $(document.body);

  if ($initElement.find(".notification-list").length > 0) {} else {
    // let initElementWidth = $initElement.innerWidth();
    var $listElement = _createElement("div", "notification-list");

    $listElement.css({
      'left': '50%',
      'top': '40px',
      'transform': 'translate(-50%, 0)'
    });
    $initElement.append($listElement);
  }
}

function _setExpiresTime(element, duration) {
  setTimeout(function () {
    $(element).fadeOut('fast', function () {
      $(element).remove();
    });
  }, duration);
}

function _setCloseButtonEvent(element) {
  var $closeButton = $(element).find('.close-button');
  $closeButton.on('click', function () {
    $(element).fadeOut('fast', function () {
      $(element).remove();
    });
  });
}

var NotificationController =
/*#__PURE__*/
function () {
  function NotificationController(initElement) {
    _classCallCheck(this, NotificationController);

    if (initElement != undefined) {
      _initNotificationList(initElement);
    } else {
      _initNotificationListForBody();
    }
  }

  _createClass(NotificationController, [{
    key: "create",
    value: function create(text, type) {
      var classNameNotification;

      switch (type) {
        case 'danger':
          classNameNotification = "notification-danger";
          break;

        case 'success':
          classNameNotification = "notification-success";
          break;

        default:
          classNameNotification = "notification-danger";
          break;
      }

      var $notification = _createElement("div", classNameNotification);

      var $text = _createElement("span", "notification-content");

      $text.text(text);

      var $closeButton = _createElement("span", "close-button");

      _createElement("i", "fas fa-times", $closeButton);

      $notification.append($text);
      $notification.append($closeButton);
      $notification.css('display', 'none');
      $(".notification-list").append($notification);
      $notification.fadeIn('fast');

      _setExpiresTime($notification, 5000);

      _setCloseButtonEvent($notification);
    }
  }]);

  return NotificationController;
}();

$.fn.select2.amd.define("custom-dropdown", ["select2/utils", "select2/dropdown", "select2/dropdown/attachContainer", "select2/dropdown/closeOnSelect"], function (Utils, DropdownAdapter, AttachContainer, CloseOnSelect) {
  var CustomAdapter = Utils.Decorate(Utils.Decorate(DropdownAdapter, AttachContainer), CloseOnSelect);
  return CustomAdapter;
});
$.fn.select2.amd.define('select2/i18n/ua', [], function () {
  // Russian
  return {
    errorLoading: function errorLoading() {
      return 'Результат не може бути завантажено.';
    },
    inputTooLong: function inputTooLong(args) {
      var overChars = args.input.length - args.maximum;
      var message = 'Будь ласка, вилучте ' + overChars + ' символ';

      if (overChars >= 2 && overChars <= 4) {
        message += 'а';
      } else if (overChars >= 5) {
        message += 'ів';
      }

      return message;
    },
    inputTooShort: function inputTooShort(args) {
      var remainingChars = args.minimum - args.input.length;
      var message = 'Будь ласка, введіть ' + remainingChars + ' або більше символів';
      return message;
    },
    loadingMore: function loadingMore() {
      return 'Завантажуємо ще ресурси…';
    },
    maximumSelected: function maximumSelected(args) {
      var message = 'Вы можете вибрати ' + args.maximum + ' елемент';

      if (args.maximum >= 2 && args.maximum <= 4) {
        message += 'а';
      } else if (args.maximum >= 5) {
        message += 'ів';
      }

      return message;
    },
    noResults: function noResults() {
      return 'Нічого не знайдено';
    },
    searching: function searching() {
      return 'Пошук…';
    }
  };
});

var SelectController =
/*#__PURE__*/
function () {
  function SelectController() {
    _classCallCheck(this, SelectController);
  }

  _createClass(SelectController, [{
    key: "initSelectAjax2",
    value: function initSelectAjax2(data) {
      return $(data.selector).select2({
        width: '100%',
        language: 'ua',
        placeholder: data.placeholder,
        containerCssClass: 'custom-select2',
        minimumResultsForSearch: Infinity,
        dropdownAdapter: $.fn.select2.amd.require("custom-dropdown"),
        ajax: {
          url: data.ajaxUrl,
          data: data.ajaxData,
          processResults: function processResults(data, params) {
            return {
              results: data
            };
          }
        }
      }).on('select2:select', data.onChange);
    }
  }, {
    key: "initSelect2",
    value: function initSelect2(data) {
      return $(data.selector).select2({
        width: '100%',
        language: 'ua',
        placeholder: data.placeholder,
        containerCssClass: 'custom-select2',
        minimumResultsForSearch: Infinity,
        dropdownAdapter: $.fn.select2.amd.require("custom-dropdown")
      }).on('select2:select', data.onChange);
    }
  }, {
    key: "fillAjaxSelectData",
    value: function fillAjaxSelectData(ajaxConf, selector) {
      var _this = this;

      $.ajax({
        url: ajaxConf.url,
        data: ajaxConf.data,
        success: function success(data) {
          _this.fillDataToSelect(data, selector);
        }
      });
    }
  }, {
    key: "fillDataToSelect",
    value: function fillDataToSelect(data, selector) {
      var $sel = $(selector);
      var $options = $sel.find('option');
      $options.remove();

      if (data != undefined && data.length > 0) {
        var html = "";

        for (var i = 0; i < data.length; i++) {
          var optionHtml = '<option ';

          for (var key in data[i]) {
            if (key == "id") {
              optionHtml += "value=\"".concat(data[i].id, "\" ");
            } else if (key == "text") {} else {
              optionHtml += "data-".concat(key, "=\"").concat(data[i][key], "\" ");
            }
          }

          optionHtml += ">".concat(data[i].text, "</option>");
          html += optionHtml;
        }

        $sel.append(html);
      }

      $sel.val(null);
    }
  }]);

  return SelectController;
}();

var SwitchButtonController =
/*#__PURE__*/
function () {
  function SwitchButtonController() {
    _classCallCheck(this, SwitchButtonController);
  }

  _createClass(SwitchButtonController, [{
    key: "init",
    value: function init() {
      var _this = this;

      $('.switch-button-group button[data-tab-id]').on('click', function () {
        var $parent = $(this).parent();
        var $notActiveButtons = $parent.find('button[selected-tab="true"]');
        $notActiveButtons.attr('selected-tab', false);
        $(this).attr('selected-tab', true);

        _this.toggleTabs($(this));
      });
    }
  }, {
    key: "toggleTabs",
    value: function toggleTabs(currentButton) {
      var $parent = $(currentButton).parent();
      var $allButtons = $parent.find('button[data-tab-id]');
      $allButtons.each(function () {
        var tabId = $(this).data('tab-id');
        $(tabId).hide();
      });
      var currentTabId = $(currentButton).data('tab-id');
      $(currentTabId).show();
    }
  }]);

  return SwitchButtonController;
}();