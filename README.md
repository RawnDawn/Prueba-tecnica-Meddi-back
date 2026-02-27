# TODO

- CRUD of tasks
  - Mark tasks as done
  - filter tasks by prio
  - group tasks by prio
  - filter tasks by date
  - order tasks by date
  - seach tasks by name

- KPI
  - show in a chart the number of tasks per prio
  - show tasks by state
  - raking 3 days withe more created tasks
  - raking 3 dias of more completed tasks

# Constraints
- Task interface
  - _id
  - title
  - description
  - priority -> enum("low", "medium", "high")
  - created_at
  - due_date
  - state -> enum("pending", "done")
  
- Start app using /tasksManager
- Don't install any other package