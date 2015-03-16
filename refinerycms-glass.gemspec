# Encoding: UTF-8

Gem::Specification.new do |s|
  s.platform          = Gem::Platform::RUBY
  s.name              = 'refinerycms-glass'
  s.version           = '1.0'
  s.authors           = 'Glass Canvas Media Inc'
  s.description       = 'A "Glass" theme for Refinery CMS'
  s.date              = '2014-07-08'
  s.summary           = 'A "Glass" theme for Refinery CMS'
  s.require_paths     = %w(lib)
  s.files             = Dir["{app,lib,vendor}/**/*"]

  # Runtime dependencies
  s.add_dependency             'refinerycms-core',     '~> 2.1.2'
  s.add_dependency             'refinerycms-settings', '~> 2.1.1'
  s.add_dependency             'momentjs-rails',       '>= 2.8.1'
  s.add_dependency             'bootstrap3-datetimepicker-rails', '~> 4.0.0'
end
