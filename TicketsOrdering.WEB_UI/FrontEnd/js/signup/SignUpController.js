$(function() {
    var selectController = new SelectController();
    var notificationController = new NotificationController('.sign-up-block');

    let universityFacultyId;

    function onChangeUniversityFaculty(e) {        
        $("#university-group").attr('disabled', false);
        universityFacultyId = e.params.data.id;
        initUniversityGroupSelect();
    }

    function initUniversityGroupSelect() {

        selectController.initSelect2({
            selector: "#university-group",
            placeholder: "Виберіть группу",
            ajaxUrl: "/api/GetData/GetUniversityGroups",
            ajaxData: {
                universityFacultyId: universityFacultyId
            }
        });
    }

    class SignUpController {

        initControlls() {            

            selectController.initSelect2({
                selector: "#user-role",
                placeholder: "Виберіть роль",
                ajaxUrl: "/api/GetData/GetRoles"
            });

            selectController.initSelect2({
                selector: "#university-faculty",
                placeholder: "Виберіть факультет",
                ajaxUrl: "/api/GetData/GetUniversityFaculties",
                onChange: function(e) {
                    onChangeUniversityFaculty(e);                    
                }
            });

            $("#university-group").attr('disabled', true);
            initUniversityGroupSelect();
        }

        getDataFromInputs() {
            let obj = {};
            let $inputs = $("#signup-form .form-item [data-input-key]");

            for(let i = 0; i < $inputs.length; i++) {
                let inpt = $($inputs[i]);
                obj[inpt.data('input-key')] = inpt.val();
            }

            return obj;
        }

        validateFields() {

            let valid = true;

            let $inputs = $("#signup-form .form-item [data-validate-field]");
            for(let i = 0; i < $inputs.length; i++) {
                let $input = $($inputs[i]);
                let value = $input.val();

                if(value == null || value == undefined || value == '') {
                    valid = false;

                    var nameField = $input.attr('placeholder');
                    notificationController.create(`Не заповнено поле: ${nameField}`, 'danger');
                }
            }

            return valid;
        }
    }

    var signUpController = new SignUpController();
    window.signUpController = signUpController;

    signUpController.initControlls();

    $('#signup-form').on("submit", function(e) {
        e.preventDefault();

        let data = signUpController.getDataFromInputs();

        if(signUpController.validateFields()) {
            $.ajax({
                url: '/Account/SignUp',
                method: 'POST',
                data: data,
                success: function(data) {
                    if(data.success == "true"){
                        window.location.href = data.redirectUrl;
                    }                    
                    else {
                        $('#error-message').text(data.errorMessage);
                        $('.error-block').show();
                    }
                }
            });
        }

    });

})