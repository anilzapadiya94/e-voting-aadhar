$(document).ready(function () {
	var cookie = readCookie('auth');
	if (cookie != null) {
		window.location = "/app";
	}
	//check cookie
	function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
	}

	//error hide
	$(messagebox).hide()

	$(login).click(function(){
		if (($('#username').val()=="")) {
			$(messagebox).show()
			$(errormsg).text('Please Enter Username');
		} else if (($('#password').val()=="")) {
			$(messagebox).show()
			$(errormsg).text('Please Enter valid Password');

		} else {
			$(messagebox).hide()
			$.ajax({
				url: "/login",
				method: "post",
				dataType: 'json',
				contentType: 'application/json'	,
				data: JSON.stringify({
					"username": $('#username').val(),
					"password": $('#password').val(),
				}),
				success: function (data) {
					console.log(data);
					$(messagebox).show()
					$(errormsg).text('Redirecting...')
					var str = data.message;
					var str2 = str.substring(str.length - 22, str.length);
					var aadhar  = str2.substring(str2.length - 12, str2.length);
					var phone  = str2.substring(0, 10);
					var hash = str.substring(0,56);
					console.log(aadhar);
					console.log(phone);
					var d = new Date();
				    d.setTime(d.getTime() + (1*24*60*60*100));
				    var expires = "expires="+ d.toUTCString();
					document.cookie = 'phone' + "="+phone+";" + expires + ";path=/";
					document.cookie = 'aadharno' + "="+aadhar+";"+ expires + ";path=/";
				    document.cookie = 'auth' + "=" + hash + ";" + expires + ";path=/";
				    window.location = '/app';
					console.log("inside login.js");
					//break;
				},
				statusCode: {
			        500: function() {
			        	$(messagebox).show()
			        	console.log('error');
			          	$(errormsg).text('Error Invalid Username/Password');
			        }
			      }
				
			 });//.done(function(msg){
			// 	$(errormsg).text('Redirecting...');

			// }).fail(function(e){
			// 	$(errormsg).text(e);
			// });
		}
	});
});