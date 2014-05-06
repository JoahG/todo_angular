class TodoItemsController < ApplicationController
  before_filter :set_format, :except => :home

  def home
    respond_to do |format|
      format.html
    end
  end

  def index
    respond_to do |format|
      format.json { render json: authenticated_user.todo_items }
    end
  end

  def show
    if authenticated_user
      respond_to do |format|
        format.json { render json: authenticated_user.todo_items.find(params[:id]) }
      end
    else
      respond_to do |format|
        format.json { render json: [] }
      end
    end
  end

  def create
    @todo_item = TodoItem.new(params[:todo_item])
    @todo_item.user_id = authenticated_user.id
    respond_to do |format|
      if @todo_item.save
        format.json { render json: @todo_item }
      else
        format.json { render json: @todo_item.errors.full_messages }
      end
    end
  end

  def update
    @todo_item = authenticated_user.todo_items.find(params[:id])
    begin 
      @todo_item.due_date.to_datetime
    rescue
      @todo_item.due_date = Date.today
    end
    respond_to do |format|
      if @todo_item.update_attributes(params[:todo_item])
        format.json { render json: @todo_item }
      else
        format.json { render 'rejected_update' }
      end
     end
  end

  def destroy
    authenticated_user.todo_items.find(params[:id]).destroy
    respond_to do |format|
      format.json { render json: authenticated_user.todo_items }
    end
  end

  private

  def set_format
    request.format = :json
  end

  def authenticated_user
    user_email = params[:user_email].presence
    user       = user_email && User.find_by_email(user_email)
    if user && Devise.secure_compare(user.authentication_token, params[:auth_token])
      user
    else
      respond_to do |format|
        format.json { render :status => :unauthorized }
      end
    end
  end
end
