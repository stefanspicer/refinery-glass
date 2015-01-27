Refinery::Core::Engine.routes.draw do
  namespace :admin, :path => Refinery::Core.backend_route do
    get 'users/update-password', to: 'users#update_password', as: 'update_password'
  end
end


Refinery::Core::Engine.routes.prepend do
  #frontend routes
  namespace :glass, :path => '' do
    get 'accept-invitation', to: 'invitations#accept_invite', as: 'accept_invite'
  end
end

