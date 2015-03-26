class AddConfirmedOn < ActiveRecord::Migration
  def up
    # add confirmed_on field
    rename_column :refinery_users, :confirmed_at, :confirmed_on
    remove_column :refinery_users, :confirmation_token
    remove_column :refinery_users, :confirmation_sent_at
    remove_column :refinery_users, :unconfirmed_email
  end

  def down
    rename_column :refinery_users, :confirmed_on, :confirmed_at
    add_column :refinery_users, :confirmation_token
    add_column :refinery_users, :confirmation_sent_at
    add_column :refinery_users, :unconfirmed_email
  end
end