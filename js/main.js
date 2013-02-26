jQuery(function($){

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
		formutil.validateForm();
	});
	
	$('form').submit(function() { return true; });
	
});


var formutil = function() {
	var show = {
		t : function(aClass, rClass) {
			return function(newmsg) {
				var msg = $('span#message');
				msg.removeClass(rClass).addClass(aClass);
				msg.text(newmsg);
				
			}
		}
	};
	show.error = show.t('error', 'success');
	show.success = show.t('success', 'error');
	
	return {
		validateForm : function() {
			var obj = formutil.tojson($('form'));
			var v = obj['entry.531332408']; // name field
			if (v === undefined || v.trim() === "") {
				show.error('please fill in your name');
			} else {
				show.success('thank you for responding!');
			}
		},
		
		tojson : function(obj) {
			var j = {};
			
			var fields = obj.serializeArray();
			for (var i = 0; i < fields.length; i++) {
				var v = fields[i].name;
				j[v] = fields[i].value;
			}
			return j;
		}
	}
}();


