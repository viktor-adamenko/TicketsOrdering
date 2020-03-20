class DataTableController {

    create(config) {

        let table = $(config.selector).DataTable({
            ordering: false,
            searching: false,
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
