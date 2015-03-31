var CanvasCarousel = (function($){
  $(document).on('content-ready', function (e, element) {

		var $item = $('.carousel-inner');

		// Carousel pause
    $('.carousel').waypoint(function() {
      $('.carousel').carousel('cycle')
      $item.addClass('initiated');
    }, {
      offset: 'bottom-in-view'
    });

    // Carousel in view
    $('.carousel').waypoint(function(direction) {
      if (direction === 'down') {
        $item.addClass('caption-init');
      }
    }, {
      offset: 'bottom-in-view'
    });
  }); 

  // Return API for other modules
  return {};

})(jQuery);
