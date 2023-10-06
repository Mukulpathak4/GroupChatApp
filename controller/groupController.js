// Import necessary modules and models
const Group = require('../models/groupModel');
const User = require('../models/userModel');
const UserGroup = require('../models/userGroupModel');
const sequelize = require('../util/config');

// Helper function to check if a string is invalid (undefined or empty)
const isStringInvalid = (string) => {
    return string == undefined || string.length === 0;
}

// Add a new group to the groups table
const postNewGroup = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { groupName } = req.body;
        const name = req.user.name;

        // Check if the groupName is invalid
        if (isStringInvalid(groupName)) {
            return res.status(400).json({ error: "Parameters are missing" });
        }

        // Create a new group in the Group model
        const group = await Group.create({ name: groupName, createdBy: name, userId: req.user.id }, { transaction: t });
        // Create a user-group association in the UserGroup model with isAdmin set to true
        const userGroup = await UserGroup.create({ userId: req.user.id, groupId: group.dataValues.id, isAdmin: true }, { transaction: t });

        await t.commit();
        res.status(202).json({ newGroup: group, message: `Successfully created ${groupName}`, userGroup });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Get a list of groups based on the user's ID
const getGroups = async (req, res) => {
    try {
        // Find all user-group associations with the specified userId
        const userGroup = await UserGroup.findAll({ where: { userId: req.user.id } });

        let groupsList = [];
        for (let i = 0; i < userGroup.length; i++) {
            let groupId = userGroup[i].dataValues.groupId;
            // Find the group based on groupId
            const group = await Group.findByPk(groupId);
            groupsList.push(group);
        }

        // Retrieve all users
        const users = await User.findAll();

        res.status(201).json({ listOfUsers: users, groupsList, userGroup });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Add a user to a particular group
const addUserToGroup = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { userId, groupId } = req.params;

        // Create a user-group association with isAdmin set to false
        const userGroup = await UserGroup.create({ userId, groupId, isAdmin: false }, { transaction: t });

        await t.commit();
        res.status(202).json({ userGroup, message: 'Successfully added user to your group' });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Get group members based on groupId
const getGroupMembers = async (req, res) => {
    try {
        const { groupId } = req.params;
        const usersDetails = [];
        const userGroup = await UserGroup.findAll({ where: { groupId } });
        for (let i = 0; i < userGroup.length; i++) {
            let userId = userGroup[i].dataValues.userId;
            // Find the user based on userId
            const user = await User.findByPk(userId);
            usersDetails.push(user);
        }
        res.status(201).json({ usersDetails, userGroup });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Delete a user-group association based on the association's ID
const deleteGroupMember = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;

        // Delete the user-group association
        const userGroup = await UserGroup.destroy({ where: { id } }, { transaction: t });

        await t.commit();
        res.status(200).json({ userGroup, message: `Successfully removed group member` });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ error: `Internal Server Error` });
    }
}

// Update the isAdmin status of a user-group association
const updateIsAdmin = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const userGroupId = req.params.userGroupId;

        // Find the user-group association based on ID
        const userGroup = await UserGroup.findOne({ where: { id: userGroupId } });

        // Update the isAdmin status to true
        const updateAdmin = await userGroup.update({ isAdmin: true }, { transaction: t });

        await t.commit();
        res.status(202).json({ updateAdmin, message: `Successfully made Admin of Group` });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ error: `Internal Server Error` });
    }
}

module.exports = {
    postNewGroup,
    getGroups,
    addUserToGroup,
    getGroupMembers,
    deleteGroupMember,
    updateIsAdmin
}
