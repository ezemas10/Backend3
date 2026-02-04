import { faker } from "@faker-js/faker";
import mongoose from "mongoose";

export const generateMockPets = (count = 50) => {
  const pets = [];

  for (let i = 0; i < count; i++) {

    pets.push({
      _id: new mongoose.Types.ObjectId(),
      name: faker.animal.petName(),
      specie: faker.helpers.arrayElement(["Perro", "Gato", "Pajarito", "Hamster"]),
      birthDate: faker.date.past({ years: 15 }),
      adopted: false,
      owner: null,
      image: "foto",
    });
  }

  return pets;
};
