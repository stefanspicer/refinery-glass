var CanvasParallax = (function($){
  $(document).on('content-ready', function (e, element) {
		
		$.stellar({
			horizontalScrolling: false,
      verticalScrolling: true,
      scrollProperty: 'scroll',
      positionProperty: 'transform',
      parallaxBackgrounds: false,
      parallaxElements: true,
      hideDistantElements: false,
      verticalOffset: 120
		});
		
  }); 

  //Return API for other modules
  return {
  };
})(jQuery);
