Refinery::User.class_eval do

  devise :database_authenticatable, :recoverable

  attr_accessible :confirmed_at, :confirmation_token, :inviting_user, :confirmed_on
  attr_accessor   :inviting_user

  acts_as_indexed :fields => [:username, :email]

	def name
		self.username
	end
end
