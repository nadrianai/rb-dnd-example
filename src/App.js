import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import React, {useState} from 'react';
import { v4 as uuidv4 } from 'uuid';

const itemsFromBackend = [
  { id: uuidv4(), content: 'Buy Christmas Presents'},
  { id: uuidv4(), content: 'Decorate tree'},
  { id: uuidv4(), content: 'Make Christmas Dinner'},
  { id: uuidv4(), content: 'Make Christmas Cake'},
  { id: uuidv4(), content: 'Sing  carols'},
  { id: uuidv4(), content: 'Write postcards'}


]

const columnsFromBckend = 
  {
    [uuidv4()]:{
      name:"To Do",
      items:itemsFromBackend
    }, 
    [uuidv4()]:{
      name:"In Progress",
      items:[]
    }, 
    [uuidv4()]:{
      name:"Completed",
      items:[]
    }

  }

const handleDragEnd = (result, columns, setColumns) => {
  if(!result.destination) return
  const {source, destination} = result

  if(source.droppableId !== destination.droppableId){
    const sourceColumn = columns[source.droppableId]
    const destColumn = columns[destination.droppableId]
    const sourceItems = [...sourceColumn.items]
    const destItems = [...destColumn.items]
    const [removed] = sourceItems.splice(source.index, 1)
    destItems.splice(destination.index, 0, removed)
    setColumns({
      ...columns, 
      [source.droppableId]:{
        ...sourceColumn, 
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    })




  }else{
    const column  = columns[source.droppableId]
    const copiedItems = [...column.items]
    const [removed] = copiedItems.splice(source.index, 1)
    copiedItems.splice(destination.index, 0 , removed)
    setColumns({
      ...columns,
      [source.droppableId]:{
        ...column,
        items:copiedItems
      }
    })
  }
  



}

function App() {
  const [columns, setColumns] = useState(columnsFromBckend)
  
  return (
    <div 
      className="container mt-5"
      style={{
        "display":"flex",
        "justifyContent":"center",
        "height":"100%"
      }}
    >
      
      <DragDropContext onDragEnd = { (result)=> handleDragEnd(result, columns, setColumns)}>
        { Object.entries(columns).map(([id, column])=> {
          return (
            <div className='m-3' key={id}>
              <h5 className='text-center'>{column.name}</h5>
              <Droppable droppableId={id} key={id}>
                {(provided, snapshot) => {
                  return (
                    <div { ...provided.droppableProps}
                        ref = {provided.innerRef}
                        style={{
                          "background": snapshot.isDraggingOver ? "lightblue" : 'lightgrey',
                          "padding":"4px",
                          "width":"250px",
                          "minHeight":"500px"
                        }}
                      >
                      {
                        column.items.map((item, index) => {
                          return (
                            <Draggable key={item.id} draggableId={item.id} index= {index}>
                              {(provided, snapshot) => {
                                return(
                                  <div
                                  ref = {provided.innerRef}
                                  { ...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style ={{
                                    userSelect:"none",
                                    "padding":"16px",
                                    "margin":"0 0 8px 0",
                                    "minHeight":"50px",
                                    "backgroundColor": snapshot.isDragging ? '#263b4a' : '#456cb6',
                                    "color": 'white',
                                    ...provided.draggableProps.style
                                  }}
                                  >
                                    {`${index}. ${item.content}`}
                                  </div>
                                )
                              }}
                            </Draggable>
                          )
                        })
                      }
                      </div>
                  )
                }}
              </Droppable>
            </div>
           
          )
        })}

      </DragDropContext>

    </div>
  );
}

export default App;
