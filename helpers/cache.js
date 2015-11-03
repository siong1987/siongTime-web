var cache = {
  memory: {},

  set: function(list) {
    this.memory = list;
  },

  get: function() {
    return this.memory;
  }
}

module.exports = cache;
