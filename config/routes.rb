TodoAngular::Application.routes.draw do
  devise_for :users

  scope '/api', constraints: { format: 'json' } do
    scope '/v1' do
		get '/completed_todo_items' => 'todo_items#completed'
		put '/completed_todo_items/:id' => 'todo_items#update'
		delete '/completed_todo_items/:id' => 'todo_items#destroy'
		resources :todo_items
    end
  end

  root :to => 'todo_items#home'
end
