class SwitchButtonController {

    init() {
        let _this = this;

        $('.switch-button-group button[data-tab-id]').on('click', function() {
            
            var $parent = $(this).parent();
            var $notActiveButtons = $parent.find('button[selected-tab="true"]');
            $notActiveButtons.attr('selected-tab', false);

            $(this).attr('selected-tab', true);
            
            _this.toggleTabs($(this));
        });
    }

    toggleTabs(currentButton) {

        var $parent = $(currentButton).parent();
        var $allButtons = $parent.find('button[data-tab-id]');

        $allButtons.each(function() {
            let tabId = $(this).data('tab-id');
            $(tabId).hide();
        });

        let currentTabId = $(currentButton).data('tab-id');
        $(currentTabId).show();

    }

}