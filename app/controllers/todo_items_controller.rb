class TodoItemsController < ApplicationController
  helper_method :sort_column, :sort_direction
  before_filter :set_format, :except => :home

  def home
    respond_to do |format|
      format.html
    end
  end

  def index
    respond_to do |format|
      format.json { render json: todo_items }
    end
  end

  def completed
    respond_to do |format|
      format.json { render json: completed_todo_items }
    end
  end

  def show
    respond_to do |format|
      format.json { render json: authenticated_user.todo_items.find(params[:id]) }
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
      format.json { render json: todo_items }
    end
  end

  private

  def set_format
    request.format = :json
  end

  def sort_column
    TodoItem.column_names.include?(params[:sort]) ? params[:sort] : "priority"
  end
  
  def sort_direction
    %w[asc desc].include?(params[:direction]) ? params[:direction] : "desc"
  end

  def todo_items
    if params[:show_completed] == 'true'
      authenticated_user.todo_items.order(sort_column + " " + sort_direction)
    else
      authenticated_user.todo_items.where(:completed => false).order(sort_column + " " + sort_direction)
    end
  end

  def completed_todo_items
    if params[:show_completed] == 'true'
      []
    else
      authenticated_user.todo_items.where(:completed => true).order(sort_column + " " + sort_direction)
    end
  end

  def authenticated_user
    user_email = params[:user_email].presence
    user       = user_email && User.find_by_email(user_email)
    if user && Devise.secure_compare(user.authentication_token, params[:auth_token])
      user
    end
  end
end
