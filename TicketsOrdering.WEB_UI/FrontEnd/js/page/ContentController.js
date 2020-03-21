function _initCancelOrderingButton(callback) {
    $('#cancel-ordering').on('click', function() {
        callback();
    });
}

class ContentController {

    getCurrentUserId() {
        return $('#userId').val();
    }

    initNewsBlock(resolve, reject) {

        let $newsBlock = $('#news-block');
        let currentUserId = this.getCurrentUserId();

        $.ajax({
            url: '/News/NewsBlock/',
            data: {
                userId: currentUserId
            },
            success: function (data) {
                $newsBlock.html(data);

                resolve();
            },
            error: function (err) {
                console.error(err);
                alert(err);

                reject();
            }
        });

    }



}

$(document).ready(function () {

    let contentController = new ContentController();
    let ticketsOrderingController = new TicketsOrderingController();
    let proFormaRequestsController = new ProFormaRequestsController();

    let switchButtonController = new SwitchButtonController();


    let newsBlock = new Promise(function (resolve, reject) {
        contentController.initNewsBlock(resolve, reject);
    });

    let ordersBlock = new Promise(function (resolve, reject) {

        let userRole = $('#userRole').val();
        switch (userRole) {
            case "ProForma Group":     

                proFormaRequestsController.initProFormaRequestsBlock(resolve, reject);    
                _initCancelOrderingButton(() => {
                    ticketsOrderingController.collapseOredringBlock(() => {
                        proFormaRequestsController.reloadAllTables();
                    });
                });
                         
                break;
            case "Student":

                ticketsOrderingController.initMyOrdersBlock(resolve, reject);
                _initCancelOrderingButton(() => {
                    ticketsOrderingController.collapseOredringBlock(() => {
                        ticketsOrderingController.reloadAllTables();
                    });
                }); 

                break;
            default: 
                reject();
                break;
        }

    });

    Promise.all([newsBlock, ordersBlock]).then(() => {
        switchButtonController.init();
        ticketsOrderingController.initControlls();
    });

    window.ticketsOrderingController = ticketsOrderingController;
    window.proFormaRequestsController = proFormaRequestsController;

});

