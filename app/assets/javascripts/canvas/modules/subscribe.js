var CanvasSubscribe = (function($){
  $(document).on('content-ready', function (e, element) {
  		
  	var $form = $('#subscribe-form');
    var $wrapper = $('.subscribe-wrapper');
    var $container = $form.find('#open-form');
    var $first_name = $form.find('#first-name');
  		
    $(element).find('#subscribe-form').click(function (e) {  
      if ($container.hasClass('closed')) {
	      $container.removeClass('closed');
	      $wrapper.addClass('open');
	      $first_name.focus();
      }
    });
    
    $(element).find('#subscribe-form #open-form').keydown(function(e) {
    	if($('#subscribe-form #open-form').hasClass('closed')) {
		   e.preventDefault();
		   return false;
		   }
		});
		
		
		$(document).on('click', function(event) {
		  if (!$(event.target).closest('#subscribe-form').length) {
			  if ($container.hasClass('closed')) {
			  
			  } else {
			  	$container.addClass('closed');
			  	$wrapper.removeClass('open');
			  }
		  }
		});
		
  });

  //Return API for other modules
  return {
  };
})(jQuery);
