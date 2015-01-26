module Refinery
  module Glass
    class Engine < Rails::Engine
      extend Refinery::Engine
      engine_name :refinery_glass

      before_inclusion do
        ::ApplicationController.send :helper, ::Glass::MiscHelper
        ::Refinery::AdminController.send :helper, ::Glass::MiscHelper
      end
    end
  end
end
