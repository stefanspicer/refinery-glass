/**
 * Created by StefanS on 2014-Dec-10
 */

var GlassMenus = (function ($) {
  $(document).on('content-ready', function (e, element) {

    var $cmsLeftSidebar = $('#sidebar-left').first();
    var $cmsRightSidebar = $('#sidebar-right').first();
    var $cmsLeftLogo = $cmsLeftSidebar.find('.site-name .gcicon');
    var leftSidebars = $('.ui.sidebar.left');
    var rightSidebars = $('.ui.sidebar.right');

    $cmsLeftSidebar.mouseover(function(){
      if(!$(this).hasClass('visible')){
        $cmsLeftSidebar.sidebar('show');
      }

      $('.pusher').unbind('mouseover').mouseover(function(){
        if($cmsLeftSidebar.hasClass('visible')){
          $cmsLeftSidebar.sidebar('hide');
        }
      });
    });

    $cmsLeftLogo.unbind('click').click(function(e){
      e.preventDefault();
      if($cmsLeftSidebar.sidebar('is visible')){
        $cmsLeftSidebar.sidebar('hide');
      } else {
        $cmsLeftSidebar.sidebar('show');
      }
    });

    // Hide and show sidebars based on swipe gestures
    //if(leftSidebars.length > 0){
    //  Hammer(leftSidebars[0]).on('panright', function(e) {
    //    $(leftSidebars[0]).sidebar('show');
    //  });
    //
    //
    //  Hammer(leftSidebars[0]).on('panleft', function (e) {
    //    $(leftSidebars[0]).sidebar('hide');
    //  });
    //}
    //
    //if(rightSidebars.length > 0){
    //  Hammer(rightSidebars[0]).on('panright', function(e) {
    //    $(rightSidebars[0]).sidebar('hide');
    //  });
    //
    //  Hammer(rightSidebars[0]).on('panleft', function(e) {
    //    $(rightSidebars[0]).sidebar('show');
    //  });
    //}

    // set callback listeners for semantic-ui sidebars that cause the no-scroll class to be toggled.
    $cmsLeftSidebar.sidebar('attach events', '.sidebar-left-opener', 'overlay', 'show')
      .sidebar('setting', {
        onShow : function(){
          showSidebar();
        },
        onHide : function(){
          hideSidebar();
        }
      });

    $cmsRightSidebar.sidebar('attach events', '.sidebar-right-opener', 'overlay', 'show')
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
    var wrapperDiv = $('#wrapper');
    if(wrapperDiv.length == 0){
      wrapperDiv = $('.pusher').first();
    }
    var top = wrapperDiv.css('top');

    wrapperDiv.css({top : '0px'}).removeClass('no-scroll');
    $('body').scrollTop(top.slice(1,-2));
  }

  function showSidebar(){
    var wrapperDiv = $('#wrapper');
    var topAmt = '-' + $('body').scrollTop() + 'px';
    if(wrapperDiv.length == 0){
      wrapperDiv = $('.pusher').first();
    }

    wrapperDiv.css({top : topAmt}).addClass('no-scroll');
  }

  // Return API for other modules
  return {
    hideSidebar: hideSidebar,
    showSidebar: showSidebar
  };
})(jQuery);
