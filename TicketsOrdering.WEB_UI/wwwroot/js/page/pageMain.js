"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ContentController =
/*#__PURE__*/
function () {
  function ContentController() {
    _classCallCheck(this, ContentController);
  }

  _createClass(ContentController, [{
    key: "getCurrentUserId",
    value: function getCurrentUserId() {
      return $('#userId').val();
    }
  }, {
    key: "initNewsBlock",
    value: function initNewsBlock() {
      var $newsBlock = $('#news-block');
      var currentUserId = this.getCurrentUserId();
      $.ajax({
        url: '/News/NewsBlock/',
        data: {
          userId: currentUserId
        },
        success: function success(data) {
          $newsBlock.html(data);
          var switchButtonController = new SwitchButtonController();
          switchButtonController.init();
        },
        error: function error(err) {
          console.error(err);
          alert(err);
        }
      });
    }
  }]);

  return ContentController;
}();

$(document).ready(function () {
  var contentController = new ContentController();
  contentController.initNewsBlock();
});
var expandedBlockStudentTicket = '80%';
var expandedBlockETicket = '54%';
var collapsedBlock = '26%';

var _currentTicketTypeId;

var _currentCountOfTrips;

var _currentTicketVariationId;

var _orderTable;

var notificationController = new NotificationController();
var selectController = new SelectController();
var dataTableController = new DataTableController();

function formatDate(d) {
  var curr_date = d.getDate();
  var curr_month = d.getMonth() + 1;
  var curr_year = d.getFullYear();
  return "".concat(curr_year, "-").concat(curr_month, "-").concat(curr_date);
}

