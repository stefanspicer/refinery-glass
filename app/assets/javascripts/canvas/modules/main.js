var Main = (function($){
  $(function(){
    $(document).on('ready', function(){
      contentReady(document.body);
    });
  });

  var getUniqueSelector = function (node) {
    if (node.length != 1) throw 'Requires one element.';

    var path;
    while (node.length) {
      var realNode = node[0], name = realNode.localName;
      if (!name) break;
      name = name.toLowerCase();

      var parent = node.parent();

      var siblings = parent.children(name);
      if (siblings.length > 1) {
        name += ':eq(' + siblings.index(realNode) + ')';
      }

      path = name + (path ? '>' + path : '');
      node = parent;
    }

    return path;
  };

  function contentReady(element) {
    $(document).trigger('content-ready', element);
    $('.btn-anchor').removeAttr('disabled');
    btnAnchorInitialization(element);
  }

  function btnAnchorInitialization(element){
    $(element).find('.btn-anchor').unbind('click').click(function (e) {
      e.preventDefault();
      var $btn = $(this);
      // if the btn has the class btn-anchor-outbound its url should be opened in a new window.
      if($btn.hasClass('btn-anchor-outbound')){
        window.open($btn.attr('data-url'));
      } else {
        window.location.href = $btn.attr('data-url');
      }

    });
  }

  // Return API for other modules
  return {
    getUniqueSelector: getUniqueSelector,
    contentReady: contentReady
  };
})(jQuery);
