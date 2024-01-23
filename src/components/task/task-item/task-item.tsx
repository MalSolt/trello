import { useSortable } from '@dnd-kit/sortable'
import styles from './task-item.module.css'
import { CSS } from '@dnd-kit/utilities'

interface Props {
  title: string
}

export const TaskItem = ({ title }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: title })

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
