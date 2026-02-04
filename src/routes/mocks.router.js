import { Router } from "express";

import UsersDAO from "../dao/Users.dao.js";

import PetsDAO from "../dao/Pets.dao.js";

import { generateMockUsers } from "../utils/mockingUsers.js";

import { generateMockPets } from "../utils/mockingPets.js";

const router = Router();

const usersDAO = new UsersDAO();

const petsDAO = new PetsDAO();

router.get("/mockingusers", async (req, res) => {
  try {
    const users = await generateMockUsers(50);
    return res.json({ status: "success", payload: users });
  } catch (error) {
    return res.status(500).json({ status: "error", error: error.message });
  }
});

router.get("/mockingpets", (req, res) => {
  try {
    const pets = generateMockPets(50);
    return res.json({ status: "success", payload: pets });
  } catch (error) {
    return res.status(500).json({ status: "error", error: error.message });
  }
});

router.post("/generateData", async (req, res) => {
  try {
    const { users = 0, pets = 0 } = req.body;

    const mockUsers = await generateMockUsers(Number(users));
    const mockPets = generateMockPets(Number(pets));

    if (mockUsers.length > 0) {
      await usersDAO.save(mockUsers);
    }

    if (mockPets.length > 0) {
      await petsDAO.save(mockPets);
    }

    return res.json({
      status: "success",
      inserted: {
        users: mockUsers.length,
        pets: mockPets.length,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
});


export default router;
