const expandedBlockStudentTicket = '80%';
const expandedBlockETicket = '54%';
const collapsedBlock = '26%';

let _currentTicketTypeId;
let _currentCountOfTrips;
let _currentTicketVariationId;

let _openOrderTable;
let _closedOrderTable;

let notificationController = new NotificationController();
let selectController = new SelectController();
let dataTableController = new DataTableController();

function formatDate(d) {
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1;
    var curr_year = d.getFullYear();

    return `${curr_year}-${curr_month}-${curr_date}`;
}

function _createOrderDataTable(selector, data) {
    return dataTableController.create({
        selector: selector,
        columns: [
            {
                data: "ticketVariation",
                title: "Тип проїздного",
                render: function (data, type, row) {
                    console.log(row)

                    let monthDiv = row.month != null ?
                        `<div class='small'>${row.month} (${row.price} грн)</div>` :
                        `<div class='small'>(${row.price} грн)</div>`;

                    let htmlTemplate =
                        `<div class='ticketVariationCell'>
                        <div>${data}<div/>
                        ${monthDiv}
                    </div>`;

                    return htmlTemplate;
                },
                width: "33%"
            },
            { data: "countOfTrips", title: "Поїздки", className: 'text-center', width: "33%" },
            { data: "requestState", title: "Статус", className: 'text-center', width: "33%" }
        ],
        pageLenght: 5,
        ajax: {
            url: "/Page/GetOrdersByCurrentUser",
            data: data
        }
    });
}

function _initOrderDataTables() {
    _openOrderTable = _createOrderDataTable("#openedOrderList", { isCLosed: 0 });


    _closedOrderTable = _createOrderDataTable("#closedOrderList", { isCLosed: 1 });
    _closedOrderTable.columns.adjust().draw();
}

class TicketsOrderingController {

    initOrderingTable() {
        let _this = this;

        $.ajax({
            url: "/Page/MyOrders/",
            method: "GET",
            success: function(data) {

                $('#orders-table').html(data);
                _this.initControlls();

            }
        });
    }

    initControlls() {
        let _this = this;

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
        })

        $('#submit-order-btn').on('click', function () {
            _this.submitOrderTicket();
        });

        _initOrderDataTables();
    }

    reloadOrderTable(isClosed) {

        switch (isClosed) {
            case 0:
                _openOrderTable.ajax.reload(null, false);
                _openOrderTable.columns.adjust();//.draw(false);
                break;
            default:
                _closedOrderTable.ajax.reload(null, false);
                _closedOrderTable.columns.adjust();//.draw(false);
                break;
        }

    }

    submitOrderTicket() {
        let _this = this;
        let userId = $('#userId').val();
        let paymentMethodId = $('input[name="payment-method"]:checked').val();

        let ajaxOption = function (data) {
            return {
                url: "/Page/OrderTicket",
                method: "POST",
                data: data,
                success: function (data) {
                    if (data.success = true) {
                        notificationController.create(data.message, "success");
                    } else {
                        notificationController.create(data.message, "danger");
                    }

                    _this.collapseOredringBlock();
                },
                error: function (err) {
                    notificationController.create(err, "danger");
                }
            }
        }

        if (_currentTicketTypeId == 2) {

            // validationFields
            let countOfTrips = $('#count-trips-sel').val();
            let ticketVariation = $('#ticket-variation-sel').val();
            let dataMonth = $('#month').data('datepicker');

            let isValid = true;

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
                let data = {
                    month: formatDate(dataMonth.selectedDates[0]),
                    ticketVariationId: ticketVariation,
                    paymentMethodId: paymentMethodId,
                    userId: userId
                }

                $.ajax(ajaxOption(data));
            }

        } else {

            let data = {
                month: null,
                ticketVariationId: _currentTicketVariationId,
                paymentMethodId: paymentMethodId,
                userId: userId
            }

            $.ajax(ajaxOption(data));
        }
    }

    setOrderingHeaderText(text) {
        $('#current-ticket-type').show();
        $('#current-ticket-type').text(text);
    }

    expandOrderingBlock(ticketTypeId) {

        $('#select-ticket-type').hide();
        $('#orders-table').hide();

        $('#continue-tickets-ordering').show();
        $('#cancel-ordering').css('visibility', 'visible');

        // Студентский билет
        if (ticketTypeId == 2) {
            $('#student-ticket-form').show();
            $('#ordering-tickets').css('height', expandedBlockStudentTicket);

        } else { // E-билет
            $('#student-ticket-form').hide();
            $('#ordering-tickets').css('height', expandedBlockETicket);
        }

    }

    collapseOredringBlock() {

        /* -------------------------- */
        /* Обнуление значений в полях */
        /* -------------------------- */
        $('#ticket-type-id').select2('val', ' ');

        $('#count-trips-sel').select2('val', ' ');

        $('#ticket-variation-sel').select2('val', ' ');
        $('#ticket-variation-sel').attr('disabled', true);

        // $('#ticket-variation-sel').select2('destroy');
        // $('#count-trips-sel').select2('destroy');

        $('#price-text').text('');
        $('#month').data('datepicker').clear();

        _openOrderTable.ajax.reload();
        _closedOrderTable.ajax.reload();

        // ----------------------------

        $('#current-ticket-type').hide();
        $('#continue-tickets-ordering').hide();
        $('#cancel-ordering').css('visibility', 'hidden');

        $('#ordering-tickets').css('height', collapsedBlock);

        $('#select-ticket-type').show();
        $('#orders-table').show();
    }

    onChangeTicketVariations(e) {

        let price = $('#ticket-variation-sel option:selected').data('price')
        // let priceText = " (" + e.params.data.price + ' грн)';
        let priceText = " (" + price + ' грн)';
        $('#price-text').text(" " + priceText);

        _currentTicketVariationId = e.params.data.id;
    }

    onChangeCountOfTrips(e) {

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

    continueTicketsOrdering() {
        let _this = this;
        let ticketTypeData = $('#ticket-type-id').select2('data');

        if (ticketTypeData.length > 0) {

            let ticketTypeId = ticketTypeData[0].id;
            let ticketTypeText = ticketTypeData[0].text;
            _currentTicketTypeId = ticketTypeId;


            if (ticketTypeId != 0 || ticketTypeId != null) {

                this.setOrderingHeaderText(ticketTypeText);

                selectController.fillAjaxSelectData({
                    url: "/api/GetData/GetCountOfTrips",
                    data: {
                        ticketTypeId: _currentTicketTypeId
                    }
                }, "#count-trips-sel");

                this.expandOrderingBlock(ticketTypeId);

                // Если Е-Билет то ставим на кнопке цену билета
                if (ticketTypeId == 1) {
                    $.ajax({
                        url: "/api/GetData/GetTicketVariations",
                        data: {
                            ticketTypeId: ticketTypeId,
                            countOfTrips: 0
                        },
                        success: function (data) {
                            if (data != undefined && data.length > 0) {
                                _currentTicketVariationId = data[0].id;
                                let priceText = " (" + data[0].price + ' грн)';
                                $('#price-text').text(" " + priceText);
                            }
                        }
                    })
                }

            }
        } else {
            notificationController.create('Виберіть шаблон проїздного', 'danger');
        }
    }

}

$(document).ready(function () {

    let ticketsOrderingController = new TicketsOrderingController();
    ticketsOrderingController.initOrderingTable();

    window.ticketsOrderingController = ticketsOrderingController;

})