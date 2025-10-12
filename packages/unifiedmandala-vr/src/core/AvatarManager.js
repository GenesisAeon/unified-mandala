class AvatarManager {
  constructor() {
    this._items = [];
  }
  addAvatar(a) {
    this._items.push(a);
  }
  removeAvatar(id) {
    this._items = this._items.filter((x) => x.id !== id);
  }
  getAvatars() {
    return this._items;
  }
}
module.exports = { AvatarManager };

