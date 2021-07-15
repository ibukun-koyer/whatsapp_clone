export class multiIndex {
  constructor(array = {}) {
    this.array = array;
    this.length = Object.keys(array).length;
  }
  add(obj) {
    if (obj.createdAt !== 0) {
      const index = `${obj.meetingRoom}-->${obj.createdAt}`;

      if (this.array[index] === undefined) {
        this.array = { ...this.array, [index]: obj };
        this.length++;
      }
    }
    return this.array;
  }

  indexOfTime(time, start) {
    let index = -1;
    let found = 0;
    for (let i = 0; i < Object.keys(this.array).length; i++) {
      if (Object.keys(this.array)[i].indexOf(time) !== -1) {
        if (found === start) {
          index = i;
          break;
        }
        found++;
      }
    }
    return index;
  }
  indexOfRoom(meetingRoom) {
    return this.indexOfTime(meetingRoom, 0);
  }
  getByTime(time, start) {
    return this.array[Object.keys(this.array)[this.indexOfTime(time, start)]];
  }
  getByRoom(meetingRoom) {
    return this.array[Object.keys(this.array)[this.indexOfRoom(meetingRoom)]];
  }
  remove(meetingRoom) {
    this.length--;

    delete this.array[Object.keys(this.array)[this.indexOfRoom(meetingRoom)]];
  }
  updateMessage(meetingRoom, newValue, createdAt) {
    const getObj = this.getByRoom(meetingRoom);

    this.remove(meetingRoom);

    getObj.message = { [createdAt]: newValue };

    getObj.createdAt = createdAt;

    this.add(getObj);
  }
  display() {
    console.log(
      "=====================================MULTIINDEX ARRAY==================================="
    );
    for (let i in this.array) {
      console.log(`Key '${i}':`, this.array[i]);
    }
  }
  sort() {
    return Object.keys(this.array)
      .map((curr) => {
        return parseInt(curr.slice(curr.indexOf("-->") + 3, curr.length));
      })
      .sort((a, b) => a - b);
  }
  sortedOutput() {
    const keys = this.sort();
    let prev = undefined;
    const output = [];
    let number_of_same = 0;
    for (let i of keys) {
      if (i === prev) {
        number_of_same++;
      } else {
        number_of_same = 0;
      }
      output.push(this.getByTime(i, number_of_same));
    }
    return output;
  }
}
