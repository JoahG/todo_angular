class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session, :if => Proc.new { |c| c.request.format == 'application/json' }
  before_filter :authenticate_user_from_token!
  before_filter :authenticate_user!
  before_filter :set_access_control_headers

  private
  
  def authenticate_user_from_token!
    user_email = params[:user_email].presence
    user       = user_email && User.find_by_email(user_email)
    if user && Devise.secure_compare(user.authentication_token, params[:auth_token])
      sign_in user, store: false
    end
  end

  def set_access_control_headers 
	headers['Access-Control-Allow-Origin'] = '*' 
	headers['Access-Control-Request-Method'] = '*' 
  end
end