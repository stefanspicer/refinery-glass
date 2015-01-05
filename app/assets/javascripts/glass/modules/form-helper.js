/**
 * Created by jkrump on 22/12/14.
 */

var GlassFormHelper = (function($){

    function resetState(){
        $('.help-inline').remove();
        $('.error').removeClass('error');
    }

    function insertErrors(form, errorMessages, imageForm){
        resetState();

        if (imageForm !== undefined){
            insertMessage('image', errorMessages);
            return 0;
        }

        var errorContainer = [
            '<div class="payment-error-explanation errorExplanation" id="errorExplanation">',
            '<p>Please check below for errors</p></div>'].join("");

        form.find('#errorExplanation').replaceWith(errorContainer);


        for(var attribute in errorMessages){
            insertMessage(attribute, errorMessages);
        }

        showAndGoToErrors(form);
    }

    function insertMessage(attribute, errorMessages){
        var errorMessage = ['<span class="help-inline text-danger">',errorMessages[attribute][0],'</span>'].join("");

        if (attribute == 'image'){
            $('.file-preview').addClass('error').after(errorMessage);
        } else {
            var inputSelector = $('input[name="'+attribute+'"]');
            inputSelector.parents('.form-group').addClass('error');

            if(inputSelector.parents('.input-group').length > 0){
                inputSelector.parents('.input-group').after(errorMessage);
            } else {
                inputSelector.after(errorMessage)
            }
        }

    }

    function insertStripeErrors(form, messages){

        var errorContainer = [
            '<div class="payment-error-explanation errorExplanation" id="errorExplanation">',
            '<p>There were problems with the following:</p>'];

        errorContainer.push("<ul class='payment-errors list-unstyled'>");
        $(messages).each(function(index, message){
            errorContainer.push("<li>",message,"</li>");
        });
        errorContainer.push("</ul></div>");
        form.find('#errorExplanation').replaceWith(errorContainer.join(""));

        showAndGoToErrors(form);
    }

    function showAndGoToErrors(form){
        form.find('.payment-error-explanation').removeClass('hidden');

        $('html, body').animate({
            scrollTop: $('.payment-error-explanation').offset().top - 73
        }, 500);

        form.find('button').prop('disabled', false);
    }

    // Return API for other modules
    return {
        insertStripeErrors: insertStripeErrors,
        insertErrors: insertErrors,
        resetState: resetState
    };
})(jQuery);
