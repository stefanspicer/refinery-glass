Refinery::User.class_eval do

  devise :database_authenticatable, :confirmable

  attr_accessible :org_id, :confirmed_at, :confirmation_token

end
