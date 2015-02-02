/**
 * Created by StefanS on 2014-Dec-10
 */

var GlassMenus = (function ($) {
  $(document).on('content-ready', function (e, element) {

    var leftSidebar = $('#sidebar-left').first();
    var rightSidebar = $('#sidebar-right').first();

    leftSidebar.sidebar('attach events', '.sidebar-left-opener', 'overlay', 'show');
    rightSidebar.sidebar('attach events', '.sidebar-right-opener', 'overlay', 'show');

    $(element).find('.sidebar-left-opener').click(function (e) {
      e.preventDefault();
      $('body.pushable').toggleClass('no-scroll');
    });
    $(element).find('.sidebar-right-opener').click(function (e) {
      e.preventDefault();
      $('body.pushable').toggleClass('no-scroll');
    });

  });

  // Return API for other modules
  return {};
})(jQuery);
