let uaLocalization = {
    "processing":   "Зачекайте...",
	"search":       "Пошук:",
    "lengthMenu":   "Показати _MENU_ записів",
    "info":         "Записи з _START_ по _END_ із _TOTAL_ записів",
    "infoEmpty":    "Записи з 0 по 0 із 0 записів",
    "infoFiltered": "(відфільтровано з _MAX_ записів)",
    "infoPostFix":  "",
    "loadingRecords":       "Завантаження записів...",
	"zeroRecords": "Записи відсутні.",
	"emptyTable":   "В таблиці записи відсутнію",
    "paginate": {
        "first": "Перша",
        "previous": "Попередня",
        "next": "Наступна",
        "last": "Остання"
    },
    "aria": {
        "sortAscending":  ": активувати для сортування стовпців за зростанням",
        "sortDescending": ": активувати для сортування стовпців за спаданням"
    }
};

class DataTableController {

    create(config) {

        let table = $(config.selector).DataTable({
            ordering: false,
            searching: false,
            language: uaLocalization,
            pageLength: 6,
            columns: config.columns,
            ajax: config.ajax
        });

        let _parent = $(config.selector).parent();
        let _pageSize = _parent.find('.dataTables_length');

        _pageSize.hide();

        return table;
    }


}
