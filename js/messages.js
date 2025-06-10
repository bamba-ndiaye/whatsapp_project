// Gestion des messages
class MessagesService {
  constructor() {
    this.messages = []
    this.currentContactId = null
  }

  async loadMessages(contactId) {
    if (!window.authService.isLoggedIn() || !contactId) return

    try {
      this.currentContactId = contactId
      this.messages = window.storageService.getMessages(window.authService.getCurrentUser().id, contactId)
      window.uiManager.renderMessages(this.messages)
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error)
    }
  }

  async sendMessage(text) {
    if (!window.authService.isLoggedIn() || !this.currentContactId || !text.trim()) {
      return false
    }

    try {
      const messageData = {
        id: Date.now().toString(),
        userId: window.authService.getCurrentUser().id,
        contactId: this.currentContactId,
        text: text.trim(),
        timestamp: new Date().toISOString(),
        isFromUser: true,
      }

      const newMessage = window.storageService.saveMessage(messageData)
      if (newMessage) {
        this.messages.push(newMessage)
        window.uiManager.renderMessages(this.messages)

        // Simuler une réponse automatique
        setTimeout(
          () => {
            this.simulateResponse()
          },
          1000 + Math.random() * 2000,
        )

        return true
      }
      return false
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error)
      return false
    }
  }

  async simulateResponse() {
    const responses = [
      "Salut ! Comment ça va ?",
      "Merci pour ton message !",
      "Je suis occupé en ce moment, je te réponds plus tard.",
      "👍",
      "D'accord !",
      "Parfait !",
      "À bientôt !",
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    const responseData = {
      id: (Date.now() + 1).toString(),
      userId: window.authService.getCurrentUser().id,
      contactId: this.currentContactId,
      text: randomResponse,
      timestamp: new Date().toISOString(),
      isFromUser: false,
    }

    const response = window.storageService.saveMessage(responseData)
    if (response) {
      this.messages.push(response)
      window.uiManager.renderMessages(this.messages)
    }
  }

  formatTime(timestamp) {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }
}

// Instance globale
window.messagesService = new MessagesService()
