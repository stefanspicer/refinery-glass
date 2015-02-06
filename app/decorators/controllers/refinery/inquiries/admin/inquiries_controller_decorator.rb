Refinery::Inquiries::Admin::InquiriesController.class_eval do

	def index
		if params[:search]
			@inquiries = Refinery::Inquiries::Inquiry.where("name LIKE '%#{params[:search]}%' OR message LIKE '%#{params[:search]}%'")
		else
			find_all_inquiries
		end

		paginate_all_inquiries

	end


end
