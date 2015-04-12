# This migration comes from refinery_glass (originally 20150130204501)
class AddConfirmableToDeviseForUsers < ActiveRecord::Migration
  def change
    change_table(:refinery_users) do |t|
      t.string   :confirmation_token
      t.datetime :confirmed_at
      t.datetime :confirmation_sent_at
      t.string   :unconfirmed_email
    end
    add_index  :refinery_users, :confirmation_token, :unique => true
  end
end
