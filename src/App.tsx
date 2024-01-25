import { DndContext, DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import { useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import styles from './app.module.css'
import { TaskList } from './components/task/task-list/task-list'
import { TaskItemType } from './types'
import { nanoid } from 'nanoid'

interface TaskStateType {
  [key: string]: TaskItemType[]
}

const initialTaskState: TaskStateType = {
  Planned: [{ title: 'Task1', id: nanoid() }],
  Processed: [{ title: 'Task2', id: nanoid() }],
  Done: [{ title: 'Task3', id: nanoid() }],
}

function App() {
  const [taskState, setTaskState] = useState<TaskStateType>(initialTaskState)

  const handleDragEnd = (e: DragEndEvent) => {
    if (!e.over || !e.active.data.current || !e.over.data.current) return

    if (e.active.id === e.over.id) return

    if (e.active.data.current.sortable.containerId !== e.over.data.current.sortable.containerId)
      return

    const containerName = e.active.data.current.sortable.containerId

    setTaskState((taskState) => {
      const temp = { ...taskState }
      if (!e.over) return temp
      const oldIdx = temp[containerName].findIndex((task) => task.id === e.active.id.toString())
      const newIdx = temp[containerName].findIndex((task) => task.id === e.over!.id.toString())
      temp[containerName] = arrayMove(temp[containerName], oldIdx, newIdx)
      return temp
    })
  }

  const handleDragOver = (e: DragOverEvent) => {
    if (!e.over) return

    const initialContainer = e.active.data.current?.sortable?.containerId
    const targetContainer = e.over.data.current?.sortable?.containerId

    if (!initialContainer) return

    setTaskState((taskState) => {
      const temp = { ...taskState }
      const targetTask = temp[initialContainer].find((task) => task.id === e.active.id.toString())
      if (!targetTask) return temp

      if (!targetContainer) {
        if (taskState[e.over!.id].some((task) => task.id === e.active.id.toString())) return temp

        temp[initialContainer] = temp[initialContainer].filter((task) => task.id !== targetTask?.id)

        temp[e.over!.id].push(targetTask)

        return temp
      }

      if (initialContainer === targetContainer) {
        const oldIdx = temp[initialContainer].findIndex(
          (task) => task.id === e.active.id.toString()
        )
        const newIdx = temp[initialContainer].findIndex((task) => task.id === e.over!.id.toString())

        temp[initialContainer] = arrayMove(temp[initialContainer], oldIdx, newIdx)
      } else {
        temp[initialContainer] = temp[initialContainer].filter(
          (task) => task.id !== e.active.id.toString()
        )

        const newIdx = temp[targetContainer].findIndex((task) => task.id === e.over!.id.toString())
        temp[targetContainer].splice(newIdx, 0, targetTask)
      }

      return temp
    })
  }

  return (
    <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
      <main className={styles.main}>
        <h1>Multi Sortable List</h1>
        <section className={styles.container}>
          {Object.keys(taskState).map((key) => (
            <TaskList key={key} title={key} tasks={taskState[key]} />
          ))}
        </section>
      </main>
    </DndContext>
  )
}

export default App
