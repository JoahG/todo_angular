class CreateTodoItems < ActiveRecord::Migration
  def change
    create_table :todo_items do |t|
      t.string :title
      t.integer :priority
      t.datetime :due_date
      t.integer :user_id
      t.boolean :completed, :default => false

      t.timestamps
    end
  end
end
