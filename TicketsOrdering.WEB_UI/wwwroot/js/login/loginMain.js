"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AccountController =
/*#__PURE__*/
function () {
  function AccountController() {
    _classCallCheck(this, AccountController);
  }

  _createClass(AccountController, [{
    key: "getLoginData",
    value: function getLoginData() {
      var login = $('#inpt-login').val();
      var password = $('#inpt-pass').val();
      var data = {
        login: login,
        password: password
      };
      return data;
    }
  }, {
    key: "login",
    value: function login() {
      var loginData = this.getLoginData();
      $.ajax({
        url: '/Account/Login',
        method: 'POST',
        data: loginData,
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
  }, {
    key: "closeErrorBlock",
    value: function closeErrorBlock() {
      $('#error-message').text("");
      $('.error-block').hide();
    }
  }, {
    key: "clickBackButton",
    value: function clickBackButton() {
      window.location.href = "/Account";
    }
  }]);

  return AccountController;
}();

var accountController = new AccountController();
window.accountController = accountController;
$('#login-form').on('submit', function (e) {
  e.preventDefault();
  accountController.login();
});