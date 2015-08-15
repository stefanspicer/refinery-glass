require 'canvas/date_helper'
# Includes Canvas::DateHelper to make it available in ActionView::Base
class Railtie < Rails::Railtie
   initializer "canvas.date_helper" do
     ActionView::Base.send :include, Canvas::DateHelper
   end
 end