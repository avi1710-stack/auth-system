const express = require("express")
const router = express.Router()
const auth = require("../middleware/authMiddleware")
const authorize = require("../middleware/roleMiddleware")

router.get(
    "/dashboard",
    auth,
    authorize("admin"),
    (req,res) => {
        res.json({message:"Welcome Admin"})
    }
)
module.exports = router;