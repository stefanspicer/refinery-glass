Refinery::User.class_eval do

  devise :database_authenticatable, :recoverable

  attr_accessor   :inviting_user, :site_url

	def name
		self.username
  end

  def confirmed?
    self.confirmed_on.present?
  end

end
