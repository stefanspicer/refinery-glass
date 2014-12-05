module Refinery
  class GlassGenerator < Rails::Generators::Base

    def rake_db
      rake "refinery_glass:install:migrations"
    end
  end
end
