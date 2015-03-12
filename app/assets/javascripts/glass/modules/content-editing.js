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
    glassIsaModule: function () {
      return this.data('glass-module') ? true : false;
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

  // JQuery seems to get in the way here.. need to add event to raw DOM element
  function filterPasteEvents(element) {
    element.addEventListener("paste", function (e) {
      e.preventDefault();

      if (e && e.clipboardData && e.clipboardData.getData) {
        var text = e.clipboardData.getData("text/plain");
        document.execCommand("insertHTML", false, text);
      }
      else {
        alert("Sorry, you will need a different browser in order to paste content"); // FIXME
      }
    });
  }

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
      if (this.ch.form_elem.length < 1) {
        console.log("WARNING: editable field couldn't find form element: #" + this.option('form_id'));
        console.log("WARNING: suggestion, you might need to add page parts to config/initializers/refinery/pages.rb");
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
          $form_elem.val(this.ch.elem.text());
        }
        else if (this.option('type') == 'html') {
          $form_elem.val(this.ch.editor.formatHtml());
        }
      }
    };

    this.makeEditable = function() {
      if (this.option('type') == 'text') {
        this.ch.elem.attr('contenteditable', true);
        filterPasteEvents(this.ch.elem[0]);
      }
      else if (this.option('type') == 'html') {
        this.ch.editor = this.ch.elem.glassHtmlEditor();
      }
    };

    this.tabTo = function(next_chunk) {
      this.ch.elem.keydown(function(e) {
        if (e && e.which == 9) { // TAB key - go to next editable
          e.preventDefault();
          next_chunk.ch.elem.focus();
          return false;
        }
      });
    };
  }

  // #############################################################
  // # HTML editor (actually manipulate the html)                #
  // #############################################################
  function GlassHtmlEditor($elem) {
    var this_editor = this;
    this.h = {'elem': $elem, 'control_stack': []};

    this.element = function() {
      return this.h.elem;
    };

    this.curModule = function() {
      return this.h.cur_module;
    };

    this.isCurModule = function($module) {
      var $cur_module = this_editor.curModule();
      return $cur_module && $cur_module.element()[0] == $module.element()[0];
    };

    this.setCurModule = function($module) {
      if (!this.isCurModule($module)) {
        this.h.cur_module = $module;
        $('.selected-module').removeClass('selected-module');
        $module.element().addClass('selected-module');
        this.removeGlassControl();
      }
    };

    this.attachControl = function(key, $module) {
      $module = (typeof $module === 'undefined') ? this.curModule() : $module;

      var $control;
      switch(key) {
        case 'module_switch':
          $control = $('#glass-module-switcher').glassHtmlControl();
          break;
        case 'choose_module':
          $control = $('#glass-choose-module').glassHtmlControl();
          break;
        case 'settings_vid':
          $control = $('#glass-module-settings-vid').glassHtmlControl();
          break;
        case 'delete_btn':
          $control = $('#glass-parking .delete-module').clone().glassHtmlControl();
          break;
        default:
          $control = null;
      }

      var stack = this.h.control_stack;

      $control.attachToModule($module);

      if (key != 'module_switch' && key != 'delete_btn') {
        this.curModule().element().hide();
        // We have a stack for modules that replace the content
        if (stack.length > 0) {
          stack[stack.length - 1].element().hide();
        }
        stack.push($control);
      }
    };

    this.closeCurControl = function() {
      var stack = this.h.control_stack;

      if (stack.length > 0) {
        var $control = stack.pop();

        if (stack.length == 0) {
          $control.bringBackModule();
        }
        else {
          stack[stack.length - 1].element().fadeIn();
        }

        $control.detatchFromModule();
      }

      return (stack.length > 0);
    };

    this.removeGlassControl = function() {
      this.h.elem.find('.glass-control.singleton').each(function () {
        var $control = $(this).glassHtmlControl();
        $control.bringBackModule();
        $control.detatchFromModule();
      });
      this.h.control_stack = [];
    };

    this.formatHtml = function() {
      this.h.elem.find('[contenteditable=true]').removeAttr('contenteditable');
      this.removeGlassControl();
      this.h.elem.find('.glass-control').remove(); // All the delete btns and stuff
      return this.h.elem.html().trim();
    };

    this.getCurFocusModule = function() {
      var focus_elem = window.getSelection().focusNode;
      if (!focus_elem) { return null; }
      if (!this.isaModule($(focus_elem)) && $(focus_elem).prop("tagName") != 'P') {
        focus_elem = focus_elem.parentNode;
      }

      return this.parentModule($(focus_elem));
    };

    this.parentModule = function($elem) {
      var $parent_module = null;
      if ($elem.hasClass('glass-control') || $elem.parents('.glass-control').length > 0 || $elem.parents('.glass-edit').length == 0) {
        // It is within a control section, or is outside of the editor "chunk"
        return null;
      }

      var $parent_elem = $elem.parent().hasClass('glass-edit') ? $elem : $elem.parents('.glass-edit > *');

      if ($parent_elem) {
        $parent_module = $parent_elem.glassHtmlModule(this);
      }

      return $parent_module;
    };

    this.modules = function() {
      var modules = [];
      this.h.elem.children().each(function () {
        //if ($(this).parents('.glass-no-edit').length == 0) {
        if (!$(this).hasClass('glass-control')) {
          modules.push($(this).glassHtmlModule(this_editor));
        }
      });
      return modules;
    };

    this.isaModule = function($elem) {
      return $elem.glassIsaModule();
    };

    this.triggerChangeFocus = function ($elem, e) {
      var $module = $elem ? this.parentModule($elem) : this.getCurFocusModule();

      if (!$module) {
        return;
      }

      var newly_empty = false;
      var $cur_elem = $module.element();

      if (!this.isCurModule($module)) {
        this.setCurModule($module);

        if (!$cur_elem.text().trim()) { // Switching to an empty element
          newly_empty = true;
        }
      }

      if (e && (e.which == 8 || e.which == 46 || e.which == 13) && !$cur_elem.text().trim()) { // Just became empty (backspace or enter)
        newly_empty = true;
      }

      if (newly_empty) {
        $cur_elem.addClass('empty');
        this.attachControl('module_switch');
      }
      else if ($cur_elem.hasClass('empty') && $cur_elem.text().trim()) { // Not empty (but has the empty class)
        $cur_elem.removeClass('empty');
        this.removeGlassControl();
      }

      return $module;
    };


    // Initialization
    // ##########################################
    this.h.elem.attr('contenteditable', true);

    // modules() initializes them as well as returns them
    $.each(this.modules(), function (i, $module) {
      this_editor.triggerChangeFocus($module.element(), null);
    });

    this.h.elem.mouseup(function(e) {
      this_editor.triggerChangeFocus(null, e);
    });

    this.h.elem.keyup(function(e) {
      this_editor.triggerChangeFocus(null, e);
    });

    $(document).on('new-p', function () {
      this_editor.triggerChangeFocus(null, null);
    });

    $(document).on('image-uploaded', function (e, img_src) {
      var $img = this_editor.h.elem.find('.cur-uploading-img');
      if ($img.length > 0) {
        $img.attr('src', img_src);
        $img.removeClass('cur-uploading-img');
      }
    });

    grande.bind(document.querySelectorAll(".glass-edit-html"));
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
      //this.m.editor.setCurModule(this);
    };

    this.element = function() {
      return this.m.elem;
    };

    this.remove = function() {
      this.m.editor.removeGlassControl();
      this.m.elem.remove();
    };

    this.editor = function() {
      return this.m.editor;
    };

    this.createModuleAfter = function(module_id) {
      var $module_html = $('#glass-parking #' + module_id + '-template');
      if ($module_html.length > 0) {
        $module_html = $module_html.clone();
        $module_html.removeAttr('id'); //The id only stays on the one in the parking
      }
      else if (module_id == 'glass-module-p') {
        $module_html = $('<p />');
      }

      $module_html.insertAfter(this.element());
      this.editor().removeGlassControl();                   // Reset state
      return this.editor().triggerChangeFocus($module_html, null); // Creates a module & initializes it
    };

    // Initialization
    // ##########################################
    //this.focus();

    filterPasteEvents(this.m.elem[0]);

    if (this.element().find('img, iframe').length > 0 || this.element().hasClass('glass-no-edit')) {
      this.editor().attachControl('delete_btn', this);
    }
  }

  // #############################################################
  // # Control - actions on a module (change type, delete...)    #
  // #############################################################
  function GlassControl($elem) {
    var this_control = this;
    this.c = {'elem': $elem};

    this.attachToModule = function($module) {
      this.element().fadeIn();
      if (this.element().hasClass('delete-module')) {
        this.element().prependTo($module.element());
      }
      else {
        this.element().insertBefore($module.element());
      }
      this.c.module = $module;
      this.focus();
    }

    this.element = function() {
      return this.c.elem;
    };

    this.module = function() {
      return this.c.module;
    };

    this.detatchFromModule = function() {
      this.element().hide();
      this.c.module = null;
      if (this.element().hasClass('singleton')) {
        this.element().appendTo('#glass-parking');
        this.element().removeClass('glass-close rotate-45');
      }
      else {
        this.element().remove();
      }
    };

    this.bringBackModule = function() {
      if (this.module()) {
        this.module().element().fadeIn();
      }
    };

    this.focus = function() {
      var $autofocus = this.element().find('.glass-autofocus').first();
      if ($autofocus) {
        $autofocus.focus();
      }
    };

    if (this.element().attr('id') == 'glass-module-switcher') {
      this.element().click(function (e) {
        e.preventDefault();
        var editor = this_control.module().editor();

        if ($(this).hasClass('glass-close')) {
          if (!editor.closeCurControl()) {
            $(this).removeClass('glass-close rotate-45');
          }
        }
        else {
          $(this).addClass('glass-close rotate-45');
          editor.attachControl('choose_module');
        }
      });
    }

    this.element().find('#glass-choose-module-vid').click(function (e) {
      e.preventDefault();
      this_control.module().editor().attachControl('settings_vid');
    });

    this.element().find('#glass-choose-module-img').click(function (e) {
      e.preventDefault();
      GlassImageUploader.openFileInput();
    });

    if (this.element().attr('id') == 'glass-choose-module') {
      $(document).on('image-preview', function (e, image) {
        var $cur_module = this_control.module();
        if ($cur_module.length > 0) {
          var $new_module = $cur_module.createModuleAfter('glass-module-img');
          $new_module.element().find('img').attr('src', image);
          $new_module.element().find('img').addClass('cur-uploading-img');
          $cur_module.remove();
          var $new_p = $new_module.createModuleAfter('glass-module-p');
          // FIXME - this doesn't seem to want to focus()
          // FIXME: $new_p.element().attr('contenteditable', true);
          // FIXME: $new_p.element().focus();
        }
      });
    }

    if (this.element().hasClass('delete-module')) {
      this.element().click(function (e) {
        e.preventDefault();
        this_control.module().element().fadeOut(500, function() {
          this_control.module().remove();
        });
      });
    }

    this.element().find('#glass-add-vid-form').submit(function (e) {
      e.preventDefault();
      var $cur_module = this_control.module();
      var $new_module = $cur_module.createModuleAfter('glass-module-vid');
      $cur_module.element().remove();
      var $input_elem = this_control.element().find('.url-input');
      var vid_link = $input_elem.val();
      $input_elem.val('');
      var embed_url = vid_link; // The default, will be changed below
      $new_module.element().attr('data-video-link', vid_link); // Save for later use if needed (to edit??)
      var matches = vid_link.match(/(vimeo|youtube).com\/(.+)$/);

      if (matches && vid_link.search(/(?:youtube.+embed|player\.vimeo)/) == -1) {
        var vid_host = matches[1];
        var vid_path = matches[2];
        var vid_host_meta = {
          'youtube': ["//www.youtube.com/embed/",  "",              /[\?\&]v=(\w+)/],
          'vimeo'  : ["//player.vimeo.com/video/", "?color=8d69bf", /^(\w+)/],
        };
        var matches2 = vid_path.match(vid_host_meta[vid_host][2]);
        if (matches2) {
          embed_url = vid_host_meta[vid_host][0] + matches2[1] + vid_host_meta[vid_host][1];
        }
      }
      else if (vid_link.search(/^\/\//) == -1) {
        embed_url = "//" + vid_link.replace(/^https?:\/\//, '');
      }

      $new_module.element().find('iframe').attr('src', embed_url);
      var $new_p = $new_module.createModuleAfter('glass-module-p');
    });

    this.element().find('#glass-add-vid-btn').click(function (e) {
      // Insert
      var $vid_module = $('#glass-parking #glass-module-vid-template').clone();
      $vid_module.removeAttr('id'); //The id only stays on the one in the parking

      // Update link
      var vid_link = $('#glass-vid-url-input').val();
      $('#glass-vid-url-input').val('');

      var embed_url = vid_link; // The default, will be changed below
      $vid_module.attr('data-video-link', vid_link); // Save for later use if needed (to edit??)
      var matches = vid_link.match(/(vimeo|youtube).com\/(.+)$/);

      if (matches && vid_link.search(/(?:youtube.+embed|player\.vimeo)/) == -1) {
        var vid_host = matches[1];
        var vid_path = matches[2];
        var vid_host_meta = {
          'youtube': ["//www.youtube.com/embed/",  "",              /[\?\&]v=(\w+)/],
          'vimeo'  : ["//player.vimeo.com/video/", "?color=8d69bf", /^(\w+)/],
        };
        var matches2 = vid_path.match(vid_host_meta[vid_host][2]);
        if (matches2) {
          embed_url = vid_host_meta[vid_host][0] + matches2[1] + vid_host_meta[vid_host][1];
        }
      }
      else if (vid_link.search(/^\/\//) == -1) {
        embed_url = "//" + vid_link.replace(/^https?:\/\//, '');
      }

      $vid_module.find('iframe').attr('src', embed_url);

      this_control.module().element().replaceWith($vid_module);
      this_control.module().editor().removeGlassControl();
    });

    this.element().find('#glass-choose-custom').click(function (e) {
      e.preventDefault();
      var $cur_module = this_control.module();
      var $new_module = $cur_module.createModuleAfter('glass-module-custom');
      $cur_module.element().remove();
      var $new_p = $new_module.createModuleAfter('glass-module-p');
    });
  }

  $(document).on('content-ready', function (e, element) {
    var $container = $(element).find('#page-preview').length > 0 ? $(element).find('#page-preview') : $(element);

    if ($container.attr('id') != 'page-preview' && $container.parents('#page-preview').length < 1) {
      return;
    }

    var $glass_editables = $container.find('.glass-edit');

    var $form = null;
    var $prev_chunk = null;
    $glass_editables.each(function () {
      var $chunk  = $(this).glassChunk();
      $chunk.makeEditable();

      if ($chunk.getForm()) {
        $form = $chunk.getForm();
      }

      if ($prev_chunk) {
        $prev_chunk.tabTo($chunk);
      }
      $prev_chunk = $chunk;
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
