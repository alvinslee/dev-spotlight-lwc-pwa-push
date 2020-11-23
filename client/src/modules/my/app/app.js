import LightningElementWithSLDS from '../../LightningElementWithSLDS'
const SERVER_ENDPOINT = process.env.SERVER_ENDPOINT || 'https://lwc-pwa-server.herokuapp.com'

export default class App extends LightningElementWithSLDS {
  swRegistration = null
  subscription = null
  vapidKey = null

  connectedCallback() {
    this.init()
  }

  async init() {
    try {
      this.swRegistration = await navigator.serviceWorker.getRegistration()
      this.subscription = await this.swRegistration.pushManager.getSubscription()
      console.log('SUBSCRIPTION', this.subscription)
      this.setOptionsState()
      this.vapidKey = await this.getVapidKey()
    } catch (error) {
      console.log(error)
    }
  }

  async getVapidKey() {
    const result = await fetch(`${SERVER_ENDPOINT}/vapidPublicKey`)
    return result.text()
  }

  async handleSubscribeToggle () {
    if (this.subscription) {
      await this.unsubscribe()
    } else {
      await this.subscribe()
    }
    this.setOptionsState()
  }

  async subscribe() {
    if (this.subscription) {
      console.log('Already subscribed')
      return
    }
    this.subscription = await this.swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.vapidKey
    })
    try {
      const requestBody = {
        subscription: this.subscription,
        pushType: this.notificationType().value,
        duration: this.notificationDuration().value
      }
      const result = await fetch(`${SERVER_ENDPOINT}/subscribe`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(requestBody)
      })
      console.log(requestBody, await result.text(), this.subscription)
    } catch (err) {
      console.log(err)
    }
  }

  async unsubscribe() {
    if (!this.subscription) {
      console.warn('No subscription found. Nothing to unsubscribe')
      return
    }
    try {
      const result = await fetch(`${SERVER_ENDPOINT}/unsubscribe`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          subscription: this.subscription
        })
      })
      await this.subscription.unsubscribe()
      this.subscription = null
      console.log(await result.text())
    } catch (err) {
      console.log(err)
    }
  }

  setOptionsState () {
    if (this.subscription) {
      this.notificationType().disable()
      this.notificationDuration().disable()
    } else {
      this.setOptionDefaultsIfUnset()
      this.notificationType().enable()
      this.notificationDuration().enable()
    }
  }

  setOptionDefaultsIfUnset () {
    console.log('type?', typeof this.notificationType().value)
    if (typeof this.notificationType().value !== 'string') {
      this.notificationType().setValue('iss')
    }
    console.log('duration?', typeof this.notificationDuration().value)
    if (typeof this.notificationDuration().value !== 'string') {
      this.notificationDuration().setValue('30')
    }
  }

  notificationType () {
    return this.template.querySelector('my-notification-type')
  }

  notificationDuration () {
    return this.template.querySelector('my-notification-duration')
  }

  get isSubscribed () {
    return (this.subscription !== null)
  }
}
