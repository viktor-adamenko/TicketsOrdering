class ProFormaRequestsController {

    initProFormaRequestsBlock(resolve, reject) {

        $.ajax({
            url: "/Page/ProFormaRequests/",
            method: "GET",
            success: function (data) {

                $('#orders-table').html(data);
                resolve();

            },
            error: function (err) {

                alert(err);
                reject();

            }
        })
    }

}