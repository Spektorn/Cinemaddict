import Observer from '../utilities/observer.js';

export default class Comments extends Observer {
  constructor() {
    super();

    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  getCommentsIDs() {
    return this._comments.map((comment) => comment.id);
  }

  updateComments(updateType, update) {
    this._comments = update;

    this._notify(updateType);
  }

  deleteComment(updateType, update) {
    const deletingItemIndex = this._comments.findIndex((comment) => comment.id === update);

    if (deletingItemIndex === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this._comments = [
      ...this._comments.slice(0, deletingItemIndex),
      ...this._comments.slice(deletingItemIndex + 1),
    ];

    this._notify(updateType);
  }


  /*
  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        isDeleting: false,
      },
    );

    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {},
    );

    delete adaptedComment.isDeleting;

    return adaptedComment;
  }
  */
}
