import { DeleteResult, UpdateResult } from 'mongodb';
import {
  ConnectOptions,
  connect,
  Model,
  HydratedDocument,
  ObjectId,
} from 'mongoose';

export class MongooseClient {
  private initialized: boolean = false;

  constructor() {}

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    const connectOptions: ConnectOptions = {
      auth: {
        username: process.env['COSMOSDB_USER'],
        password: process.env['COSMOSDB_PASSWORD'],
      },
      retryWrites: false,
    };
    await connect(
      `mongodb://${process.env['COSMOSDB_HOST']}:${process.env['COSMOSDB_PORT']}/${process.env['COSMOSDB_DBNAME']}?ssl=true&replicaSet=globaldb`,
      connectOptions
    );
    this.initialized = true;
  }

  async createAsync<T>(entity: HydratedDocument<T>) {
    return await entity.save();
  }

  async createManyAsync<T>(model: Model<T>, documentsToCreate: T[]) {
    return await model.create(documentsToCreate);
  }

  async updateAsync<T>(
    model: Model<T>,
    filter: any,
    changes: any
  ): Promise<UpdateResult> {
    let result = await model.updateMany(filter, changes);
    return result;
  }

  async deleteAsync<T>(model: Model<T>, filter: any): Promise<DeleteResult> {
    const result = await model.deleteMany(filter);
    return result;
  }

  async getAync<T>(
    model: Model<T>,
    filter?: any,
    limit?: number,
    skip?: number
  ): Promise<HydratedDocument<T, {}, {}>[]> {
    if (limit == null) {
      limit = 1000;
    }
    if (skip == null) {
      skip = 0;
    }
    if (filter) {
      const response = await model.find(filter).limit(limit).skip(skip).exec();
      return response;
    }
    const unfilteredResponse = await model
      .find()
      .limit(limit)
      .skip(skip)
      .exec();
    return unfilteredResponse;
  }

  static async createClassAsync(): Promise<MongooseClient> {
    const client = new MongooseClient();
    await client.initialize();
    return client;
  }
}
