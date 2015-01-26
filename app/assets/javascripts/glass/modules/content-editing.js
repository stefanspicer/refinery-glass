/**
 * Created by jkrump on 14/01/15.
 */
var GlassContentEditing = (function ($) {

  $(document).on('content-ready', function (e, element) {
    $(element).find('#page-preview').find('a').click(function(e){
      e.preventDefault();
      console.log('You tried to click a link on a preview page but are being prevented from visiting it so that you ' +
        'don\'t accidently travel away from the page you are editing. \nIf you would like to allow links to be clicked just comment out the code in ' +
        '"refinery-glass" branch, file: "content-editing.js". \nIf you wish for this console log to no longer display' +
        'comment it out there as well.');

    });
  });

  $.fn.extend({
    // A classChunk is an editable block that will be saved to the DB
    glassChunk: function () {
      var chunk = this.data('glass-chunk');
      if (!chunk) {
        chunk = new GlassChunk(this);
        this.data('glass-chunk', chunk);
      }
      return chunk;
    },
    // A glassHtmlEditor is a block of editable html (with modules)
    glassHtmlEditor: function () {
      var html = this.data('glass-html');
      if (!html) {
        html = new GlassHtmlEditor(this);
        this.data('glass-html', html);
      }
      return html;
    },
    // A glassModule is a piece within a glassHtmlEditor block
    glassHtmlModule: function ($glass_html_editor) {
      var module = this.data('glass-module');
      if (!module) {
        module = new GlassModule(this, $glass_html_editor);
        this.data('glass-module', module);
      }
      return module;
    },
    // A glassControl is an action (or set of actions) to be made on a module
    glassHtmlControl: function () {
      var control = this.data('glass-control');
      if (!control) {
        control = new GlassControl(this);
        this.data('glass-control', control);
      }
      return control;
    },
  });

  // #############################################################
  // # Save & Retrieve to DB (via hidden form)                   #
  // #############################################################

  function GlassChunk($elem) {
    this.ch = {'elem': $elem};

    // Return the glass editing options (default is 'text', like a fancy <input type="text">)
    this.options = function() {
      if (!this.ch.options) {
        var opt_str = this.ch.elem.attr('data-glass-options');
        this.ch.options = $.extend({'type': 'text'}, opt_str ? JSON.parse(opt_str) : {});
      }
      return this.ch.options;
    };

    this.option = function(key) {
      return (key in this.options()) ? this.options()[key] : null;
    };

    this.getFormElement = function() {
      if (!this.ch.form_elem) {
        this.ch.form_elem = this.option('form_id') ? $('#' + this.option('form_id')) : null;
      }
      return this.ch.form_elem;
    };

    this.getForm = function() {
      var $form_elem = this.getFormElement();
      return $form_elem ? $form_elem.parents('form') : null;
    };

    this.setFormValFromHtml = function() {
      var $form_elem = this.getFormElement();
      if ($form_elem) {
        if (this.option('type') == 'text') {
          $form_elem.val(this.ch.elem.html());
        }
        else if (this.option('type') == 'html') {
          $form_elem.val(this.ch.editor.formatHtml());
        }
      }
    };

    this.makeEditable = function() {
      if (this.option('type') == 'text') {
        this.ch.elem.attr('contenteditable', true);
      }
      else if (this.option('type') == 'html') {
        this.ch.editor = this.ch.elem.glassHtmlEditor();
      }
    }
  }

  // #############################################################
  // # HTML editor (actually manipulate the html)                #
  // #############################################################
  function GlassHtmlEditor($elem) {
    var this_editor = this;
    this.h = {'elem': $elem, 'control': {}, 'control_stack': []};

    this.control = function(key) {
      return this.h.control[key];
    };

    this.curModule = function() {
      return this.h.cur_module;
    };

    this.setCurModule = function($module) {
      this.h.cur_module = $module;
      this.hideControl();
    };

    this.attachControl = function(key) {
      var $control = this.control(key);
      var stack = this.h.control_stack;
      $control.attachToModule(this.curModule());
      if (stack.length > 0) {
        stack[stack.length - 1].element().hide();
      }
      stack.push($control);
    };

    this.closeCurControl = function() {
      var stack = this.h.control_stack;
      stack.pop().element().hide();
      stack[stack.length - 1].element().fadeIn();
    };

    this.moduleBefore = function($module) {
      var $prev_elem = $module.element().prev('[contenteditable=true]');
      return ($prev_elem && $prev_elem.data('glass-module')) ? $prev_elem.glassHtmlModule(this_editor) : null;
    };

    this.insertNewModuleAfter = function($hook) {
      var $new_para = $('<p/>', { placeholder: 'New paragraph...' });
      $hook.insertAfter("\n  ");
      $new_para.insertAfter($hook);
      $(document).trigger('content-ready', $new_para[0]);
      var $new_module = $new_para.glassHtmlModule(this_editor);
      this.attachControl('change_module');
      return $new_module;
    };

    this.hideControl = function() {
      this.h.elem.find('.glass-control').appendTo('#glass-parking');
      this.h.control_stack = [];
    };

    this.formatHtml = function() {
      this.h.elem.find('[contenteditable=true]').removeAttr('contenteditable');
      this.hideControl();
      return this.h.elem.html().trim();
    };

    // Initialization
    // ##########################################
    this.h.elem.find('p, h1, h2, h3, h4, h5, h6').each(function () {
      if ($(this).parents('.glass-no-edit').length == 0) {
        // new GlassModule ??
        $(this).glassHtmlModule(this_editor);
      }
    });

    this.h.control['change_module'] = $('#glass-change-module').glassHtmlControl();
    this.h.control['choose_module'] = $('#glass-choose-module').glassHtmlControl();
    this.h.control['settings_vid']  = $('#glass-module-settings-vid').glassHtmlControl();
    //this.h['control']['change_module'] = $('#glass-change-module').glassHtmlControl();
    //this.h['control']['choose_module'] = $('#glass-choose-module').glassHtmlControl();
    //this.h['control']['settings_vid']  = $('#glass-module-settings-vid').glassHtmlControl();

    $('#glass-change-module').click(function (e) {
      e.preventDefault();
      this_editor.attachControl('choose_module');
    });

    $('#glass-choose-module-vid').click(function (e) {
      e.preventDefault();
      this_editor.attachControl('settings_vid');
    });

    $('.glass-control-close').click(function (e) {
      e.preventDefault();
      this_editor.closeCurControl();
    });
  }

  // #############################################################
  // # Module - a paragraph, heading, img, video...              #
  // #############################################################
  function GlassModule($elem, $editor) {
    var this_module = this;
    this.m = {'elem': $elem, 'editor': $editor};

    this.focus = function() {
      //$new_module.find('p').first().focus();
      this.m.elem.focus();
      this.m.editor.setCurModule(this);
    };

    this.element = function() {
      return this.m.elem;
    };

    this.remove = function() {
      this.m.elem.remove();
    }

    // Initialization
    // ##########################################
    this.m.elem.attr('contenteditable', true);
    this.m.elem.focusout(function () {
      if (!$(this).text().trim()) {
        $(this).html(''); // For FF, it puts a <br type='-moz'> in there
      }
    });
    this.m.elem.keypress(function(e) {
      if (e.which == 13) { // ENTER
        e.preventDefault();
        var $new_module = this_module.m.editor.insertNewModuleAfter($(this));
      }

      if ((e.which == 8 || e.which == 46) && !$(this).text().trim()) { // BACKSPACE (& empty)
        e.preventDefault();
        this_module.m.editor.hideControl();
        this_module.m.editor.moduleBefore(this_module).focus();
        this_module.remove();
      }
    });
    this.focus();
  }

  // #############################################################
  // # Control - actions on a module (change type, delete...)    #
  // #############################################################
  function GlassControl($elem) {
    this.c = {'elem': $elem};

    this.attachToModule = function($module) {
      this.c.elem.fadeIn().insertBefore($module.element());
    }

    this.element = function() {
      return this.c.elem;
    };
  }

  $(document).on('content-ready', function (e, element) {
    var $glass_editables = $(element).find('.glass-edit');

    var $form = null;
    $glass_editables.each(function () {
      var $chunk  = $(this).glassChunk();
      $chunk.makeEditable();

      if ($chunk.getForm()) {
        $form = $chunk.getForm();
      }
    });

    if ($form) {
      $form.submit(function (e) {
        $('.glass-edit').each(function () {
          $(this).glassChunk().setFormValFromHtml();
        });
      });
    }
  });

  // Return API for other modules
  return {};
})(jQuery);
