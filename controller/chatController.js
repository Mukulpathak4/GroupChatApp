const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Group = require("../models/groupModel");
const Admin = require("../models/adminModel");
const { Sequelize, Op } = require("sequelize");
const TokenGen = require("../TokenGen/jwt");
const sequelize = require("../util/config");

exports.send_msg = async (req, res) => {
    // console.log(req.user.dataValues.groupId);
    try {
        await req.user.createChat({
            message: req.body.msg,
            groupGroupid: req.user.dataValues.groupId
        })

        res.status(200).json({ message: "Msg Sent" });

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }

}
exports.getAllChats = async (req, res) => {
    // console.log(req.user.dataValues.groupId, "findchats gid");
    try {
        const allChat = await Chat.findAll({
            attributes: ["id", "message", "userId"],
            where: { groupGroupid: req.user.dataValues.groupId },
            include: [{
                model: User,
                attributes: ["name"]
            }],
            group: ["id"]
        });
        res.status(200).json({ message: "Success", allChat: allChat });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }
}
exports.getUpdate = async (req, res) => {
    try {
        const lastMsgId = req.params.lastMsgId;
        // console.log(lastMsgId, "lastmsgid");

        const updatedChat = await Chat.findAll({
            where: { id: { [Op.gt]: Number(lastMsgId) }, groupGroupid: req.user.dataValues.groupId },
            attributes: ["id", "message", "userId"],
            include: [{
                model: User,
                attributes: ["name"]
            }],
            group: ["id"]
        });
        res.status(200).json({ message: "Success", updatedChat: updatedChat });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }
}
exports.createGroup = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const groupName = req.body.groupName;
        if (!groupName) {
            return res.status(400).json({ message: "Bad parameters" });
        }

        // const result = await req.user.createGroup({ groupname: groupName, creator: req.user.id });

        const result = await req.user.createGroup({ groupname: groupName, creator: req.user.id }, { transaction: t })


        await Admin.create({ userId: req.user.id, groupId: result.dataValues.groupid }, { transaction: t })

        t.commit();
        res.status(200).json({ message: "Success", result: result });
    }
    catch (err) {
        t.rollback();
        console.log(err);
        res.status(500).json({ message: err });
    }
}
exports.getAllGroups = async (req, res) => {

    const allGroups = await req.user.getGroups();

    res.status(200).json({ message: "success", allGroups: allGroups });
}
exports.getGroupToken = async (req, res) => {
    try {
        const { id, name } = req.user;
        const groupId = req.params.groupId || 1;

        res.status(200).json({ message: "success", token: TokenGen.generateWebToken(id, name, groupId) });
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }
}
exports.addmember = async (req, res) => {
    const member = req.body.member;

    if (!member) {
        res.status(400).json({ message: "Bad Parameters" });
        return
    }
    try {
        const foundUser = await User.findOne({ where: Sequelize.or({ email: member }, { phone: member }) });

        if (!foundUser) {
            return res.status(404).json({ message: "User Not Found" });
        }
        else if (foundUser.id == req.user.id) {
            return res.status(400).json({ message: "You cannot add yourself" });
        }
        const ifexists = await GroupMember.findOne({ where: { groupGroupid: req.user.dataValues.groupId, userId: foundUser.id } });

        if (ifexists) {
            return res.status(400).json({ message: "User already in group" });
        }

        await GroupMember.create({ groupGroupid: req.user.dataValues.groupId, userId: foundUser.id });

        res.status(200).json({ messgae: "Success" })

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }
}
exports.viewAllMembers = async (req, res) => {
    const groupid = req.user.dataValues.groupId;

    const p1 = new Promise((resolve, reject) => {
        resolve(
            req.user.getGroups({
                where: { groupid: groupid },
                include: [{
                    model: User,
                    attributes: ["id", "name"]
                }],
                group: ["id"]
            })
        )
    })

    const p2 = new Promise((resolve, reject) => {
        resolve(Admin.findAll({ where: { groupId: groupid } }))
    })

    const result = await Promise.all([p1, p2]);

    res.status(200).json({ messgae: "Success", members: result, myId: req.user.id })

}
