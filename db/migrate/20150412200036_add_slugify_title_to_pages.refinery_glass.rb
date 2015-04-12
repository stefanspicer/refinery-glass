# This migration comes from refinery_glass (originally 20150330134420)
class AddSlugifyTitleToPages < ActiveRecord::Migration
  def change
    add_column :refinery_pages, :slugify_title, :boolean, :default => true
  end
end