var TicketsOrderingController =
/*#__PURE__*/
function () {
  function TicketsOrderingController() {
    _classCallCheck(this, TicketsOrderingController);
  }

  _createClass(TicketsOrderingController, [{
    key: "initControlls",
    value: function initControlls() {
      var _this = this;

      selectController.initSelect2({
        selector: "#ticket-type-id",
        placeholder: "Виберіть шаблон проїздного"
      });
      selectController.fillAjaxSelectData({
        url: "/api/GetData/GetTicketTypes"
      }, "#ticket-type-id");
      selectController.initSelect2({
        selector: "#count-trips-sel",
        placeholder: "К-ть поїздок",
        onChange: _this.onChangeCountOfTrips
      });
      selectController.initSelect2({
        selector: '#ticket-variation-sel',
        placeholder: "Проїздний",
        onChange: _this.onChangeTicketVariations
      });
      $('#month').datepicker({
        language: 'ua',
        autoClose: true,
        minDate: new Date()
      });
      $('#payment-method-1').on('change', function () {
        $('#card-payment-method').hide();
      });
      $("#payment-method-2").on('change', function () {
        $('#card-payment-method').show();
      });
      $('#submit-order-btn').on('click', function () {
        _this.submitOrderTicket();
      });
      _orderTable = dataTableController.create({
        selector: "#orderList",
        columns: [{
          data: "ticketVariation",
          title: "Тип проїздного",
          render: function render(data, type, row) {
            console.log(row);
            var monthDiv = row.month != null ? "<div class='small'>".concat(row.month, " (").concat(row.price, " \u0433\u0440\u043D)</div>") : "<div class='small'>(".concat(row.price, " \u0433\u0440\u043D)</div>");
            var htmlTemplate = "<div class='ticketVariationCell'>\n                                <div>".concat(data, "<div/>\n                                ").concat(monthDiv, "\n                            </div>");
            return htmlTemplate;
          }
        }, {
          data: "countOfTrips",
          title: "Поїздки",
          className: 'text-center'
        }, //{data: "userName", title: "Замовник", className: 'text-center'},
        {
          data: "requestState",
          title: "Статус",
          className: 'text-center'
        }],
        ajax: {
          url: "/Page/GetOrdersByCurrentUser"
        }
      });
    }
  }, {
    key: "submitOrderTicket",
    value: function submitOrderTicket() {
      var _this = this;

      var userId = $('#userId').val();
      var paymentMethodId = $('input[name="payment-method"]:checked').val();

      var ajaxOption = function ajaxOption(data) {
        return {
          url: "/Page/OrderTicket",
          method: "POST",
          data: data,
          success: function success(data) {
            if (data.success = true) {
              notificationController.create(data.message, "success");
            } else {
              notificationController.create(data.message, "danger");
            }

            _this.collapseOredringBlock();
          },
          error: function error(err) {
            notificationController.create(err, "danger");
          }
        };
      };

      if (_currentTicketTypeId == 2) {
        // validationFields
        var countOfTrips = $('#count-trips-sel').val();
        var ticketVariation = $('#ticket-variation-sel').val();
        var dataMonth = $('#month').data('datepicker');
        var isValid = true;

        if (dataMonth.selectedDates.length == 0) {
          notificationController.create("Виберіть місяць", 'danger');
          isValid = false;
        }

        if (countOfTrips == null || countOfTrips == '') {
          notificationController.create("Виберіть кількість поїздок", 'danger');
          isValid = false;
        }

        if (ticketVariation == null || ticketVariation == '') {
          notificationController.create("Виберіть проїздний", 'danger');
          isValid = false;
        }

        if (isValid) {
          var data = {
            month: formatDate(dataMonth.selectedDates[0]),
            ticketVariationId: ticketVariation,
            paymentMethodId: paymentMethodId,
            userId: userId
          };
          $.ajax(ajaxOption(data));
        }
      } else {
        var _data = {
          month: null,
          ticketVariationId: _currentTicketVariationId,
          paymentMethodId: paymentMethodId,
          userId: userId
        };
        $.ajax(ajaxOption(_data));
      }
    }
  }, {
    key: "setOrderingHeaderText",
    value: function setOrderingHeaderText(text) {
      $('#current-ticket-type').show();
      $('#current-ticket-type').text(text);
    }
  }, {
    key: "expandOrderingBlock",
    value: function expandOrderingBlock(ticketTypeId) {
      $('#select-ticket-type').hide();
      $('#orders-table').hide();
      $('#continue-tickets-ordering').show();
      $('#cancel-ordering').css('visibility', 'visible'); // Студентский билет

      if (ticketTypeId == 2) {
        $('#student-ticket-form').show();
        $('#ordering-tickets').css('height', expandedBlockStudentTicket);
      } else {
        // E-билет
        $('#student-ticket-form').hide();
        $('#ordering-tickets').css('height', expandedBlockETicket);
      }
    }
  }, {
    key: "collapseOredringBlock",
    value: function collapseOredringBlock() {
      /* -------------------------- */

      /* Обнуление значений в полях */

      /* -------------------------- */
      $('#ticket-type-id').select2('val', ' ');
      $('#count-trips-sel').select2('val', ' ');
      $('#ticket-variation-sel').select2('val', ' ');
      $('#ticket-variation-sel').attr('disabled', true); // $('#ticket-variation-sel').select2('destroy');
      // $('#count-trips-sel').select2('destroy');

      $('#price-text').text('');
      $('#month').data('datepicker').clear();

      _orderTable.ajax.reload(); // ----------------------------


      $('#current-ticket-type').hide();
      $('#continue-tickets-ordering').hide();
      $('#cancel-ordering').css('visibility', 'hidden');
      $('#ordering-tickets').css('height', collapsedBlock);
      $('#select-ticket-type').show();
      $('#orders-table').show();
    }
  }, {
    key: "onChangeTicketVariations",
    value: function onChangeTicketVariations(e) {
      var price = $('#ticket-variation-sel option:selected').data('price'); // let priceText = " (" + e.params.data.price + ' грн)';

      var priceText = " (" + price + ' грн)';
      $('#price-text').text(" " + priceText);
      _currentTicketVariationId = e.params.data.id;
    }
  }, {
    key: "onChangeCountOfTrips",
    value: function onChangeCountOfTrips(e) {
      _currentCountOfTrips = e.params.data.id;
      selectController.fillAjaxSelectData({
        url: "/api/GetData/GetTicketVariations",
        data: {
          ticketTypeId: _currentTicketTypeId,
          countOfTrips: _currentCountOfTrips
        }
      }, "#ticket-variation-sel");
      $('#ticket-variation-sel').val(null);
      $('#ticket-variation-sel').attr('disabled', false);
    }
  }, {
    key: "continueTicketsOrdering",
    value: function continueTicketsOrdering() {
      var _this = this;

      var ticketTypeData = $('#ticket-type-id').select2('data');

      if (ticketTypeData.length > 0) {
        var ticketTypeId = ticketTypeData[0].id;
        var ticketTypeText = ticketTypeData[0].text;
        _currentTicketTypeId = ticketTypeId;

        if (ticketTypeId != 0 || ticketTypeId != null) {
          this.setOrderingHeaderText(ticketTypeText);
          selectController.fillAjaxSelectData({
            url: "/api/GetData/GetCountOfTrips",
            data: {
              ticketTypeId: _currentTicketTypeId
            }
          }, "#count-trips-sel");
          this.expandOrderingBlock(ticketTypeId); // Если Е-Билет то ставим на кнопке цену билета

          if (ticketTypeId == 1) {
            $.ajax({
              url: "/api/GetData/GetTicketVariations",
              data: {
                ticketTypeId: ticketTypeId,
                countOfTrips: 0
              },
              success: function success(data) {
                if (data != undefined && data.length > 0) {
                  _currentTicketVariationId = data[0].id;
                  var priceText = " (" + data[0].price + ' грн)';
                  $('#price-text').text(" " + priceText);
                }
              }
            });
          }
        }
      } else {
        notificationController.create('Виберіть шаблон проїздного', 'danger');
      }
    }
  }]);

  return TicketsOrderingController;
}();

var ticketsOrderingController = new TicketsOrderingController();
ticketsOrderingController.initControlls();
window.ticketsOrderingController = ticketsOrderingController;