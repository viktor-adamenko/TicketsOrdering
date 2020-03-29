class SelectController {

    initSelectAjax2(data) {
        return $(data.selector).select2({
            width: '100%',
            language: 'ua',
            placeholder: data.placeholder, 
            containerCssClass: 'custom-select2',
            minimumResultsForSearch: Infinity,    
            dropdownAdapter: $.fn.select2.amd.require("custom-dropdown"),
            ajax: {
                url: data.ajaxUrl,
                data: data.ajaxData,
                processResults: function(data, params) {
                    return {
                        results: data
                    }
                }
            }
        }).on('select2:select', data.onChange);
    }

    initSelect2(data) {
        return $(data.selector).select2({
            width: '100%',
            language: 'ua',
            placeholder: data.placeholder, 
            containerCssClass: 'custom-select2',
            minimumResultsForSearch: Infinity,    
            dropdownAdapter: $.fn.select2.amd.require("custom-dropdown")
        }).on('select2:select', data.onChange);
    }

    fillAjaxSelectData(ajaxConf, selector, setValueNull) {

        let _this = this;

        $.ajax({
            url: ajaxConf.url,
            data: ajaxConf.data,
            success: function(data) {
                _this.fillDataToSelect(data, selector, setValueNull);                
            }
        });

    }

    fillDataToSelect(data, selector, setValueNull = true) {

        let $sel = $(selector);
        let $options = $sel.find('option');
        $options.remove();

        if(data != undefined && data.length > 0) {
            let html = "";

            for(let i = 0; i < data.length; i++) {

                let optionHtml = '<option '

                for(let key in data[i]) {
                    
                    if(key == "id") {
                        optionHtml += `value="${data[i].id}" `;
                    } else if(key == "text") {} 
                    else {
                        optionHtml += `data-${key}="${data[i][key]}" `
                    }                    
                }    

                optionHtml += `>${data[i].text}</option>`;
                
                html += optionHtml;
            }

            $sel.append(html);
        }

        if(setValueNull) {
            $sel.val(null);
        }

    }

}