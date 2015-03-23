/**
 * Created by jkrump on 23/03/15.
 */

var GlassPagination = (function ($) {
  var FETCHING = false;

  $(document).on('content-ready', function (e, element) {
    var $showMoreButton = $('.btn-paginate-show-more');
    var $infiniteScrollContainer = $('.infinite-scrolling-container');
    var $paginationSpinner = $('.pagination-spinner');

    if($showMoreButton.length > 0 && (parseInt($showMoreButton.data('total-pages')) > 1)){
      $showMoreButton.click(function(e){
        e.preventDefault();
        if(!FETCHING){
          var moreUrl = $(this).attr('data-url');
          displaySpinner($paginationSpinner);
          FETCHING = true;
          $.getScript(moreUrl);
        }
      });
    }

    {

    if ($infiniteScrollContainer.length > 0 && (parseInt($infiniteScrollContainer.data('total-pages')) > 1))
      $(window).on('scroll', scrollHandler);
    }

    $(document).on('pagination-content-loaded', function(e, element) {
      FETCHING = false;
      $paginationSpinner.fadeOut(200);
    });

  });

  function scrollHandler(){
    var moreUrl = $('.infinite-scrolling-container').attr('data-url');
    var pixelOffsetFromBottom = 1200;
    var $paginationSpinner = $('.pagination-spinner');

    if(moreUrl && ($(window).scrollTop() > ($(document).height() - $(window).height() - pixelOffsetFromBottom))){
      if(!FETCHING){
        FETCHING = true;
        displaySpinner($paginationSpinner);
        $.getScript(moreUrl);
      }
    }
  }

  /**
   *
   * @param $paginationSpinner
   */
  function displaySpinner($paginationSpinner){
    if($paginationSpinner.length > 0){
      $paginationSpinner.fadeIn(200);
    }
  }

  return {
    scrollHandler: scrollHandler
  }

})(jQuery);