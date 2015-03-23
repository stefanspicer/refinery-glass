/**
 * Created by jkrump on 23/03/15.
 */

var GlassPagination = (function ($) {
  var FETCHING = false;

  $(document).on('content-ready', function (e, element) {
    var $showMoreButton = $('.btn-paginate-show-more');
    var $infiniteScrollContainer = $('.infinite-scrolling-container');

    if($showMoreButton.length > 0){
      $showMoreButton.click(function(e){
        e.preventDefault();
        var moreUrl = $(this).attr('data-url');
        $.getScript(moreUrl);
      });
    }

    if ($infiniteScrollContainer.length > 0){
      $(document).on('pagination-content-loaded', function(e, element) {
        FETCHING = false;
      });

      $(window).on('scroll', scrollHandler);

    }
  });

  function scrollHandler(){
    var moreUrl = $('.infinite-scrolling-container').attr('data-url');
    var pixelOffsetFromBottom = 1200;

    if(moreUrl && ($(window).scrollTop() > ($(document).height() - $(window).height() - pixelOffsetFromBottom))){
      if(!FETCHING){
        FETCHING = true;
        $.getScript(moreUrl);
      }
    }
  }



  return {
    scrollHandler: scrollHandler
  }

})(jQuery);