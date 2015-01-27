module Refinery
  module Glass
    class Engine < Rails::Engine
      extend Refinery::Engine
      engine_name :refinery_glass

      config.after_initialize do
        Refinery.register_engine(Refinery::Glass)
      end

      before_inclusion do
        Refinery::Plugin.register do |plugin|
          plugin.pathname = root
          plugin.name = 'glass'
          plugin.hide_from_menu = true
          plugin.always_allow_access = true
          plugin.menu_match = /refinery\/(refinery_)?glass/
        end

        ::ApplicationController.send :helper, ::Glass::MiscHelper
        ::Refinery::AdminController.send :helper, ::Glass::MiscHelper
      end
    end
  end
end
