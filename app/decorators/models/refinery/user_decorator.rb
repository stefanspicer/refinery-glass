Refinery::User.class_eval do

  devise :database_authenticatable, :recoverable

  attr_accessor   :inviting_user
                  # NOT in use (JK) :confirm_path, :confirm_url

  acts_as_indexed :fields => [:username, :email]

	def name
		self.username
  end

  def confirmed?
    self.confirmed_on.present?
  end

end
