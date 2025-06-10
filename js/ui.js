// Gestion de l'interface utilisateur
class UIManager {
  constructor() {
    this.initializeElements()
    this.bindEvents()
  }

  initializeElements() {
    // Pages
    this.loginPage = document.getElementById("loginPage")
    this.mainApp = document.getElementById("mainApp")

    // Formulaires
    this.loginForm = document.getElementById("loginForm")
    this.messageForm = document.getElementById("messageForm")
    this.addContactForm = document.getElementById("addContactForm")

    // Éléments d'interface
    this.contactsList = document.getElementById("contactsList")
    this.messagesList = document.getElementById("messagesList")
    this.messagesContainer = document.getElementById("messagesContainer")
    this.noContactSelected = document.getElementById("noContactSelected")
    this.chatHeader = document.getElementById("chatHeader")
    this.messageInput = document.getElementById("messageInput")

    // Modal
    this.addContactModal = document.getElementById("addContactModal")
  }

  bindEvents() {
    // Connexion
    this.loginForm.addEventListener("submit", this.handleLogin.bind(this))

    // Messages
    this.messageForm.addEventListener("submit", this.handleSendMessage.bind(this))

    // Contacts
    this.addContactForm.addEventListener("submit", this.handleAddContact.bind(this))
    document.getElementById("addContactBtn").addEventListener("click", this.showAddContactModal.bind(this))
    document.getElementById("cancelAddContact").addEventListener("click", this.hideAddContactModal.bind(this))

    // Déconnexion
    document.getElementById("logoutBtn").addEventListener("click", () => {
      window.authService.logout()
    })
  }

  async handleLogin(e) {
    e.preventDefault()
    const name = document.getElementById("userName").value.trim()
    const phone = document.getElementById("userPhone").value.trim()

    if (await window.authService.login(name, phone)) {
      this.showMainApp()
      await window.contactsService.loadContacts()
    } else {
      alert("Erreur de connexion. Veuillez réessayer.")
    }
  }

  async handleSendMessage(e) {
    e.preventDefault()
    const messageText = document.getElementById("messageText")
    const text = messageText.value.trim()

    if (await window.messagesService.sendMessage(text)) {
      messageText.value = ""
    }
  }

  async handleAddContact(e) {
    e.preventDefault()
    const name = document.getElementById("contactNameInput").value.trim()
    const phone = document.getElementById("contactPhoneInput").value.trim()

    if (await window.contactsService.addContact(name, phone)) {
      this.hideAddContactModal()
      document.getElementById("contactNameInput").value = ""
      document.getElementById("contactPhoneInput").value = ""
    }
  }

  showLoginPage() {
    this.loginPage.classList.remove("hidden")
    this.mainApp.classList.add("hidden")
  }

  showMainApp() {
    this.loginPage.classList.add("hidden")
    this.mainApp.classList.remove("hidden")

    const user = window.authService.getCurrentUser()
    document.getElementById("currentUserName").textContent = user.name
    document.getElementById("userInitial").textContent = window.authService.getUserInitial()
  }

  showAddContactModal() {
    this.addContactModal.classList.remove("hidden")
  }

  hideAddContactModal() {
    this.addContactModal.classList.add("hidden")
  }

  showChatInterface(contact) {
    this.noContactSelected.classList.add("hidden")
    this.chatHeader.classList.remove("hidden")
    this.messageInput.classList.remove("hidden")
    this.messagesList.classList.remove("hidden")

    document.getElementById("contactName").textContent = contact.name
    document.getElementById("contactPhone").textContent = contact.phone
    document.getElementById("contactInitial").textContent = window.contactsService.getContactInitial(contact)
  }

  renderContacts(contacts) {
    this.contactsList.innerHTML = ""

    contacts.forEach((contact) => {
      const contactElement = document.createElement("div")
      contactElement.className = "p-4 hover:bg-gray-50 cursor-pointer flex items-center"
      contactElement.onclick = () => window.contactsService.selectContact(contact.id)

      contactElement.innerHTML = `
        <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
          ${window.contactsService.getContactInitial(contact)}
        </div>
        <div class="flex-1">
          <div class="font-semibold">${contact.name}</div>
          <div class="text-sm text-gray-500">${contact.phone}</div>
        </div>
      `

      this.contactsList.appendChild(contactElement)
    })
  }

  renderMessages(messages) {
    this.messagesList.innerHTML = ""

    messages.forEach((message) => {
      const messageElement = document.createElement("div")
      const isFromUser = message.isFromUser

      messageElement.className = `flex ${isFromUser ? "justify-end" : "justify-start"} mb-2`

      messageElement.innerHTML = `
        <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isFromUser ? "bg-green-500 text-white" : "bg-white text-gray-800 border"
        }">
          <div class="text-sm">${message.text}</div>
          <div class="text-xs mt-1 ${isFromUser ? "text-green-100" : "text-gray-500"}">
            ${window.messagesService.formatTime(message.timestamp)}
          </div>
        </div>
      `

      this.messagesList.appendChild(messageElement)
    })

    // Faire défiler vers le bas
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight
  }
}

// Instance globale
window.uiManager = new UIManager()
