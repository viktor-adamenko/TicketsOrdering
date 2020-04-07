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

    createListItem(data) {

        let $li = $('<li class="news-item"></li>');
        $li.attr('read', data.isRead);
        $li.attr('data-news-id', data.Id);

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

}