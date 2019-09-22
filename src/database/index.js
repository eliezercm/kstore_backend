import mongoose from 'mongoose';

class Database {
  constructor() {
    this.init();
  }

  // TODO .env
  init() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/gobarber',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    );
  }
}

export default new Database();
