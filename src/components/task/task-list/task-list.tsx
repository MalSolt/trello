import { SortableContext } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { TaskItem } from '..'
import styles from './task-list.module.css'

interface Props {
  title: string
  tasks: string[]
}

export const TaskList = ({ title, tasks }: Props) => {
  const { setNodeRef } = useDroppable({ id: title })

  return (
    <article className={styles.column}>
      <h1>{title}</h1>
      <div className={styles.divider}></div>
      <SortableContext id={title} items={tasks}>
        <ul ref={setNodeRef} className={styles.list}>
          {tasks.map((task) => (
            <TaskItem key={task} title={task} />
          ))}
        </ul>
      </SortableContext>
    </article>
  )
}
