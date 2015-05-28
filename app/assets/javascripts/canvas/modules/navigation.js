var CanvasMenus = (function($){
  var $mainmenu;
  var lastScrolltop = 0;
  var lastLowPoint  = 0;
  var coverRemoved = false;

  $(document).on('content-ready', function (e, element) {
    initMainNav();
    initSubNavWithin(element);
  });

  function initMainNav() {
    $mainmenu = $('.navbar-fixed-top');

		// Hide navigation
		$('.cover').waypoint(function(direction) {
    	if (direction === 'down') {
        $mainmenu.addClass( "navbar-hide" );
	    }
		}, { 
			offset: function() {
		    return -$('.cover').height() * 0.15;
		   }
		});
		
		$('.cover').waypoint(function(direction) {
    	if (direction === 'up') {
        $mainmenu.removeClass( "navbar-hide" );
	    }
		}, { 
			offset: function() {
		    return -$('.cover').height() * 0.15;
		   }
		});

    $('.navbar').mouseover(function() {
      $mainmenu.addClass('visible');
    });

    $('.navbar').mouseleave(function() {
      setTimeout(function(){
        $mainmenu.removeClass('visible');
      }, 500);
    });


    // Auto show menu on scroll up
    $(window).on('scroll', function(e) {
      positionMainMenu();
    });
  }

  function initSubNavWithin(element) {
    var $subnav = $(element).find('#about-nav');
    var btn = 'button';
    if ($subnav.length > 0 && $subnav.parents('#page-preview').length == 0) {
      $subnav.find(btn).click(function(e) {
        e.preventDefault();
        $(this).parent().find(btn).removeClass('active');
        $(this).addClass('active');
        var dest_url = $(this).attr('href');

        $('.notched-borders').removeClass('one').removeClass('two').removeClass('three').removeClass('four').addClass($(this).data('pos'));

        var $content_container = $('.page-content').parent();
        $content_container.load(dest_url + ' .page-content', function () {
          $(document).trigger('content-ready', $content_container[0]);
        });

        if(history.pushState){
          history.replaceState({isModal: true}, null, dest_url);
          //history.pushState({}, null, dest_url);
        }
      });
    }
  }

  // controls the display behavior of the top nav menu.
  function positionMainMenu() {
    var scrolltop = $(this).scrollTop();
    var coverHeight = $('.cover').outerHeight();
    var navbarHeight = $mainmenu.outerHeight();
    var scrollUpOffset = 100;
    var scrollDownOffset = 75;

    if ($(window).width() < 768) {
      return false;
    }

    if (scrolltop >= (coverHeight-navbarHeight)) {
      
      if(!coverRemoved){

        coverRemoved = true;
        $mainmenu.removeClass('visible');
        setTimeout(function(){
          $mainmenu.removeClass('navbar-cover');
        }, 400);

        lastLowPoint = scrolltop;
      } 
      else if (scrolltop > lastScrolltop) {

        lastLowPoint = scrolltop;
        if(scrolltop > lastScrolltop + scrollDownOffset){

          $mainmenu.removeClass('visible');
        }
      }
      else if (lastScrolltop < (lastLowPoint - scrollUpOffset)) {

        lastScrolltop = scrolltop;

        $mainmenu.addClass('visible');
      }
    }
    else {
      $mainmenu.addClass('visible');

      if ($('.cover').length > 0) {
        $mainmenu.addClass('navbar-cover');
        coverRemoved = false;
      }
    }

    if(scrolltop > lastScrolltop + scrollDownOffset || scrolltop < lastLowPoint){
      lastScrolltop = scrolltop;
    }
  }

  // Return API for other modules
  return {
  };
})(jQuery);
