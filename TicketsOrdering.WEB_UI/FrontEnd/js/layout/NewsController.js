function _initClickListItem() {

    $('ul.news-list li.news-item').on('click', function() {

        $('ul.news-list li.news-item').removeAttr('selected');

        $(this).attr('selected', 'selected');

    });

}

class NewsController {

    constructor() {

        this.notReadNewsTab = '#notReadNewsTab';
        this.readNewsTab = '#readNewsTab';

    }    

    addNews() {

        $('.news-container').hide();
        $('#addNewsContent').show();
        $('#addNewsButton').css('visibility', 'hidden');

        $('#newsTitle').val('');
        $('#newsBody').val('');
        
    }    

    cancelAddNews() {

        $('.news-container').show();
        $('#addNewsContent').hide();
        $('#addNewsButton').css('visibility', 'visible');

    }    

    createListItem(data) {
        let _this = this;

        let $li = $('<li class="news-item"></li>');
        $li.attr('read', data.isRead);        
        $li.attr('data-news-id', data.id);

        if (!data.isRead) {

            $li.on('dblclick', function() {            
                let userId = $('#userId').val();
                let newsId = $(this).data('news-id');            
    
                _this.readNews(userId, newsId);
            });

        }     

        let htmlTemplate = `<div class="news-item-header">
                            <span class="news-item-caption">
                                ${data.newsTitle}
                            </span>
                            <div class="news-item-info">
                                <span class="news-item-date">
                                    ${data.createdDate}
                                </span> •
                                <span class="news-item-author">
                                    ${data.author}
                                </span>
                            </div>
                          </div>`;
        
        htmlTemplate += `<div class="news-item-content">${data.body}</div>`;

        $li.html(htmlTemplate);
        
        return $li;
    }

    getAjaxNotReadNews() {

        let userId = $('#userId').val();

        let notReadNews = $.ajax({
            url: '/News/GetNotReadNews/',
            data: {
                userId: userId
            }        
        });    

        return notReadNews;
    }

    getAjaxReadNews() {
        let userId = $('#userId').val();

        let notReadNews = $.ajax({
            url: '/News/GetReadNews/',
            data: {
                userId: userId
            }        
        });    

        return notReadNews;
    }

    initListNews(isRead) {
        
        let _this = this;
        let $ul = $('<ul class="news-list"></ul>');
        let tabSelector;

        let newsPromise;

        if(isRead) {

            $(this.readNewsTab).html("");  
            newsPromise = this.getAjaxReadNews();
            tabSelector = this.readNewsTab;
    
        } else {

            $(this.notReadNewsTab).html("");  
            newsPromise = this.getAjaxNotReadNews();
            tabSelector = this.notReadNewsTab;

        }     
        
        newsPromise.then(function(data) {

            if(data != null && data.length > 0) {
                for(let i = 0; i < data.length; i++) {

                    let listItem = _this.createListItem(data[i]);
                    $ul.append(listItem);

                }
               
                $(tabSelector).append($ul);
                _initClickListItem();
            }
        });

    }

    readNews(userId, newsId) {        

        $.ajax({
            url: "/News/ReadNews",
            type: "POST",
            data: {
                userId: userId, 
                newsId: newsId
            },
            success: function(data) {

                $(`li[data-news-id="${newsId}"]`).remove();

            }
        })

    }

    saveNews() {
        let _this = this;

        let userId = $('#userId').val();
        let newsTitle = $('#newsTitle').val();
        let newsBody = $('#newsBody').val();        

        if(newsTitle == '' || newsBody == '') {
            notif.create('Не все заповнено...', 'danger');
        } else {

            $.ajax({
                url: "/News/AddNews/",
                type: "POST",
                data: { 
                    userId: userId,
                    newsTitle: newsTitle,
                    body: newsBody
                }, 
                success: function(data) {
                    if(data.success) {
                        notif.create(data.message, 'success');

                        $('.news-container').show();
                        $('#addNewsContent').hide();
                        $('#addNewsButton').css('visibility', 'visible');

                        _this.initListNews(false);

                    } else {
                        notif.create(data.message, 'danger');
                    }
                }
            })

        }
        
    }

}