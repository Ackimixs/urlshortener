Rails.application.routes.draw do
  namespace :api do
    resources :url
  end

  namespace :r do
    get ':code', to: 'redirect#index'
  end
end
