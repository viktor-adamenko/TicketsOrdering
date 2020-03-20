class AccountController {    

    getLoginData() {
        let login = $('#inpt-login').val();
        let password = $('#inpt-pass').val();

        let data = {
            login: login,
            password: password
        };

        return data;
    }

    login() {
        let loginData = this.getLoginData();

        $.ajax({
            url: '/Account/Login',
            method: 'POST',
            data: loginData,
            success: function(data) {
                if(data.success == "true"){
                    window.location.href = data.redirectUrl;
                }                    
                else {
                    $('#error-message').text(data.errorMessage);
                    $('.error-block').show();
                }
            }
        })
    }

    closeErrorBlock() {
        $('#error-message').text("");
        $('.error-block').hide();
    }

    clickBackButton() {
        window.location.href = "/Account";
    }
}

let accountController = new AccountController();
window.accountController = accountController;

$('#login-form').on('submit', function(e) {
    e.preventDefault();
    accountController.login();
});

