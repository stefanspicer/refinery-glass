::Refinery::PagePart.class_eval do
  protected
    def normalise_text_fields
      # We have some parts now that are straight text (like a subtitle with an <h4>)
      #  - We don't want the <p> tags injected there
    end
end

