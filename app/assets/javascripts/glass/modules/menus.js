/**
 * Created by StefanS on 2014-Dec-10
 */

var GlassMenus = (function ($) {
  $(document).on('content-ready', function (e, element) {

    var leftSidebar = $('#sidebar-left').first();
    var rightSidebar = $('#sidebar-right').first();

    // set callback listeners for semantic-ui sidebars that cause the no-scroll class to be toggled.
    leftSidebar.sidebar('attach events', '.sidebar-left-opener', 'overlay', 'show')
      .sidebar('setting', {
        onShow : function(){
          $('#wrapper').addClass('no-scroll');
        },
        onHide : function(){
          $('#wrapper').removeClass('no-scroll');
        }
      });

    rightSidebar.sidebar('attach events', '.sidebar-right-opener', 'overlay', 'show')
      .sidebar('setting', {
        onShow : function(){
          $('#wrapper').addClass('no-scroll');
        },
        onHide : function(){
          $('#wrapper').removeClass('no-scroll');
        }
      });

    $(element).find('.sidebar-left-opener').click(function (e) {
      e.preventDefault();
    });
    $(element).find('.sidebar-right-opener').click(function (e) {
      e.preventDefault();
    });

  });

  // Return API for other modules
  return {};
})(jQuery);
