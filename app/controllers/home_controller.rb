class HomeController < ApplicationController
  def index
    render :file => 'public/index.html'
  end
end