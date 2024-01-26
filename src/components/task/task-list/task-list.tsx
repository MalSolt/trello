import { SortableContext } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { TaskItem } from '..'
import styles from './task-list.module.css'
import { TaskListType } from 'types'

export const TaskList = ({ title, tasks }: TaskListType) => {
  const { setNodeRef } = useDroppable({ id: title })
  return (
    <article className={styles.column}>
      <h1>{title}</h1>
      <div className={styles.divider}></div>
      <SortableContext id={title} items={tasks}>
        <ul ref={setNodeRef} className={styles.list}>
          {tasks.map((task) => (
            <TaskItem key={task.id} {...task} />
          ))}
        </ul>
      </SortableContext>
    </article>
  )
}
