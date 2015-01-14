# This migration comes from refinery_glass (originally 20141230184917)
class AddRefineryPageIdentifier < ActiveRecord::Migration
  def change
    add_column :refinery_pages, :identifier, :string
  end
end
