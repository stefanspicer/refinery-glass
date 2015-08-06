/**
 * A module for handling methods relating to an inline datetimepicker which is inside a wrapper
 * and behaves somewhat like a modal.
 * Note: To see documentation for the datetimepicker used visit: http://eonasdan.github.io/bootstrap-datetimepicker
 *       For documentation of moment.js visit: http://momentjs.com/docs
 * @author Joseph Krump
 * @param  {Jquery} $)
 * @return {Object} - An object containing any of the publicly accessible methods of this module.
 */
var DatePickerWrapper = (function($){

  $(document).on('content-ready', function (e, element) {
    $('.datepicker-opener').each(function () {
      initDatePicker($(this));
    });
  });

  /**
   * Create a single datepicker to be used in a modal
   * @return {undefined}
   */
  var initDatePicker = function($btn){
    var $container = $($btn.data('container-selector'));
    var $dpElement = $container.find('.inline-dp-root');
    var format = 'MM/DD/YYYY';
    var disabledDays = $btn.data('disabled-weekdays') || [];
    var originalHTML = $btn.html();
    var $btnClearDP = $btn.siblings('.clear-dp');
    var $wrapper = $($btn.data('container-selector')).find('.datepicker-wrapper');
    var icons = {
      time: 'icon icon-clock',
      date: 'icon icon-calendar',
      up: 'icon icon-angle-up',
      down: 'icon icon-angle-down',
      previous: 'icon icon-angle-left',
      next: 'icon icon-angle-right',
      today: 'icon icon-crosshair',
      clear: 'icon icon-trash',
      close: 'icon icon-cancel'
    };
    var dpOptions = {
      format: format,
      inline: true,
      sideBySide: true, // set to false if you want to time picker to be accessible in toolbar.
      daysOfWeekDisabled: disabledDays,
      icons: icons
    };

    var btnFormat = (dateformat = $btn.data('date-format')) ? dateformat : 'MMM. D';

    if($dpElement.length === 0){
      console.log("Datepicker error - root node not found");
      return null;
    }

    $dpElement.datetimepicker(dpOptions);

    var $dp = $dpElement.data('DateTimePicker');

    if($btn.data('default-datetime')){
      $dp.date(moment($btn.data('default-datetime')));
    }

    if($btn.data('date-input')){
      setDateTimePickerDateTime($dp, false, moment($($btn.data('date-input')).val(), "YYYY-MM-DD"));
    } else if($container.hasClass('has-time-field')) {

      var newMoment = moment('10:00 AM', 'H:mm A');
      setDateTimePickerDateTime($dp, true, newMoment);
    }

    $btnClearDP.click(function(e){
      e.preventDefault();
      console.log(originalHTML);
      $btn.removeClass('toggled').html(originalHTML); // return text back to its original
      $btnClearDP.addClass('toggled');
      $wrapper.removeClass('active');
      resetDP($container, $dp);
    });

    /**
     * Handles the datepicker's value changing.
     * @param  {Event} e - the dp.change event. Contains date and oldDate
     * @return {undefined}
     */
    var changeInputOnDatepickerChange = function(e) {
      var format      = e.data.format;
      var $wrapper    = $($btn.data('container-selector')).find('.datepicker-wrapper');
      var $inputField = $wrapper.find('input.' + (format === 'LT' ? 'time' : 'date') + '-only');

      $inputField.val(e.date.format(format));
      handleDateChange($btn, $dp, $wrapper.hasClass('active'));
    };

    $dpElement.on('dp.change', {format: 'MM/DD/YYYY'}, changeInputOnDatepickerChange);
    $dpElement.on('dp.change', {format: 'LT'},         changeInputOnDatepickerChange);

    /**
     * Toggles the visiblity of the dp
     * @param  {Event} e - The click event on the button that toggled the visiblity
     * @return undefined
     */
    var toggleVisibility = function(e) {
      e.preventDefault();

      handleDateChange($btn, $dp, $wrapper.hasClass('active'));

      $btn.addClass('toggled');
      $wrapper.toggleClass('active');

      if($btnClearDP.length > 0 && $btnClearDP.hasClass('toggled')) {
        $btnClearDP.removeClass('toggled');
      }
    };

    var updateButtonText = function(e){
      e.preventDefault();

      var icons = $btn.find('i');
      $btn.html(' ' + $dp.date().format(btnFormat)).prepend(icons[1]).prepend(icons[0]);
    }

    // When either the close button or the button that opens the datepicker are clicked,
    // Toggle the visiblity of the corresponding datetimepicker.
    //
    $container.find('.close-dp').click(toggleVisibility);
    $btn.click(toggleVisibility);
    $container.find('.save-dp').click(updateButtonText);

    // NOTE: TEMPORARILY REMOVED. THIS WOULD SWITCH BETWEEN THE DATEPICKER AND THE TIME
    //       PICKER DEPENDING ON WHAT INPUT IS IN FOCUS - JK
    // $('.datepicker-fields input[type=text]').focus(function(e){
    //   e.preventDefault();

    //   if($dp.format() === 'MM/DD/YYYY' && $(this).hasClass('time-only')){
    //     $dp.hide().format('LT').show();
    //   } else if($dp.format() === 'LT' && $(this).hasClass('date-only')) {
    //     $dp.hide().format('MM/DD/YYYY').show();
    //   }
    // });

    $container.find('input[type=text]').change(function(e){
      var $inputField = $(this);
      var inputfieldFormat = $inputField.hasClass('time-only') ? 'LT' : 'MM/DD/YYYY';

      // get the number of integers in the string.
      var intsCount = $inputField.val().replace(/[^0-9]/g,"").length;
      var originalFormat = inputfieldFormat;
      // The format used for Time as 'HH:MM am/pm' is LT
      var isTime = originalFormat === 'LT' ? true : false;

      inputfieldFormat = setDateFormat(inputfieldFormat, intsCount);
      console.log($inputField.val());
      console.log(inputfieldFormat);
      console.log(originalFormat);

      var newMomentObject = moment($inputField.val(), inputfieldFormat);

      console.log(newMomentObject);
      console.log(newMomentObject.isValid());

      // Based on whether the momentObject is valid or not (using moment.js .isValid()), add, or remove the 'has-error'
      // class and change the value in the input field and for the datetimepicker.
      if(newMomentObject.isValid()){

        setDateTimePickerDateTime($dp, isTime, newMomentObject);
        // If there were any error classes added to this input field's parent  then remove them.
        $inputField.parent().removeClass('has-error');
        // Set the input field's value to the formatted value.
        $inputField.val(newMomentObject.format(originalFormat));
      } else {

        setDefaultDateOrTime($inputField, $dp);
        // If validation failed then add the 'has-error' class to the input field's parent
        // Note: 'has-error' is a bootstrap class.
        $inputField.parent().addClass('has-error');
      }
    });
  };

  /**
   * Method for resetting a specific part of the datepicker to it's default value
   * @param {Object} $inputField - The specific field (date or time) to reset
   * @param {DatePicker} $dp     - The current datetimepicker
   */
  function setDefaultDateOrTime($inputField, $dp){
    var inputfieldFormat = $inputField.hasClass('time-only') ? 'LT' : 'MM/DD/YYYY';
    var isTime = inputfieldFormat === 'LT' ? true : false;
    var newMoment;

    if(isTime){
      newMoment = moment('10:00 AM', 'H:mm A');
      $inputField.val(newMoment.format('H:mm A'));
      setDateTimePickerDateTime($dp, isTime, newMoment);
    } else {
      newMoment = moment();
      $inputField.val(newMoment.format(inputfieldFormat));
      setDateTimePickerDateTime($dp, isTime, newMoment);
    }
  }

  /**
   * Resets the values of the dp's input fields while
   * still preserving the date store for the dp so if
   * opened again, the user can continue where they leLT off.
   * @param  {Object} $container - The DOM element that contains the datepicker wrapper
   * @param  {DatePicker} $dp    - The datepicker module
   * @return undefined
   */
  function resetDP($container, $dp){
    $container.find('input[type=text]').each(function(){
      $(this).val(''); // reset the value in the input fields
    });
  }

  function setDateTimePickerDateTime($dp, isTime, newMomentObject){
    var currentDate = $dp.date();

    // Set the appropriate values to update the current moment object that is used to keep track of
    // the datetimepicker widget's datetime.
    if(isTime){
      currentDate.hour(newMomentObject.hour()).minute(newMomentObject.minute());
    } else {
      currentDate.year(newMomentObject.year()).month(newMomentObject.month()).date(newMomentObject.date());
    }

    // Set the datetimepicker to be the moment that was set.
    $dp.date(currentDate);
    return currentDate;
  }

  /**
   * Sets the correct datepicker format to use based on the number of
   * ints in the string that was entered.
   * @param {string} inputfieldFormat - The string that was entered into a date text field.
   * @param {int} intsCount - The number of integers persent in the date string that was entered.
   * @return {string} - a string containing the date format to use.
   */
  function setDateFormat(inputfieldFormat, intsCount){

   if(inputfieldFormat === 'MM/DD/YYYY' && intsCount <= 7){
      inputfieldFormat= 'MM/DD/YY';
    }
    return inputfieldFormat;
  }

  function handleDateChange($btn, $dp, closing) {
    var callback = $btn.data('on-date-change');
    if (callback && closing) {
      callback($dp.date());
    }

    $($btn.data('date-input')).val($dp.date().format('MM/DD/YYYY'));
  }

  // Return API for other modules
  return {};
})(jQuery);
