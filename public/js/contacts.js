// Gestion des contacts
class ContactsService {
  constructor() {
    this.contacts = []
    this.selectedContact = null
  }

  async loadContacts() {
    if (!window.authService.isLoggedIn()) return

    try {
      this.contacts = window.storageService.getContacts(window.authService.getCurrentUser().id)
      window.uiManager.renderContacts(this.contacts)
    } catch (error) {
      console.error("Erreur lors du chargement des contacts:", error)
    }
  }

  async addContact(name, phone) {
    if (!window.authService.isLoggedIn()) return false

    try {
      // Vérifier si le contact existe déjà
      const existingContact = this.contacts.find((c) => c.phone === phone)
      if (existingContact) {
        alert("Ce contact existe déjà!")
        return false
      }

      const contactData = {
        id: Date.now().toString(),
        userId: window.authService.getCurrentUser().id,
        name: name,
        phone: phone,
        createdAt: new Date().toISOString(),
      }

      const newContact = window.storageService.saveContact(contactData)
      if (newContact) {
        this.contacts.push(newContact)
        window.uiManager.renderContacts(this.contacts)
        return true
      }
      return false
    } catch (error) {
      console.error("Erreur lors de l'ajout du contact:", error)
      return false
    }
  }

  selectContact(contactId) {
    this.selectedContact = this.contacts.find((c) => c.id === contactId)
    if (this.selectedContact) {
      window.uiManager.showChatInterface(this.selectedContact)
      window.messagesService.loadMessages(this.selectedContact.id)
    }
  }

  getSelectedContact() {
    return this.selectedContact
  }

  getContactInitial(contact) {
    return contact.name.charAt(0).toUpperCase()
  }
}

// Instance globale
window.contactsService = new ContactsService()
