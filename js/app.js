// Point d'entrée principal de l'application
class App {
  constructor() {
    this.init()
  }

  async init() {
    // Attendre que tous les services soient chargés
    await this.waitForServices()

    // Vérifier si l'utilisateur est déjà connecté
    if (window.authService.isLoggedIn()) {
      window.uiManager.showMainApp()
      await window.contactsService.loadContacts()
    } else {
      window.uiManager.showLoginPage()
    }

    console.log("Application initialisée avec succès!")
  }

  async waitForServices() {
    // Attendre que tous les services soient disponibles
    while (
      !window.storageService ||
      !window.authService ||
      !window.contactsService ||
      !window.messagesService ||
      !window.uiManager
    ) {
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
  }
}

// Initialiser l'application quand le DOM est prêt
document.addEventListener("DOMContentLoaded", () => {
  new App()
})
