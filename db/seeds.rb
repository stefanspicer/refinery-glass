Refinery::User.all do |u|
	unless u.confirmation_token.present? || u.confirmed_at.present?
		u.confirmed_at = Time.new
		u.save
	end
end