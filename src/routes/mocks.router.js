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
    const { users, pets } = req.body;

    if (users === undefined || pets === undefined) {
      return res.status(400).json({
        status: "error",
        message: "users y pets son obligatorios",
      });
    }

    const usersQty = Number(users);
    const petsQty = Number(pets);

    if (!Number.isFinite(usersQty) || !Number.isFinite(petsQty)) {
      return res.status(400).json({
        status: "error",
        message: "users y pets deben ser numeros",
      });
    }

    if (usersQty < 0 || petsQty < 0) {
      return res.status(400).json({
        status: "error",
        message: "users y pets no pueden ser negativos",
      });
    }

    const mockUsers = await generateMockUsers(usersQty);
    const mockPets = generateMockPets(petsQty);

    if (mockUsers.length > 0) {
      await usersDAO.save(mockUsers);
    }

    if (mockPets.length > 0) {
      await petsDAO.save(mockPets);
    }

    return res.json({
      status: "success",
      inserted: { users: mockUsers.length, pets: mockPets.length },
    });
  } catch (error) {
    console.error("generateData error:", error);

    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
});


export default router;
