// Gestion de l'authentification
class AuthService {
  constructor() {
    this.currentUser = null
    this.loadCurrentUser()
  }

  async login(name, phone) {
    try {
      // Vérifier si l'utilisateur existe déjà
      const users = window.storageService.getUsers()
      let user = users.find((u) => u.phone === phone)

      if (!user) {
        // Créer un nouvel utilisateur
        user = {
          id: Date.now().toString(),
          name: name,
          phone: phone,
          createdAt: new Date().toISOString(),
        }
        window.storageService.saveUser(user)
      } else {
        // Mettre à jour le nom si nécessaire
        if (user.name !== name) {
          user.name = name
          window.storageService.saveUser(user)
        }
      }

      this.currentUser = user
      this.saveCurrentUser()
      return true
    } catch (error) {
      console.error("Erreur de connexion:", error)
      return false
    }
  }

  logout() {
    this.currentUser = null
    localStorage.removeItem("currentUser")
    window.uiManager.showLoginPage()
  }

  getCurrentUser() {
    return this.currentUser
  }

  isLoggedIn() {
    return this.currentUser !== null
  }

  saveCurrentUser() {
    if (this.currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(this.currentUser))
    }
  }

  loadCurrentUser() {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      this.currentUser = JSON.parse(userData)
    }
  }

  getUserInitial() {
    return this.currentUser ? this.currentUser.name.charAt(0).toUpperCase() : ""
  }
}

// Instance globale
window.authService = new AuthService()
