// Simulation de JSON Server avec localStorage
class StorageService {
  constructor() {
    this.initializeData()
  }

  initializeData() {
    if (!localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify([]))
    }
    if (!localStorage.getItem("contacts")) {
      localStorage.setItem("contacts", JSON.stringify([]))
    }
    if (!localStorage.getItem("messages")) {
      localStorage.setItem("messages", JSON.stringify([]))
    }
  }

  // Users
  getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]")
  }

  saveUser(user) {
    const users = this.getUsers()
    const existingIndex = users.findIndex((u) => u.id === user.id)

    if (existingIndex >= 0) {
      users[existingIndex] = user
    } else {
      users.push(user)
    }

    localStorage.setItem("users", JSON.stringify(users))
    return user
  }

  // Contacts
  getContacts(userId) {
    const contacts = JSON.parse(localStorage.getItem("contacts") || "[]")
    return contacts.filter((contact) => contact.userId === userId)
  }

  saveContact(contact) {
    const contacts = JSON.parse(localStorage.getItem("contacts") || "[]")
    contacts.push(contact)
    localStorage.setItem("contacts", JSON.stringify(contacts))
    return contact
  }

  // Messages
  getMessages(userId, contactId) {
    const messages = JSON.parse(localStorage.getItem("messages") || "[]")
    return messages.filter((message) => message.userId === userId && message.contactId === contactId)
  }

  saveMessage(message) {
    const messages = JSON.parse(localStorage.getItem("messages") || "[]")
    messages.push(message)
    localStorage.setItem("messages", JSON.stringify(messages))
    return message
  }
}

// Instance globale
window.storageService = new StorageService()
