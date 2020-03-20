$.fn.select2.amd.define("custom-dropdown", [
    "select2/utils",
    "select2/dropdown",
    "select2/dropdown/attachContainer",
    "select2/dropdown/closeOnSelect"
], function (Utils, DropdownAdapter, AttachContainer, CloseOnSelect) {
            var CustomAdapter = Utils.Decorate(
                Utils.Decorate(
                        DropdownAdapter,
                        AttachContainer          
                ),
                CloseOnSelect
            );  

    return CustomAdapter
});

$.fn.select2.amd.define('select2/i18n/ua',[],function () {
    // Russian
    return {
        errorLoading: function () {
            return 'Результат не може бути завантажено.';
        },
        inputTooLong: function (args) {
            var overChars = args.input.length - args.maximum;
            var message = 'Будь ласка, вилучте ' + overChars + ' символ';
            if (overChars >= 2 && overChars <= 4) {
                message += 'а';
            } else if (overChars >= 5) {
                message += 'ів';
            }
            return message;
        },
        inputTooShort: function (args) {
            var remainingChars = args.minimum - args.input.length;

            var message = 'Будь ласка, введіть ' + remainingChars + ' або більше символів';

            return message;
        },
        loadingMore: function () {
            return 'Завантажуємо ще ресурси…';
        },
        maximumSelected: function (args) {
            var message = 'Вы можете вибрати ' + args.maximum + ' елемент';

            if (args.maximum  >= 2 && args.maximum <= 4) {
                message += 'а';
            } else if (args.maximum >= 5) {
                message += 'ів';
            }

            return message;
        },
        noResults: function () {
          return 'Нічого не знайдено';
        },
        searching: function () {
          return 'Пошук…';
        }
    };
});