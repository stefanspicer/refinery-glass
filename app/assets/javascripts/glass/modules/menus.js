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
          showSidebar();
        },
        onHide : function(){
          hideSidebar();
        }
      });

    rightSidebar.sidebar('attach events', '.sidebar-right-opener', 'overlay', 'show')
      .sidebar('setting', {
        onShow : function(){
          showSidebar();
        },
        onHide : function(){
          hideSidebar();
        }
      });

    $(element).find('.sidebar-left-opener').click(function (e) {
      e.preventDefault();
    });
    $(element).find('.sidebar-right-opener').click(function (e) {
      e.preventDefault();
    });

  });

  function hideSidebar(){
    console.log('hide');
    var wrapperDiv = $('#wrapper');
    if(wrapperDiv.length == 0){
      wrapperDiv = $('.pusher').first();
    }
    console.log(wrapperDiv);
    var top = wrapperDiv.css('top');

    wrapperDiv.css({top : '0px'}).removeClass('no-scroll');
    $('body').scrollTop(top.slice(1,-2));
  }

  function showSidebar(){
    console.log('show');
    var wrapperDiv = $('#wrapper');
    if(wrapperDiv.length == 0){
      wrapperDiv = $('.pusher').first();
    }
    wrapperDiv.css({top : '-'+$('body').scrollTop()+'px'}).addClass('no-scroll');
  }

  // Return API for other modules
  return {
    hideSidebar: hideSidebar,
    showSidebar: showSidebar
  };
})(jQuery);
