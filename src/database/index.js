import mongoose from 'mongoose';

class Database {
  constructor() {
    this.init();
  }

  // TODO .env
  async init() {
    try {
      this.mongoConnection = await mongoose.connect(
        'mongodb://localhost:27017/kstore?authSource=admin',
        {
          user: 'admin',
          pass: 'rock123',
          auth: {
            authdb: 'admin',
          },
          useNewUrlParser: true,
          useFindAndModify: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
}

export default new Database();
