import mongoose from 'mongoose';

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/gobarber',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
      }
    );
  }
}

export default new Database();
