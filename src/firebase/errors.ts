export function getFirebaseError(code: string | undefined) {
  if (!code)
    return 'Une erreur est survenue...'
  switch(code) {
    case 'auth/email-already-in-use':
      return 'Cet email est déjà utilisé'
    case 'auth/email-already-exists':
      return 'Cet email est déjà utilisé'
    case 'auth/invalid-email':
      return 'L\'adresse email n\'est pas valide'
    case 'auth/invalid-password':
      return 'Le mot de passe n\'est pas valide. Il doit faire 6 charactères minimum'
    case 'auth/user-not-found':
      return 'Ce compte n\'existe pas. Vous avez peut être été retiré de votre famille.'
    case 'auth/wrong-password':
      return 'Le mot de passe est erroné'
    default:
      console.warn('UNKNOW ERROR CODE:', code)
      return 'Une erreur est survenue...'
  }
}