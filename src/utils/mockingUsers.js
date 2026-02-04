import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import { createHash } from "./index.js";

export const generateMockUsers = async (count = 50) => {
  const users = [];

  for (let i = 0; i < count; i++) {

    const first_name = faker.person.firstName();

    const last_name = faker.person.lastName();
    
    const email = `${first_name}.${last_name}.${faker.string.uuid()}@test.com`.toLowerCase();

    const password = await createHash("coder123");

    const role = faker.helpers.arrayElement(["user", "admin"]);

    users.push({
      _id: new mongoose.Types.ObjectId(),
      first_name,
      last_name,
      email,
      password,
      role,
      pets: [],
    });
  }

  return users;
};
