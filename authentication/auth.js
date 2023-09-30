const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        const { id, name, groupId } = jwt.verify(token, process.env.TOKEN_SECRET);

        console.log("Decoded token:", { id, name, groupId });

        const userFound = await User.findOne({
            where: { id: id, name: name },
            attributes: ["id", "name", "email", "phone"]
        });

        console.log("User found:", userFound);

        if (!userFound) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = userFound;

        // Set the groupId in the user object based on req.params or decoded token.
        req.user.dataValues.groupId = req.params.groupId || groupId;

        console.log("Updated req.user:", req.user.dataValues);

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = authenticate;
