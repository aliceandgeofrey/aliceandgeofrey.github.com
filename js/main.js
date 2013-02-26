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
		padding: 27,
		scrolling: 'no'
	});
	
	/* photos hover */
	$('#photos').hover(
		function() { $('.prevButton, .nextButton').fadeIn(150); },
		function() { $('.prevButton, .nextButton').fadeOut(150); }
	);
	
	$('#popupmap').click(function() {
		$('#map_canvas_container').removeClass('hide');
	});
	
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
	
	var initmap = function() {
		var centerNL = new google.maps.LatLng(43.65111,-79.49348);
		var myOptions = {
		  zoom: 15,
		  center: centerNL,
		  mapTypeId: google.maps.MapTypeId.ROADMAP,
		  mapTypeControl: false,
		  navigationControl: true,
		  navigationControlOptions: {
			style: google.maps.NavigationControlStyle.ZOOM_PAN,
			position: google.maps.ControlPosition.TOP_LEFT
		  }
		};

		var map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);
		
		var contenthtml = '<div><h3>Old Mill Inn</h3><p>21 Old Mill Road, Toronto, Ontario</p><a href="http://www.oldmilltoronto.com/" target="_blank" >Website</a> |  <a href="http://goo.gl/maps/HTsbE" target="_blank">View Larger Map</a></div>';
		var infowindow = new google.maps.InfoWindow({ content: contenthtml });

		var marker = new google.maps.Marker({
			position: centerNL, map: map, title: "Old Mill Inn, Toronto"
		});
		
		infowindow.open(map,marker);
		google.maps.event.addListener(marker, 'click', function() {
		  infowindow.open(map,marker);
		});
	};
	
	initmap();
	
});


var formutil = function() {
	var show = {
		t : function(aClass, rClass) {
			return function(newmsg) {
				var msg = $('span#message');
				msg.removeClass(rClass).addClass(aClass);
				msg.text(newmsg);
				return msg;
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
				$('form').submit(function() { return false; });
			} else {
				$('form').submit(function() { return true; });
				show.success('thank you for responding!').delay(3000).queue(function() {
				$('form input').val('');
				$('span#message').text('').dequeue();
			});
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


