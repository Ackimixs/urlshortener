module R
  class RedirectController < ApplicationController
    def index
      url = Url.find_by(code: params[:code])
      if url
        redirect_to url.long_url, status: :moved_permanently, allow_other_host: true
      else
        render json: {body: {status: 'ERROR', message: 'Url not found', url: url.errors}}, status: :unprocessable_entity
      end
    end
  end
end