class CREPIntegration {
  constructor() {
    this._handlers = [];
  }
  onUpdate(cb) {
    this._handlers.push(cb);
  }
  emit(v) {
    for (const h of this._handlers) h(v);
  }
}
module.exports = { CREPIntegration };

