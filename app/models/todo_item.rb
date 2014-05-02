class TodoItem < ActiveRecord::Base
  attr_accessible :due_date, :priority, :title, :completed
  belongs_to :user

  validates :title, presence: true
  validates :priority, presence: true
  validates :due_date, presence: true
end
