import firebase from 'firebase'

export function registerNotifToken() {
  firebase
    .messaging()
    .getToken({
      vapidKey:
        'BAqnVgBE6zpqitj8JAZugVwQvwI5wvA4TCXZliUHBu0vhDvJ1ym70S83pv8Hs82cXvuYVymFg-VaMQM7h0OBxpI',
    }).catch(err => {
      console.error(err)
    }).then((token) => {
      console.log('Sent to channel:', token)
      if (token) {
        localStorage.setItem('__notifToken', token)
        
      }
    })
}