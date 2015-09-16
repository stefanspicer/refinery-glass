var Payment = (function($){

  var stripeResponseHandler;

  $(document).on('content-ready', function (e, element) {
    var $publishedKeyInput = $(element).find('#published_key');
    var $paymentForm = $(element).find('.payment-form');

    // return early if there has been to published_key set.
    if($publishedKeyInput.length === 0 && $paymentForm.length !== 0){
      var published_key_div = '<input type="hidden" id="published_key" value="<%= Rails.configuration.stripe[:publishable_key] %>"/>';

      console.warn('publishedKeyInput not set');
      console.log('to fix add this line into the view with the form: ' + published_key_div);
      return;
    }

    if ($publishedKeyInput.length > 0) {
      try {
        Stripe.setPublishableKey($publishedKeyInput.val());
      } catch (e) {
        console.warn(e);
        return;
      }
    }

    // If a donation amount button is pressed, insert that amount into the amount field.
    var $priceList = $(element).find('.price-list');
    $priceList.find('.btn').click(function(e){
      e.preventDefault();
      var btn = $(this);
      var amt = btn.data('amount');

      var monthly = $priceList.data('monthly-selector');
      var oneTime = $priceList.data('one-time-selector');

      if(btn.hasClass('monthly-amt')){
        $(monthly).prop("checked", true);
      } else{
        $(oneTime).prop("checked", true);
      }
      var fieldSelector = $priceList.data('field-selector');
      $(fieldSelector).val(amt).focus();
    });

    // Listen for and handle a payment form submission
    $paymentForm.find('.payment-btn').click(function(e){
      var $form = $(this).parents('form');
      var $termsModal = $('#accept-terms-modal');

      // If there is a EULA that must be agreed to before proceeding,
      if($termsModal.length > 0){
        $termsModal.modal('refresh');

        $termsModal.find('.btn-success').click(function(e){
          e.preventDefault();
          processStripeToken($form);
          $termsModal.modal('hide');
        });
        $termsModal.modal({closable: false, onVisible: function(){
          $(this).modal('refresh');
        }, onHidden: function(){
          $(this).remove(); // after the agreement has been accepted, remove the modal
        }}).modal('show');
      } else {
        processStripeToken($form);
      }
      return false;
    });
  });

  // Make request to stripe to get a token.
  function processStripeToken($form){
    CanvasForms.disableSubmit($form);
    Stripe.card.createToken($form, stripeResponseHandler);
    return false;
  }

  stripeResponseHandler = function(status, response) {

    var $form = $('.payment-form');

    if (response.error) {
      CanvasForms.insertErrors($form, [response.error.message], null);

      return false;
    } else {
      // token contains id, last4, and card type
      var token = response.id;
      // Insert the token into the form so it gets submitted to the server
      $('#stripeToken').remove();
      $form.append($('<input id="stripeToken" type="hidden" name="stripeToken" />').val(token));
      $form.submit();
    }
  };

  // Return API for other modules
  return {};
})(jQuery);
