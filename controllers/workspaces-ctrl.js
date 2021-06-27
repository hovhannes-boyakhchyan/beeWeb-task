const Workspaces = require('../models/workspaces');
const Channels = require('../models/channels');
const Users = require('../models/users');
const AppError = require('../managers/app_error');

class WorkspaceCtrl {
    async get() {
        return Workspaces.find().populate({
            path: 'author',
            select: '-_id name surname email'
        });
    }
    async add(data) {
        if (!await Users.exists({ '_id': data.author })) {
            throw new AppError('user id invalide', 403);
        }
        return new Workspaces({ ...data }).save();
    }
    async getById(id) {
        if (!await Workspaces.exists({ '_id': id })) {
            throw new AppError('Workspace not found', 401);
        }
        return Workspaces.findById(id).populate({
            path: 'author',
            select: '-_id name surname email'
        });
    }
    async update(data) {
        const { name, id } = data;
        if (!await Workspaces.exists({ '_id': id })) {
            throw new AppError('user not found', 403);
        }
        const workspaces = await Workspaces.findById(id);
        if (name) {
            workspaces.name = name;
        }
        return workspaces.save();
    }
    async delete(id) {
        if (!await Workspaces.exists({ '_id': id })) {
            throw new AppError('Workspace not found', 403);
        }
        const workspace = await Workspaces.findById(id);
        return workspace.remove();
    }
    async addMember(data) {
        const { currentUserId, memberId, workspaceId } = data;
        const [currentUser, user] = await Promise.all([Users.findById(currentUserId), Users.findById(memberId)]);
        if (!currentUser || !user) {
            throw new AppError('bad request', 403);
        }
        const workspace = await Workspaces.findById(workspaceId);
        if (workspace.members.some(member => member.memberId == memberId)) {
            throw new AppError('Member has been added', 403);
        }
        workspace.members.push({
            memberId: memberId,
            name: user.name,
            surname: user.surname,
            image: user.image
        });
        return workspace.save();
    }
    async getMember(data) {
        const { currentUserId, memberId, workspaceId } = data;
        const [currentUser, user] = await Promise.all([Users.findById(currentUserId), Users.findById(memberId)]);
        if (!currentUser || !user) {
            throw new AppError('bad request', 403);
        }
        const workspace = await Workspaces.findById(workspaceId);
        if (!workspace.members.some(member => member.memberId == memberId)) {
            throw new AppError('Member not found', 403);
        }
        return user;
    }
    async delMember(data) {
        const { currentUserId, memberId, workspaceId } = data;
        const [currentUser, user] = await Promise.all([Users.findById(currentUserId), Users.findById(memberId)]);
        if (!currentUser || !user) {
            throw new AppError('bad request', 403);
        }
        const workspace = await Workspaces.findById(workspaceId);
        if (!workspace.members.some(member => member.memberId == memberId)) {
            throw new AppError('Member not found', 403);
        }
        workspace.members.splice(workspace.members.findIndex(member => member.memberId == memberId), 1);
        return workspace.save();
    }
    async getChannels(id) {
        if (!await Users.exists({ id: id })) {
            throw new AppError('bad request', 403);
        }
        return Workspaces.find();
    }
    async addChannel(data) {
        const { currentUserId, workspaceId, name } = data;
        const [currentUser, workspace] = await Promise.all([Users.findById(currentUserId), Workspaces.findById(workspaceId)]);
        if (!currentUser || !workspace) {
            throw new AppError('bad request', 403);
        }
        const channel = await new Channels({
            name,
            forWorkspace: workspaceId
        }).save();
        return workspace.channels.push({
            channelId: channel._id,
            name: channel.name
        }).save();
    }
    async delChannel(data) {
        const { currentUserId, workspaceId, channelId } = data;
        const [currentUser, workspace] = await Promise.all([Users.findById(currentUserId), Workspaces.findById(workspaceId)]);
        if (!currentUser || !workspace || !await Channels.exists({ id: channelId })) {
            throw new AppError('bad request', 403);
        }
        workspace.channels.splice(workspace.channels.findIndex(channels => channels._id == channelId), 1);
        return workspace.save();
    }
}

module.exports = new WorkspaceCtrl;