let reportsTable = new DataTableController();
let notif = new NotificationController();

function _initClickReportItem() {    
    $('.report-item .report-item-header').on('click', function() {   
        
        let $content = $(this).parent().find('.collapse-content');
        $content.slideToggle(350);
    });
}

function _createReportDataTable(selector) {

    $(selector).DataTable({
        ordering: false,
        searching: false,
        language: reportsTable.uaLocalization(),
        pageLength: 4,
        columns: [
            { data: "ticketVariationName", title: "Тип проїздного" },
            { data: "countOfTrips", title: "Кі-ть поїдок", className: 'text-center' },
            { data: "month", title: "Місяць", className: 'text-center' },
            { data: "amount", title: "К-ть", className: 'text-center', },
            { data: "sumPrice", title: "Сумма", className: 'text-center' }
        ]
    });

    let _parent = $(selector).parent();
    let _pageSize = _parent.find('.dataTables_length');

    _pageSize.hide();
}

function _createContentFromJson(data) {

    $('.custom-report-wrapper').html("");

    let $reportList = $('<div></div>');
    $reportList.addClass('report-list');

    if(data.length == 0) {
        $('.custom-report-wrapper').html("<span class='no-reports'>На даний час звітів немає</span>");
        return;
    }

    for(let i = 0; i < data.length; i++) {
        let $reportItem = $('<div></div>').addClass('report-item');        

        let universityGroupId = data[i].universityGroupId;
        let universityGroupName = data[i].universityGroupName;

        let $reportItemHeader = $('<div></div>').addClass('report-item-header'); ;
        let htmlContentHeader = `<span class="report-item-title" data-group-id="${universityGroupId}">Группа ${universityGroupName}</span>
                                 <span><i class="fas fa-caret-right"></i></span>`
        $reportItemHeader.html(htmlContentHeader);

        $reportItem.append($reportItemHeader);

        let $collapseContent = $('<div></div>').addClass('collapse-content');        

        let reportModel = data[i].reportModel;

        let $table = $('<table class="custom-table"></table>');
        let $customTableWrapper = $('<div class="custom-table-wrapper"></div>');

        let templateHeaderHtml = `
            <thead>
                <th>Тип проїздного</th>
                <th>Кі-ть поїдок</th>
                <th>Місяць</th>
                <th>К-ть</th>
                <th>Сумма</th>
            </thead>
        `;
        $table.append(templateHeaderHtml);

        let $tbody = $("<tbody></tbody>"); 
        //let dataTable = _createReportDataTable($table, reportModel);            

        for(let k = 0; k < reportModel.length; k++) {
            let ticketVariationName = reportModel[k].ticketVariationName;
            let countOfTrips = reportModel[k].countOfTrips;
            let month = reportModel[k].month;
            let amount = reportModel[k].amount;
            let sumPrice = reportModel[k].sumPrice;            
                    
            let templateHtml = `
            <tr>
                <td>${ticketVariationName}</td><td>${countOfTrips}</td><td>${month}</td><td>${amount}</td><td>${sumPrice}</td>
            </tr>
            `;

            $tbody.append(templateHtml);            
        }

        $table.append($tbody);
        $customTableWrapper.append($table);
        $collapseContent.append($customTableWrapper);

        let $button = $(`<button class="mint-button" data-group-id="${universityGroupId}">На видачу</button>`);
        $collapseContent.append($button);

        $reportItem.append($collapseContent);
        $reportList.append($reportItem);
    }

    $('.custom-report-wrapper').append($reportList);

    _createReportDataTable('.custom-table-wrapper table');    
    //$('.custom-table-wrapper table').DataTable();
}

class ProFormaReportsController {

    initReportBlock(resolve, reject) {

        let _this = this;

        $.ajax({
            url: "/Page/ProFormaUniversityReports/",
            method: "GET",
            success: function (data) {

                $('#orders-table').html(data);
                _this.getReports(_initClickReportItem);
                resolve();

            },
            error: function (err) {

                alert(err);
                reject();

            }
        });
    } 

    initToIssueButton() {
        let _this = this;

        $('.report-item button[data-group-id]').on('click', function() { 
            let groupId = $(this).data('group-id');
            
            $.ajax({
                url: "/Page/ToIssueTickets/",
                type: "POST",
                data: {
                    universityGroupId: groupId
                },
                success: function(data) {
                    if(data.success == true) {
                        _this.initReportBlock();
    
                        notif.create(data.message, "success");
                    } else {
                        notif.create(data.message, "danger");
                    }
                },
                error: function (err) {
                    notif.create(data.message, "Что-то пошло не так");
                }
            })
            
        });
    }

    getReports(callback) {
        let _this = this;

        $.ajax({
            url: "/Page/GetReportsByFaculty/",
            method: "GET",
            success: function (data) {

                _createContentFromJson(data);                
                callback();
                _this.initToIssueButton();
            }
        });
    }    

}