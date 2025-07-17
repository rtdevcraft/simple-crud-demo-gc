import { getTasks } from './actions'
import TaskManager from './components/TaskManager'

export default async function HomePage() {
  // Fetch the data on the server using the Server Action.
  const initialTasks = await getTasks()

  return (
    <main>
      <TaskManager initialTasks={initialTasks} />
    </main>
  )
}
