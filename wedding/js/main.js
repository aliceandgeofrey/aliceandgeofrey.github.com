jQuery(function($){

	$('#nonce').val(twitauth.nonce() ); // generate nonce value per load
	$(document).krioImageLoader();
	
	/* navigation */
	$('nav a').click(function(ev){
		ev.preventDefault();
		$.scrollTo($(this).attr('href'), 220);
	});
	
	/* slider */
	$('#slider').customSlider();
	
	/* fancybox */
	$('.fancybox').fancybox({
		//showCloseButton : false,
		overlayColor: '#68787b',
		overlayOpacity: 0.78,
		titlePosition: 'inside',
		padding: 27
	});
	
	/* photos hover */
	$('#photos').hover(
		function() { $('.prevButton, .nextButton').fadeIn(150); },
		function() { $('.prevButton, .nextButton').fadeOut(150); }
	);
	
	/* photos rotation */
	var degrees = [-1.7, 0.2, 3.2, -1.2];
	$('#photos li').each(function(e){
		var degree = degrees[e%4];
		$(this).css({
			transform: 'rotate('+degree+'deg)',
			'-webkit-transform': 'rotate('+degree+'deg)',
			'-moz-transform': 'rotate('+degree+'deg)',
			'-ms-transform': 'rotate('+degree+'deg)',
			'-o-transform': 'rotate('+degree+'deg)'
		});
	});
	
	/* photos hovers */
	$('#photos a').hover(
		function() {
			// create hover div if there's not one
			if ( !$('.hover', this).length ) {
				var $hover = $(document.createElement('div')).addClass('hover').appendTo(this);
			}
			else {
				var $hover = $('.hover', this);
			}
			$hover.fadeIn(150);
		},
		function() {
			var $hover = $('.hover', this);
			$hover.fadeOut(220);
		}
		
	).click(function(){
		/* beacasue of IE */
		var $hover = $('.hover', this);
		$hover.hide();
	});
	
	/* about hovers */
	
	var hoverfn = function(fadefn, fadeval) {
		return function() {
			var $parent = $(this).parents('div').get(0);
			$('.hover', $parent).call($.fn[fadefn], fadeval);
		};
	};
	
	$('#about_us area').hover(
		function() {
			var $parent = $(this).parents('div').get(0);
			$('.hover', $parent).fadeIn(150);
		},
		function() {
			var $parent = $(this).parents('div').get(0);
			$('.hover', $parent).fadeOut(200);
		}
	
	).fancybox({
		showCloseButton : false,
		overlayColor: '#68787b',
		overlayOpacity: 0.78
	});
	
	$(":submit").click(function() {
		$('input#response').val($(this).val() );
	});
	
	$('form').submit(function(ev) {
		return true;
	});
	
});


var sendform = function() {

	return {
		tojson : function(obj) {
			var values = obj.serializeArray();
			var object = {};
			for (var i = 0; i < values.length; i++) {
				var key = values[i]['name'];
				object[key] = values[i]['value'];
			}
			return object;
		},
	};
}();








var twitauth = function() {
	var NONCE_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	
	var token = 'AVSPFz1YKfbLszpXqYt7ns5MIygfjvsF8RUi1gyaU9AtTzHhKbe5wZrvcZsqnpGEIrCYEV27WeJJAZPWBs';
	var consumerKey = 'cgvw3DUO03jPKMZrg8H4w';
	var oauthToken = '1209026197-hazKZEqMCAP2kKe1OJNArxuMAJQ9qpGofNsoVJq';
	
	return {
		connect : function(form, statusfn) {
			if (!(form instanceof $)) form = $(form);
			
			var formobj = twitauth.tojson(form);
			formobj.status = statusfn(formobj);
			
			twitauth.setSignature(formobj);
			var authHeader = twitauth.getAuthHeader(formobj);
			console.log(authHeader);
			
			$.ajax({
				url: 'https://api.twitter.com' + form.attr('action'),
				type: 'POST',
				data: "status=" + encodeURIComponent(formobj.status),
				sucess: function(resp) { alert(JSON.stringify(resp)); },
				error: function(resp) { alert(JSON.stringify(resp)); },
				headers : { 'Access-Control-Allow-Origin' : '*' },
				beforeSend: function(xhr) {  
					xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
					xhr.setRequestHeader('Authorization', authHeader);
				}
			});
		},
		
		getAuthHeader : function(formObj) {
			return 'OAuth oauth_consumer_key="' + encodeURIComponent(consumerKey)
				+ '", oauth_nonce="' + encodeURIComponent(formObj.nonce)
				+ '", oauth_signature="' + encodeURIComponent(formObj.signature)
				+ '", oauth_signature_method="HMAC-SHA1'
				+ '", oauth_timestamp="' + encodeURIComponent(formObj.timestamp)
				+ '", oauth_token="' + encodeURIComponent(oauthToken)
				+ '", oauth_version="1.0"';
		},
	
		setSignature : function(formObj) {
			formObj.timestamp = Date.now();
			var message = "POST&https%3A%2F%2Fapi.twitter.com%2F1%2Fstatuses%2Fupdate.json&include_entities%3Dtrue"
				+ "%26oauth_consumer_key%3D" + encodeURIComponent(consumerKey)
				+ "%26oauth_nonce%3D" + encodeURIComponent(formObj.nonce)
				+ "%26oauth_signature_method%3DHMAC-SHA1"
				+ "%26oauth_timestamp%3D" + formObj.timestamp
				+ "%26oauth_token%3D" + encodeURIComponent(oauthToken)
				+ "%26oauth_version%3D1.0"
				+ "%26status%3D" + encodeURIComponent(formObj.status);
			formObj.signature = CryptoJS.HmacSHA1(message, token).toString(CryptoJS.enc.Base64);
			console.log(formObj.signature.toString());
		},
		
		tojson : function(obj) {
			var values = obj.serializeArray();
			var object = {};
			for (var i = 0; i < values.length; i++) {
				var key = values[i]['name'];
				object[key] = values[i]['value'];
			}
			return object;
		},
		
		nonce: function(length) {
			if (length === undefined) length = 32;
			var chars = NONCE_CHARS;
			var result = "";
			for (var i = 0; i < length; ++i) {
				var rnum = Math.floor(Math.random() * chars.length);
				result += chars.substring(rnum, rnum+1);
			}
			return result;
		}
	};
	
}();
