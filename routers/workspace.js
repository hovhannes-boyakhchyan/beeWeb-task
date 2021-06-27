const express = require('express');
const responseHandler = require('../middleware/responseHandler');
const { body } = require('express-validator');
const validationResult = require('../middleware/validationResult');
const WorkspacesCtrl = require('../controllers/workspaces-ctrl');
const validateToken = require('../middleware/validateToken');
const { get } = require('../controllers/workspaces-ctrl');

const router = express.Router();

router.route('/')
    .get(
        responseHandler,
        validateToken,
        async (req, res) => {
            const workspaces = await WorkspacesCtrl.get();
            res.onSuccess(workspaces);
        }
    )
    .post(
        responseHandler,
        validateToken,
        body('name').isLength({ min: 3 }),
        validationResult,
        async (req, res) => {
            try {
                const workspace = await WorkspacesCtrl.add({
                    author: req.decode.userId,
                    name: req.body.name,
                });
                res.onSuccess(workspace, "workspace created");
            } catch (e) {
                res.onError(e);
            }
        }
    )

router.route('/:workspaceId')
    .get(
        validateToken,
        responseHandler,
        async (req, res) => {
            try {
                const workspace = await WorkspacesCtrl.getById(req.params.workspaceId);
                res.onSuccess(workspace);
            } catch (e) {
                res.onError(e);
            }
        }
    )
    .put(
        validateToken,
        responseHandler,
        async (req, res) => {
            try {
                const workspace = await WorkspacesCtrl.update({ ...req.body, id: req.params.workspaceId });
                res.onSuccess(workspace, 'workspace is update');
            } catch (e) {
                res.onError(e);
            }
        }
    )
    .delete(
        validateToken,
        responseHandler,
        async (req, res) => {
            try {
                const workspace = await WorkspacesCtrl.delete(req.params.workspaceId);
                res.onSuccess(workspace, 'workspace deleited');
            } catch (e) {
                res.onError(e);
            }
        }
    )

router.route('/:workspaceId/member/:memberId')
    .post(
        responseHandler,
        validateToken,
        async (req, res) => {
            try {
                const data = await WorkspacesCtrl.addMember({
                    currentUserId: req.decode.userId,
                    memberId: req.params.memberId,
                    workspaceId: req.params.workspaceId
                });
                res.onSuccess(data, 'Member added');
            } catch (e) {
                res.onError(e);
            }
        }
    )
    .get(
        responseHandler,
        validateToken,
        async (req, res) => {
            try {
                const member = await WorkspacesCtrl.getMember({
                    currentUserId: req.decode.userId,
                    memberId: req.params.memberId,
                    workspaceId: req.params.workspaceId
                });
                res.onSuccess(member);
            } catch (e) {
                res.onError(e);
            }
        }
    )
    .delete(
        responseHandler,
        validateToken,
        async (req, res) => {
            try {
                await WorkspacesCtrl.delMember({
                    currentUserId: req.decode.userId,
                    memberId: req.params.memberId,
                    workspaceId: req.params.workspaceId
                });
                res.onSuccess('', 'Member deleted');
            } catch (e) {
                res.onError(e);
            }
        }
    )

router.route('/:workspaceId/channel')
    .get(
        responseHandler,
        validateToken,
        async (req, res) => {
            try {
                const channel = await WorkspacesCtrl.getChannels(req.decode.userId);
                res.onSuccess(channel);
            } catch (e) {
                res.onError(e);
            }
        }

    )


router.route('/:workspaceId/channel/:channelId')
    .post(
        responseHandler,
        validateToken,
        async (req, res) => {
            try {
                const channel = await WorkspacesCtrl.addChannel({
                    name: req.body.name,
                    currentUserId: req.decode.userId,
                    workspaceId: req.params.workspaceId,
                    channelId: req.params.channelId
                });
                res.onSuccess(channel);
            } catch (e) {
                res.onError(e);
            }
        }

    )
    .delete(
        responseHandler,
        validateToken,
        async (req, res) => {
            try {
                await WorkspacesCtrl.delChannel({
                    currentUserId: req.decode.userId,
                    workspaceId: req.params.workspaceId,
                    channelId: req.params.channelId
                });
                res.onSuccess('', 'channel deleted');
            } catch (e) {
                res.onError(e);
            }
        }

    )


module.exports = router;