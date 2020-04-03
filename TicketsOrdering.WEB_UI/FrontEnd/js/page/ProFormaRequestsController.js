let _openRequestTable;
let _closedRequestTable;

let _requestStates;

let requestOrderTable = new DataTableController();
let notification = new NotificationController();

function _getRequestStates(callback) {
    $.ajax({
        url: "/api/GetData/GetRequestStates/",
        success: function (data) {
            _requestStates = data;
            callback();
        }
    });
}

function initSelectOnChangeEvent() {
    let $selects = $('.sel-request-state');
    $selects.each(function () {
        $(this).unbind();

        $(this).on('change', function () {

            $('#save-changes-btn').css('visibility', 'visible');

        });
    });
}

function _createRequestDataTable(selector, data) {
    return requestOrderTable.create({
        selector: selector,
        columns: [
            {
                data: "ticketVariation",
                title: "Тип проїздного",
                render: function (data, type, row) {

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
                width: "25%"
            },
            { data: "countOfTrips", title: "Поїздки", className: 'text-center', width: "15%" },
            { data: "userName", title: "Замовник", className: 'text-center', width: "35%" },
            { data: "requestState", title: "Статус", className: 'text-center', width: "25%" }
        ],
        pageLenght: 5,
        ajax: {
            url: "/Page/GetRequestOrdersByUniversityGroup/",
            data: data
        }
    });
}

function _createEditableRequestDataTable(selector, data, initComplete) {
    let table = $(selector).DataTable({
        ordering: false,
        searching: false,
        language: requestOrderTable.uaLocalization(),
        pageLength: 4,
        columns: [
            {
                data: "ticketVariation",
                title: "Тип проїздного",
                render: function (data, type, row) {

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
                width: "25%"
            },
            { data: "countOfTrips", title: "Поїздки", className: 'text-center', width: "15%" },
            { data: "userName", title: "Замовник", className: 'text-center', width: "35%" },
            {
                data: "requestState", title: "Статус", className: 'text-center', width: "25%",
                render: function (data, type, row) {
                    let htmlTemplate = `
                        <div><select id="${row.id}" value="${row.requestStateId}" class="sel-request-state"><select></div>
                    `;

                    return htmlTemplate;
                },
            }
        ],
        ajax: {
            url: "/Page/GetRequestOrdersByUniversityGroup/",
            data: data
        },
        initComplete: function (settings, json) {
            _getRequestStates(initComplete);
        },
        drawCallback: function (settings) {
            initComplete();
            initSelectOnChangeEvent();
        }
    });

    let _parent = $(selector).parent();
    let _pageSize = _parent.find('.dataTables_length');

    _pageSize.hide();


    $(selector).on('page.dt', function () {
        initComplete();
    });

    return table;
}

function _getDataSaveChanges() {
    let data = [];
    let selects = $('.sel-request-state');
    for (let i = 0; i < selects.length; i++) {
        let requestId = $(selects[i]).attr('id');
        let requestStateId = $(selects[i]).val();

        data.push({
            RequestId: requestId,
            RequestStateId: requestStateId
        });
    }

    return data;
}

class ProFormaRequestsController {

    initProFormaRequestsBlock(resolve, reject) {

        let _this = this;

        $.ajax({
            url: "/Page/ProFormaRequests/",
            method: "GET",
            success: function (data) {

                $('#orders-table').html(data);
                _this.initDataTablesOrderRequests();
                resolve();

            },
            error: function (err) {

                alert(err);
                reject();

            }
        });
    }

    createReport() {
        let _this = this;

        $.ajax({
            url: "/Page/CreateReport/",
            method: "GET",
            success: function (data) {

                if(data.success == true) {
                    _this.reloadAllTables();

                    notification.create(data.message, "success");
                } else {
                    notification.create(data.message, "danger");
                }

            },
            error: function (err) {
                notification.create(data.message, "Что-то пошло не так");
            }
        });
    }

    initDataTablesOrderRequests() {
        _openRequestTable = _createEditableRequestDataTable("#openedRequestsList", { isCLosed: 0 }, this.initSelect2RequestStates);
        _closedRequestTable = _createRequestDataTable("#closedRequestsList", { isCLosed: 1 });
    }

    initSelect2RequestStates() {

        let $options = $('.sel-request-state');
        $options.each(function (i, e) {

            let optionsCount = $(this).has('option').length;

            if (optionsCount < 1) {

                selectController.fillDataToSelect(_requestStates, $(this), false);
                let val = $(this).attr('value');
                $(this).val(val);
            }

        });
    }

    reloadAllTables() {
        _openRequestTable.ajax.reload(null, false);
        _closedRequestTable.ajax.reload(null, false);
    }

    reloadRequestsTable(isClosed) {

        switch (isClosed) {
            case 0:
                _openRequestTable.ajax.reload(null, false);
                _openRequestTable.columns.adjust();
                break;
            default:
                _closedRequestTable.ajax.reload(null, false);
                _closedRequestTable.columns.adjust();
                break;
        }
    }

    saveChanges() {
        debugger;
        let _this = this;

        let data = _getDataSaveChanges();

        $.ajax({
            type: "POST",
            url: "/Page/SaveChanges",
            contentType: "application/json",
            dataType: 'json',                    
            data: JSON.stringify(data),
            success: function (data) {

                if(data.success == true) {
                    _this.reloadAllTables();
                    $('#save-changes-btn').css('visibility', 'hidden');

                    notification.create(data.message, "success");
                } else {
                    notification.create(data.message, "danger");
                }

            }

        });

    }

}