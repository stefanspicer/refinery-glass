require 'refinerycms-core'
require 'refinerycms-settings'
require 'refinery/glass/plugin_sorter'

module Refinery
  module Glass
    require 'refinery/glass/engine'

    class << self

      attr_writer :root
      attr_writer :tabs

      def root
        @root ||= Pathname.new(File.expand_path('../../../', __FILE__))
      end
    end
  end
end

require 'decorators'
