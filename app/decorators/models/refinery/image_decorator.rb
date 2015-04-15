Refinery::Image.class_eval do
  
  # @param [Symbol] use_case (:card, :page)
  # @return [String]
  def geometry_string(use_case)
    use_case = use_case.to_s
    aspect = self.image_width >= self.image_height ? :landscape : :portrait

    case use_case
      when 'card'
        geometry = aspect == :landscape ? 'x500' : '600x'
      when 'page'
        geometry = aspect == :landscape ? 'x1000' : '1400x'
      when 'cover'
        geometry = '1400x700#'
      when 'slideshow'
        geometry = '1500x500#ne'
      when 'h_sm'
        geometry = '300x200#'
      when 'h_md'
        geometry = '600x400#'
      when 'h_lg'
        geometry = '1200x800#'
      when 'v_sm'
        geometry = '200x300#'
      when 'v_md'
        geometry = '400x600#'
      when 'v_lg'
        geometry = '800x1200#'
      else
        geometry = aspect == :landscape ? 'x700' : '1000X'
    end
    return geometry
  end
end
