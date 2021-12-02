import firebase from 'firebase'
import { Dispatch } from 'redux'

import { addMessage } from 'src/redux/slices/Messages'

import { TConversation } from 'src/types/Conversation'
import { TFamily } from 'src/types/Family'
import { TMessage } from 'src/types/Message'
import { TUser } from 'src/types/User'

export enum collecs {
  users = 'users',
  families = 'families',
  convs = 'conversations',
  messages = 'messages',
}

class API {
  public fireId: string
  public families: FamiliesController
  public convs: ConversationController
  public messages: MessageController
  public users: UsersController
  public gallery: GalleryController

  constructor() {
    this.families = new FamiliesController()
    this.convs = new ConversationController()
    this.messages = new MessageController()
    this.users = new UsersController()
    this.gallery = new GalleryController()
    this.fireId = firebase.auth().currentUser?.uid || ''
  }

  getUser() {
    return firebase.auth().currentUser
  }
}

export default API

class FamiliesController {
  async getFamilyById(id: string): Promise<TFamily | undefined> {
    const family = await firebase.firestore().collection(collecs.families).doc(id).get()
    const data = family.data()
    if (!data) return
    const members = data.members.map((m: firebase.firestore.DocumentReference) => m.id)
    return {
      id: family.id,
      code: data.code,
      name: data.name,
      members,
    } as TFamily
  }

  async getFamilyMembers(ids: string[], familyId: string): Promise<TUser[]> {
    const familyMembers: TUser[] = []
    for (let i = 0; i < ids.length; i++) {
      const m = await firebase.firestore().collection(collecs.users).doc(ids[i]).get()
      const data = m.data()
      if (!data) continue
      familyMembers.push({
        id: m.id,
        lastName: data.lastName,
        firstName: data.firstName,
        email: '',
        familyId: familyId,
        admin: data.admin,
        code: data.code,
      })
    }
    return familyMembers
  }

  async checkFamily(familyCode: string) {
    const families = await firebase
      .firestore()
      .collection(collecs.families)
      .where('code', '==', familyCode)
      .get()
    if (families.docs.length <= 0) return { exists: false }
    const family = families.docs[0]
    return {
      exists: true,
      code: family.get('code'),
      name: family.get('name'),
    }
  }

  async removeMember(member: TUser): Promise<void> {
    if (member.admin) return
    const memberRef = firebase.firestore().collection(collecs.users).doc(member.id)
    await memberRef.delete()
  }
}

class GalleryController {
  async uploadPicture(familyId: string, file: Blob) {
    const snap = await firebase.storage().ref(familyId).child(`images/${file}`).put(file)
    const url = await snap.ref.getDownloadURL()
    return url
  }

  async loadPictures(familyId: string) {
    const imagesRef = await firebase.storage().ref(familyId).child('images').listAll()
    const urls: string[] = []
    for (let i = 0; i < imagesRef.items.length; i++) {
      const item = imagesRef.items[i]
      const url = await item.getDownloadURL()
      urls.push(url)
    }
    return urls
  }
}

class ConversationController {
  async getConvs(userId: string): Promise<TConversation[]> {
    const userRef = await firebase.firestore().collection(collecs.users).doc(userId)
    const convsQuery = await firebase
      .firestore()
      .collection(collecs.convs)
      .where('members', 'array-contains', userRef)
      .get()
      const convs = convsQuery.docs.map((doc) => {
      const data = doc.data()
      const members = data.members.map((m: firebase.firestore.DocumentReference) => m.id)
      return {
        id: doc.id,
        members,
        name: data.name,
        lastReadId: data.lastReadId,
      } as TConversation
    })
    return convs
  }

  async createConv(conv: TConversation): Promise<TConversation> {
    const members = conv.members.map(mem => firebase.firestore().collection(collecs.users).doc(mem))
    const newConv = await firebase.firestore().collection(collecs.convs).add({
      members,
      name: conv.name,
      lastReadId: conv.lastReadId,
    })
    return {
      id: newConv.id,
      members: conv.members,
      name: conv.name,
      lastReadId: conv.lastReadId,
    } as TConversation
  }
}

class MessageController {
  async getMessagesInConv(convId: string): Promise<TMessage[]> {
    const convRef = firebase.firestore().collection(collecs.convs).doc(convId)
    const messageQuery = await firebase
      .firestore()
      .collection(collecs.messages)
      .where('conversation', '==', convRef)
      .get()
    const messages = messageQuery.docs.map((doc) => {
      const data = doc.data()
      if (data.conversation === undefined || data.sender === undefined)
        console.log('UNDEFINED', doc.id)
      return {
        id: doc.id,
        conversationId: data.conversation.id,
        content: data.content,
        read: data.read,
        date: data.createdAt.toDate().getTime(),
        senderId: data.sender.id,
      } as TMessage
    })
    return messages
  }

  registerListenerToConv(convId: string, dispatch: Dispatch<any>) {
    const convRef = firebase.firestore().collection(collecs.convs).doc(convId)
    const messagesQuery = firebase
      .firestore()
      .collection(collecs.messages)
      .where('conversation', '==', convRef)
    const subscriber = messagesQuery.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data()
          dispatch(
            addMessage({
              id: change.doc.id,
              conversationId: data.conversation.id,
              content: data.content,
              read: data.read,
              date: data.createdAt.toDate().getTime(),
              senderId: data.sender.id,
            })
          )
        }
      })
    })
    return subscriber
  }

  async sendMessage(message: TMessage): Promise<TMessage> {
    const senderRef = firebase.firestore().collection(collecs.users).doc(message.senderId)
    const convRef = firebase.firestore().collection(collecs.convs).doc(message.conversationId)
    const msg = await firebase
      .firestore()
      .collection(collecs.messages)
      .add({
        content: message.content,
        sender: senderRef,
        read: message.read,
        conversation: convRef,
        createdAt: firebase.firestore.Timestamp.fromDate(new Date(message.date)),
      })
    message.id = msg.id
    console.log('Sent Message ID', message.id)
    return message
  }
}

function randString(length: number) {
  var result = '';
  var characters = '0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

class UsersController {
  async createUser(firstname: string, lastname: string, familyCode: string): Promise<TUser> {
    const familySnap = await firebase
      .firestore()
      .collection(collecs.families)
      .where('code', '==', familyCode)
      .get()
    const familyId = familySnap.docs[0].id
    const code = randString(10)
    const user = await firebase.firestore().collection(collecs.users).add({
      code,
      firstname,
      lastname,
      familyId,
    })
    return {
      id: user.id,
      firstName: firstname,
      lastName: lastname,
      familyId,
      code,
    } as TUser
  }

  async getUserById(userId: string): Promise<TUser> {
    const user = await firebase.firestore().collection(collecs.users).doc(userId).get()
    const data = user.data()
    if (!data) return { id: '', email: '', firstName: '', lastName: '', familyId: '', code: '' }
    return {
      id: user.id,
      firstName: data.firstname,
      lastName: data.lastname,
      familyId: data.familyId,
      admin: data.admin,
      code: data.code,
      email: '',
    } as TUser
  }
}
