"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

$(function () {
  var selectController = new SelectController();
  var notificationController = new NotificationController('.sign-up-block');
  var universityFacultyId;

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

  var SignUpController =
  /*#__PURE__*/
  function () {
    function SignUpController() {
      _classCallCheck(this, SignUpController);
    }

    _createClass(SignUpController, [{
      key: "initControlls",
      value: function initControlls() {
        selectController.initSelect2({
          selector: "#user-role",
          placeholder: "Виберіть роль",
          ajaxUrl: "/api/GetData/GetRoles"
        });
        selectController.initSelect2({
          selector: "#university-faculty",
          placeholder: "Виберіть факультет",
          ajaxUrl: "/api/GetData/GetUniversityFaculties",
          onChange: function onChange(e) {
            onChangeUniversityFaculty(e);
          }
        });
        $("#university-group").attr('disabled', true);
        initUniversityGroupSelect();
      }
    }, {
      key: "getDataFromInputs",
      value: function getDataFromInputs() {
        var obj = {};
        var $inputs = $("#signup-form .form-item [data-input-key]");

        for (var i = 0; i < $inputs.length; i++) {
          var inpt = $($inputs[i]);
          obj[inpt.data('input-key')] = inpt.val();
        }

        return obj;
      }
    }, {
      key: "validateFields",
      value: function validateFields() {
        var valid = true;
        var $inputs = $("#signup-form .form-item [data-validate-field]");

        for (var i = 0; i < $inputs.length; i++) {
          var $input = $($inputs[i]);
          var value = $input.val();

          if (value == null || value == undefined || value == '') {
            valid = false;
            var nameField = $input.attr('placeholder');
            notificationController.create("\u041D\u0435 \u0437\u0430\u043F\u043E\u0432\u043D\u0435\u043D\u043E \u043F\u043E\u043B\u0435: ".concat(nameField), 'danger');
          }
        }

        return valid;
      }
    }]);

    return SignUpController;
  }();

  var signUpController = new SignUpController();
  window.signUpController = signUpController;
  signUpController.initControlls();
  $('#signup-form').on("submit", function (e) {
    e.preventDefault();
    var data = signUpController.getDataFromInputs();

    if (signUpController.validateFields()) {
      $.ajax({
        url: '/Account/SignUp',
        method: 'POST',
        data: data,
        success: function success(data) {
          if (data.success == "true") {
            window.location.href = data.redirectUrl;
          } else {
            $('#error-message').text(data.errorMessage);
            $('.error-block').show();
          }
        }
      });
    }
  });
});