import firebase from 'firebase'

import { TFamily } from "../types/Family"
import { TConversation } from "../types/Conversation"
import { TMessage } from "../types/Message"
import { TUser } from "../types/User"

export enum collecs {
  users = 'users',
  families = 'families',
  convs = 'conversations',
  messages = 'messages'
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
      members
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
        familyId: familyId
      })
    }
    return familyMembers
  }

  async checkFamily(familyCode: string) {
    const families = await firebase.firestore().collection(collecs.families).where('code', '==', familyCode).get()
    if (families.docs.length <= 0)
      return { exists: false }
    const family = families.docs[0]
    return {
      exists: true,
      code: family.get('code'),
      name: family.get('name')
    }
  }

  async removeMember(member: TUser): Promise<void> {
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
    const convsQuery = await firebase.firestore().collection(collecs.convs).where('members', 'array-contains', userId).get()
    const convs = convsQuery.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        members: data.members,
        name: data.name,
        lastReadId: data.lastReadId
      } as TConversation
    })
    return convs
  }

  async createConv(members: string[], name: string): Promise<TConversation> {
    const conv = await firebase.firestore().collection(collecs.convs).add({
      members,
      name,
      lastReadId: ''
    })
    return {
      id: conv.id,
      members,
      name,
      lastReadId: ''
    } as TConversation
  }
}

class MessageController {
  async getMessagesInConv(convId: string): Promise<TMessage[]> {
    const messageQuery = await firebase.firestore().collection(collecs.convs).doc(convId).collection(collecs.messages).get()
    const messages = messageQuery.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        conversationId: data.conversationId,
        content: data.content,
        read: data.read,
        date: data.date.toDate().getTime(),
        senderId: data.senderId
      } as TMessage
    })
    return messages
  }

  async sendMessage(convId: string, message: TMessage): Promise<TMessage> {
    const msg = await firebase.firestore().collection(collecs.convs).doc(convId).collection(collecs.messages).add({
      content: message.content,
      senderId: message.senderId,
      read: message.read,
      conversationId: message.conversationId,
      date: firebase.firestore.Timestamp.fromDate(new Date(message.date))
    })
    message.id = msg.id
    return message
  }
}

class UsersController {
  async createUser(firstname: string, lastname: string, familyCode: string): Promise<TUser> {
    const familySnap = await firebase.firestore().collection(collecs.families).where('code', '==', familyCode).get()
    const familyId = familySnap.docs[0].id
    const user = await firebase.firestore().collection(collecs.users).add({
      firstname,
      lastname,
      familyId
    })
    return {
      id: user.id,
      firstName: firstname,
      lastName: lastname,
      familyId
    } as TUser
  }

  async getUserById(userId: string): Promise<TUser> {
    const user = await firebase.firestore().collection(collecs.users).doc(userId).get()
    const data = user.data()
    if (!data) return { id: '', email: '', firstName: '', lastName: '', familyId: '' }
    return {
      id: user.id,
      firstName: data.firstname,
      lastName: data.lastname,
      familyId: data.familyId,
      email: ''
    } as TUser
  }
}