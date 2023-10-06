const express = require('express');

const groupController = require('../controller/groupController');

const router = express.Router();

const authenticateMiddleware = require('../authentication/auth');

router.post('/create', authenticateMiddleware.authenticate, groupController.postNewGroup);

router.post('/add/:userId/:groupId', groupController.addUserToGroup);

router.post('/admin/:userGroupId', groupController.updateIsAdmin);

router.get('/groups', authenticateMiddleware.authenticate, groupController.getGroups);

router.get('/members/:groupId', groupController.getGroupMembers);

router.delete('/remove/:id', groupController.deleteGroupMember);

module.exports = router;