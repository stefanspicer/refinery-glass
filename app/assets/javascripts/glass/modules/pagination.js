/**
 * Created by jkrump on 23/03/15.
 */

var GlassPagination = (function ($) {
  $(document).on('content-ready', function (e, element) {
    $('.btn-paginate-show-more').click(function(e){
      e.preventDefault();
      var moreUrl = $(this).data('url');
      $.getScript(moreUrl);
    });

    if ($('.infinite-scrolling-container').length > 0){
      $(window).on('scroll', function(e){
        var moreUrl = $(this).data('url');
        if(moreUrl && ($(window).scrollTop() > ($(document).height() - $(window).height() - 60))){
          $.getScript(moreUrl);
        }
      });
    }
  });

  return {}

})(jQuery);