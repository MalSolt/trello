import { DndContext, DragOverEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { TaskList } from 'components/task/task-list/task-list'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { TaskItemType } from 'types'
import styles from './app.module.css'

interface TaskStateType {
  [key: string]: TaskItemType[]
}

const initialTaskState: TaskStateType = {
  Planned: [{ title: 'Task1', id: nanoid() }],
  Processed: [{ title: 'Task2', id: nanoid() }],
  Done: [
    { title: 'Task3', id: nanoid() },
    { title: 'Task4', id: nanoid() },
  ],
}

export const App = () => {
  const [taskState, setTaskState] = useState<TaskStateType>(initialTaskState)

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
    <DndContext onDragOver={handleDragOver}>
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
