class ContentController {

    getCurrentUserId() {
        return $('#userId').val();
    }

    initNewsBlock() {

        let $newsBlock = $('#news-block');
        let currentUserId = this.getCurrentUserId();

        $.ajax({
            url: '/News/NewsBlock/',
            data: {
                userId: currentUserId
            },
            success: function(data) {
                $newsBlock.html(data);

                let switchButtonController = new SwitchButtonController();
                switchButtonController.init();
            },
            error: function(err) {
                console.error(err);
                alert(err);
            }
        });

    }

}

$(document).ready(function() {

    let contentController = new ContentController();
    contentController.initNewsBlock();
    
});

