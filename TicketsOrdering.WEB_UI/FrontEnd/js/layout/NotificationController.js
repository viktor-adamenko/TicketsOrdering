let _listNotification;

function _createElement(element, className, parent) {
    let _element = $(document.createElement(element));

    if (className) {
        _element.addClass(className);
    }

    if(parent) {
        $(parent).append(_element);
    }

    return _element;
}

function _initNotificationList(initElement) {

    let $initElement = $(initElement);

    if ($initElement.find(".notification-list").length > 0) {
        
    } else {        
        let initElementWidth = $initElement.innerWidth();

        let $listElement = _createElement("div", "notification-list");
        $listElement.css({'left': (initElementWidth + 20) + 'px', 'top': 0});

        $initElement.append($listElement);
    }
}

function _initNotificationListForBody() {

    let $initElement = $(document.body);

    if ($initElement.find(".notification-list").length > 0) {
        
    } else {        
       // let initElementWidth = $initElement.innerWidth();

        let $listElement = _createElement("div", "notification-list");
        $listElement.css({ 'left': '50%', 'top': '40px', 'transform': 'translate(-50%, 0)' });

        $initElement.append($listElement);
    }
}

function _setExpiresTime(element, duration) {
    setTimeout(function() {
        $(element).fadeOut('fast', () => {
            $(element).remove();
        });        
    }, duration);
}

function _setCloseButtonEvent(element) {
    let $closeButton = $(element).find('.close-button');
    $closeButton.on('click', function() {
        $(element).fadeOut('fast', function() {
            $(element).remove();
        })
    });
}

class NotificationController {

    constructor(initElement) {
        if(initElement != undefined) {
            _initNotificationList(initElement);
        } else {
            _initNotificationListForBody();
        }
    }

    create(text, type) {        

        let classNameNotification;
        switch(type) {
            case 'danger': 
                classNameNotification = "notification-danger"; break;
            case 'success': 
                classNameNotification = "notification-success"; break;
            default: 
                classNameNotification = "notification-danger"; break;
        } 

        let $notification = _createElement("div", classNameNotification);
        
        let $text = _createElement("span", "notification-content");
        $text.text(text);

        let $closeButton = _createElement("span", "close-button");
        _createElement("i", "fas fa-times", $closeButton);

        $notification.append($text);
        $notification.append($closeButton);
        $notification.css('display', 'none');        

        $(".notification-list").append($notification);
        $notification.fadeIn('fast');

        _setExpiresTime($notification, 5000);
        _setCloseButtonEvent($notification);
    }
}
