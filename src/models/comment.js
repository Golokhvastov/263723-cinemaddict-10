export default class Comment {
  constructor(comment, emotion, id) {
    this.comment = comment;
    this.date = new Date().toISOString();
    this.emotion = emotion;
    this.id = id ? id : null;
  }
}
