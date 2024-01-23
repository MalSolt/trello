import { DndContext, DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import { useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import styles from './app.module.css'
import { TaskList } from './components/task/task-list/task-list'

interface ITaskList {
  [key: string]: string[]
}

function App() {
  const [taskList, setTaskList] = useState<ITaskList>({
    Planned: ['Task1', 'Task2', 'Task3'],
    Processed: ['Task4'],
    Done: ['Task5', 'Task6']
  })

  const handleDragEnd = (e: DragEndEvent) => {
    if (!e.over || !e.active.data.current || !e.over.data.current) return

    if (e.active.id === e.over.id) return

    if (e.active.data.current.sortable.containerId !== e.over.data.current.sortable.containerId)
      return

    const containerName = e.active.data.current.sortable.containerId

    setTaskList((taskList) => {
      const temp = { ...taskList }
      if (!e.over) return temp
      const oldIdx = temp[containerName].indexOf(e.active.id.toString())
      const newIdx = temp[containerName].indexOf(e.over.id.toString())
      temp[containerName] = arrayMove(temp[containerName], oldIdx, newIdx)
      return temp
    })
  }

  const handleDragOver = (e: DragOverEvent) => {
    if (!e.over) return

    const initialContainer = e.active.data.current?.sortable?.containerId
    const targetContainer = e.over.data.current?.sortable?.containerId

    if (!initialContainer) return

    setTaskList((taskList) => {
      const temp = { ...taskList }

      if (!targetContainer) {
        if (taskList[e.over!.id].includes(e.active.id.toString())) return temp

        temp[initialContainer] = temp[initialContainer].filter(
          (task) => task !== e.active.id.toString()
        )

        temp[e.over!.id].push(e.active.id.toString())

        return temp
      }

      if (initialContainer === targetContainer) {
        const oldIdx = temp[initialContainer].indexOf(e.active.id.toString())
        const newIdx = temp[initialContainer].indexOf(e.over!.id.toString())

        temp[initialContainer] = arrayMove(temp[initialContainer], oldIdx, newIdx)
      } else {
        temp[initialContainer] = temp[initialContainer].filter(
          (task) => task !== e.active.id.toString()
        )

        const newIdx = temp[targetContainer].indexOf(e.over!.id.toString())
        temp[targetContainer].splice(newIdx, 0, e.active.id.toString())
      }

      return temp
    })
  }

  return (
    <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
      <main className={styles.main}>
        <h1>Multi Sortable List</h1>
        <section className={styles.container}>
          {Object.keys(taskList).map((key) => (
            <TaskList key={key} title={key} tasks={taskList[key]} />
          ))}
        </section>
      </main>
    </DndContext>
  )
}

export default App
