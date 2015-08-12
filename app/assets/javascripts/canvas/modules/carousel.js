var CanvasCarousel = (function($){
  $(document).on('content-ready', function (e, element) {

    var $carousel = $('.carousel');
    var $item = $('.carousel-inner');


    $carousel.waypoint(function() {
      $carousel.carousel('cycle');
      $item.addClass('initiated');
    }, {
      offset: 'bottom-in-view'
    });

    // Carousel in view
    $carousel.waypoint(function(direction) {

      if (direction === 'down') {
        $item.addClass('caption-init');
      }
    }, {
      offset: 'bottom-in-view'
    });

    // Allow carousel navigation using swipe gestures.
    if($carousel.length > 0){

      $carousel.each(function(index, element){
        Hammer($carousel[index]).on('panright', function() {
          $($carousel[index]).carousel('prev');
        });

        Hammer($carousel[index]).on('panleft', function () {
          $($carousel[index]).carousel('next');
        });
      });
    }
  });

  // Return API for other modules
  return {};
})(jQuery);
