// import admin from "firebase";
class message {
  constructor(type, user, replying) {
    this.general = {
      createdBy: user,
      readRecipient: "delivered",
      deletedBy: {},
      //   time: admin.firestore.Timestamp.now(),
      reply: replying,
      seenBy: [],
      type,
    };
  }
}
export class Text extends message {
  constructor(user, replying, message) {
    super("text", user, replying);
    this.message = { ...this.general, message };
  }
}
export class ImageAndVideo extends message {
  constructor(user, replying, links, messageCaption, type) {
    super("imageAndVideo", user, replying);
    this.message = { ...this.general, links, messageCaption, type };
  }
}

export class Contact extends message {
  constructor(user, replying, listOfUsers) {
    super("contact", user, replying);
    this.message = { ...this.general, listOfUsers };
  }
}
