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

    btnAnchorInitialization(element);
  }

  function btnAnchorInitialization(element){
    $(element).find('.btn-anchor').unbind('click').click(function (e) {
      e.preventDefault();
      // if the btn has the class btn-anchor-outbound its url should be opened in a new window.
      if($(this).hasClass('btn-anchor-outbound')){
        window.open($(this).attr('data-url'));
      } else {
        window.location = $(this).attr('data-url');
      }
    });
  }

  // Return API for other modules
  return {
    getUniqueSelector: getUniqueSelector,
    contentReady: contentReady
  };
})(jQuery);
