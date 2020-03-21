let _openRequestTable;
let _closedRequestTable;

let requestOrderTable = new DataTableController();

function _createRequestDataTable(selector, data) {
    return requestOrderTable.create({
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
        })
    }

    initDataTablesOrderRequests() {
        _openRequestTable = _createRequestDataTable("#openedRequestsList", { isCLosed: 0 });
        _closedRequestTable = _createRequestDataTable("#closedRequestsList", { isCLosed: 1 });
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

}