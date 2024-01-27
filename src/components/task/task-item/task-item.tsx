import { useSortable } from '@dnd-kit/sortable'
import styles from './task-item.module.css'
import { CSS } from '@dnd-kit/utilities'
import { TaskItemType } from 'types'

export const TaskItem = ({ title, id }: TaskItemType) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  return (
    <li
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={styles.item}
    >
      {title}
    </li>
  )
}
