const sha256 = require('js-sha256');

class KeyValuePair {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

class HashTable {

  constructor(numBuckets = 4) {
    this.capacity = numBuckets;
    this.count = 0;
    this.data = Array(this.capacity).fill(null)
  }

  hash(key) {
    let first8 = sha256(key).slice(0, 8);
    return parseInt(first8, 16);
  }

  hashMod(key) {
    return this.hash(key) % this.capacity
  }

  insertNoCollisions(key, value) {
    if (!this.data[this.hashMod(key)]) {
    this.count++;
    this.data[this.hashMod(key)] = new KeyValuePair(key, value);
    }
    else throw new Error("hash collision or same key/value pair already exists!")
  }

  insertWithHashCollisions(key, value) {
    let newPair = new KeyValuePair(key, value);
    newPair.next = this.data[this.hashMod(key)];
    this.data[this.hashMod(key)] = newPair
    this.count++;
  }

  insert(key, value) {
    if (!this.data[this.hashMod(key)]) {
      this.data[this.hashMod(key)] = new KeyValuePair(key, value);
      this.count++;
      return;
    }

    let curr = this.data[this.hashMod(key)];

    if (curr.key === key) {
      curr.value = value;
      return;
    }

    while (curr.next) {
      if (curr.next.key === key) {
      curr.next.value = value;
      return;
      }
      curr = curr.next;
    }
    
    let newPair = new KeyValuePair(key, value);
    let prevKey = this.data[this.hashMod(key)];
    newPair.next = prevKey;
    this.data[this.hashMod(key)] = newPair;
    this.count++;
  }

}


module.exports = HashTable;
