import './App.css'
import { useDraggable, useDroppable } from '@dnd-kit/core'

import { DndContext } from '@dnd-kit/core'
import { useState } from 'react'

function App() {
  const [isDropped, setIsDropped] = useState(false)
  const draggableMarkup = (
    <Draggable>
      <div className='drag_item'>Drag me</div>
    </Draggable>
  )

  function handleDragEnd(event: any) {
    if (event.over && event.over.id === 'droppable') {
      setIsDropped(true)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className='section'>
        <div className='draggable'>{isDropped ? null : draggableMarkup}</div>
        <div className='draggable'>
          <Droppable>{isDropped ? draggableMarkup : 'Drop here'}</Droppable>
        </div>
      </div>
    </DndContext>
  )
}

export default App

const Draggable = (props: any) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable',
  })
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  )
}

const Droppable = (props: any) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable',
  })
  const style = {
    color: isOver ? 'blue' : undefined,
  }

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  )
}
