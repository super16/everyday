import type { TaskItem } from "./types"

const DB_NAME = "everyday"
const DB_VERSION = 1
const DB_TABLE_NAME = "tasks"

export function initDb(): Promise<void> {
  return new Promise((resolve) => {
    const dbRequest = indexedDB.open(DB_NAME, DB_VERSION)
    dbRequest.onupgradeneeded = function (event) {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(DB_TABLE_NAME)) {
        const tasksTable = db.createObjectStore(DB_TABLE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        })
        tasksTable.createIndex("task", "task", { unique: false })
        tasksTable.createIndex("isCompleted", "isCompleted", { unique: false })
        tasksTable.createIndex("date", "date", { unique: false })
      }
    }
    resolve()
  })
}

export const fetchAllTasks = (): Promise<TaskItem[]> => {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open(DB_NAME, DB_VERSION)
    dbRequest.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      const transaction = db.transaction([DB_TABLE_NAME], "readonly")
      const storageObject = transaction.objectStore(DB_TABLE_NAME)
      const myIndex = storageObject.index("task")
      const getAllRequest = myIndex.getAll()
      transaction.oncomplete = () => {
        return resolve(getAllRequest.result)
      }

      getAllRequest.onerror = () => {
        console.error("Get tasks error:", getAllRequest.error)
        return reject()
      }
    }

    dbRequest.onerror = () => {
      console.error("Get tasks error:", dbRequest.error)
      return reject()
    }
  })
}

export const addTask = (task: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open(DB_NAME, DB_VERSION)
    dbRequest.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      const transaction = db.transaction([DB_TABLE_NAME], "readwrite")
      const storageObject = transaction.objectStore(DB_TABLE_NAME)
      const insertQuery = storageObject.add({
        task,
        isCompleted: false,
        date: new Date().toISOString(),
      })
      insertQuery.onsuccess = (event) => {
        const { result } = event.target as IDBOpenDBRequest
        return resolve(result as unknown as number)
      }

      insertQuery.onerror = () => {
        return reject()
      }
    }
  })
}

export const deleteTask = (taskId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open(DB_NAME, DB_VERSION)
    dbRequest.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      const transaction = db.transaction([DB_TABLE_NAME], "readwrite")
      const storageObject = transaction.objectStore(DB_TABLE_NAME)
      const deleteQuery = storageObject.delete(taskId)
      deleteQuery.onsuccess = () => {
        return resolve()
      }
      deleteQuery.onerror = () => {
        return reject()
      }
    }
  })
}

export const updateTaskState = (
  checked: boolean,
  task: TaskItem,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open(DB_NAME, DB_VERSION)
    dbRequest.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      const transaction = db.transaction([DB_TABLE_NAME], "readwrite")
      const storageObject = transaction.objectStore(DB_TABLE_NAME)
      const updateQuery = storageObject.put({
        id: task.id,
        task: task.task,
        isCompleted: checked,
        date: task.date,
      })
      updateQuery.onsuccess = () => {
        return resolve()
      }
      updateQuery.onerror = () => {
        return reject()
      }
    }
  })
}
