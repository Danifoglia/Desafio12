import mongoose from "mongoose";
import * as objectUtils from "../utils/objectUtils.js";
import dotenv from 'dotenv'; 
import path from 'path';

dotenv.config({
  path: path.resolve('.env')
})

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const MONGODB = process.env.MONGOCONTAINER;

await mongoose.connect(MONGODB, options);

export default class MongoDbContainer {
  constructor(collectionString, schema) {
    this.model = mongoose.model(collectionString, schema);
  }

  async getById(id) {
    const data = await this.model.findOne({ _id: id });
    const plainData = objectUtils.returnPlainObj(data);
    const item = objectUtils.renameField(plainData, "_id", "id");
    return item;
  }

  async getAll() {
    const data = await this.model.find({});
    const plainData = objectUtils.returnPlainObj(data);
    const items = plainData.map((item) => objectUtils.renameField(item, "_id", "id"));
    return items;
  }

  async getByField(field, criteria) {
    const data = await this.model.findOne().where(field).equals(criteria);
    const plainData = objectUtils.returnPlainObj(data);
    const item = objectUtils.renameField(plainData, "_id", "id");
    return item;
  }

  async createNew(itemData) {
    const newItem = await this.model.create(itemData);
  }

  async updateById(id, itemData) {
    await this.model.updateOne({ _id: id }, { $set: { ...itemData } });
  }

  async deleteById(id) {
    await this.model.deleteOne({ _id: id });
  }

  async deleteAll() {
    await this.model.deleteMany({});
  }
}