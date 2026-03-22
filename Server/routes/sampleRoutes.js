const express = require("express");

const { getSampleBoard } = require("../controllers/sampleController");

const router = express.Router();

router.get("/", getSampleBoard);

module.exports = router;
