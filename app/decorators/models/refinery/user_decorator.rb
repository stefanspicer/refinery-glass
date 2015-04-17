Refinery::User.class_eval do

  devise :database_authenticatable, :recoverable

  attr_accessor   :inviting_user

	def name
		self.username
  end

  def confirmed?
    self.confirmed_on.present?
  end

  def super_user?
    has_role?(:superuser)
  end
end
