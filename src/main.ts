import "./style.css"
import { addTask, deleteTask, fetchAllTasks, initDb } from "./db.ts"
import { initPWA } from "./pwa.ts"

import type { TaskItem, TaskObject } from "./types"

/* eslint-disable @typescript-eslint/no-non-null-assertion */
const form: HTMLFormElement = document.querySelector("#newTaskForm")!
const tasksList = document.querySelector("#tasksList")!
/* eslint-disable @typescript-eslint/no-non-null-assertion */

const tasksObj: TaskObject = { tasks: [] }

const renderTasksList = (listObj: Element, tasks: TaskItem[]) => {
  listObj.replaceChildren(...[])
  if (tasks && tasks.length) {
    for (const task of tasks) {
      const listItem = document.createElement("li")
      const checkboxLabel = Object.assign(document.createElement("label"), {
        for: task.id,
        textContent: task.task,
      })
      const inputCheckbox = Object.assign(document.createElement("input"), {
        id: task.id,
        type: "checkbox",
      })
      const deleteButton = document.createElement("button")
      deleteButton.textContent = "Delete task"
      deleteButton.addEventListener("click", async () => {
        await deleteTask(task.id)
        listObj.dispatchEvent(
          new CustomEvent("deleteTask", { detail: task.id }),
        )
      })
      listItem.appendChild(inputCheckbox)
      listItem.appendChild(checkboxLabel)
      listItem.appendChild(deleteButton)
      listObj.appendChild(listItem)
    }
  }
}

window.onload = async () => {
  initPWA()
  const tasksProxy = new Proxy(tasksObj, {
    set(target: TaskObject, property: keyof TaskObject, value: TaskItem[]) {
      target[property] = value
      renderTasksList(tasksList, value)
      return true
    },
  })
  await initDb()
  tasksProxy.tasks = await fetchAllTasks()

  form.addEventListener("submit", async (inputDataEvent: SubmitEvent) => {
    inputDataEvent.preventDefault()

    const target = (inputDataEvent.target as HTMLFormElement)!
    Array.from(target.elements).forEach(async (formEl: Element) => {
      if (formEl.id === "newTask") {
        const taskInputElement = formEl as HTMLInputElement
        const taskInput = taskInputElement.value.trim()
        if (taskInput) {
          const taskId = await addTask(taskInput)
          taskInputElement.value = ""
          tasksProxy.tasks = [
            ...tasksProxy.tasks,
            {
              id: taskId,
              task: taskInput,
              isCompleted: false,
              date: new Date().toISOString(),
            },
          ]
        }
      }
    })
  })

  tasksList.addEventListener("deleteTask", (event: Event) => {
    tasksProxy.tasks = tasksProxy.tasks.filter(
      task => task.id !== (event as CustomEvent).detail,
    )
  })
}
