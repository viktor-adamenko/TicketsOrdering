
function _initClickReportItem() {    
    $('.report-item .report-item-header').on('click', function() {      
        
        $('.report-item .collapse-content').hide();

        let $content = $(this).parent().find('.collapse-content');
        $content.toggle();

    });
}

let notif = new NotificationController();

class ProFormaReportsController {

    initReportBlock(resolve, reject) {

        let _this = this;

        $.ajax({
            url: "/Page/ProFormaUniversityReports/",
            method: "GET",
            success: function (data) {

                $('#orders-table').html(data);
                _this.getReports();
                _initClickReportItem();
                resolve();

            },
            error: function (err) {

                alert(err);
                reject();

            }
        });
    } 

    getReports() {
        let _this = this;

        $.ajax({
            url: "/Page/GetReportsByFaculty/",
            method: "GET",
            success: function (data) {

                console.log(data);

            }
        });
    }

}