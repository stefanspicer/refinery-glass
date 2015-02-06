/**
 * Created by jkrump on 06/02/15.
 */
var GlassModals = (function ($) {

  $(document).on('content-ready', function (e, element) {
    var openModalForm = $(element).find('.open-semantic-modal-form');

    openModalForm.unbind('click').click(function(e){
      e.preventDefault();
      displayFormInModal($(this), element);
    });
  });

  /**
   * Opens a semantic modal which contains content from the page that
   * the element was linked to.
   * @param anchor - an element that was clicked which triggered the
   * modal to show.
   */
  function displayFormInModal(anchor, container){

    var titleText = $(container).text();
    var content = $(container).find('.form-modal .content');

    $.get(anchor.attr('href'), function(data){
      var pageContent = $(data).find('.admin-page');

      console.log(pageContent);
      $(container).find('.form-modal .header').text(titleText);
      $(content).html(pageContent);

      $('.form-modal')
        .modal('show');

    });

  }

})(jQuery);