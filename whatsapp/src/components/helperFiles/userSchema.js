export class User {
  constructor(uid, username, url) {
    this.data = {
      uid: `${uid}`,
      username: `${username}`,
      url: `${url}`,
      status_pics_list: {},
      contact: {},
      archieved: {},
      status: "Hey there! I am using WhatsApp.",
      online: true,
      settings: { backgroundColor: "beige" },
    };
  }
}
