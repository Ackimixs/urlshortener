module Api
  class UrlController < ApplicationController
  
    def index
      url = Url.order('created_at ASC');
      render json: {body: {status: 'SUCCESS', message: 'Loaded urls', url: url}}, status: :ok
    end

    def show
      url = Url.find(params[:id])
      render json: {body: {status: 'SUCCESS', message: 'Loaded url', url: url}}, status: :ok
    end

    def create
      url = Url.new(url_params)
      if url.save
        render json: {body: {status: 'SUCCESS', message: 'Saved url', url: url}}, status: :ok
      else
        render json: {body: {status: 'ERROR', message: 'Url not saved', url: url.errors}}, status: :unprocessable_entity
      end
    end

    def destroy
      url = Url.find(params[:id])
      url.destroy
      render json: {body: {status: 'SUCCESS', message: 'Deleted url', url: url}}, status: :ok
    end

    def update
      url = Url.find(params[:id])
      if url.update(url_params)
        render json: {body: {status: 'SUCCESS', message: 'Updated url', url: url}}, status: :ok
      else
        render json: {body: {status: 'ERROR', message: 'Url not updated', url: url.errors}}, status: :unprocessable_entity
      end
    end


    private
    def url_params
      params.permit(:code, :long_url)
    end
  
  end
end