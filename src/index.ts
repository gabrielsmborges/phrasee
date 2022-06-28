import express from 'express';
import bodyParser from 'body-parser';
import { Notification, User, CreateBody } from "./util/types";
import untypedNotifications from './notifications.json';
import { v4 as uuid } from 'uuid';

const notifications = untypedNotifications as Notification[];

const users = notifications.reduce((acc: { [key: string]: User }, notification: Notification) => {
    const { user } = notification;
    if (!acc[user.id]) {
        acc[user.id] = user;
    }
    return acc;
}, {});

const app = express();
app.use(bodyParser.json());

app.get('/post/:id', (req, res) => {
    const postExists = notifications.some(n => n.post.id === req.params.id)
    if (!postExists) {
        res.status(404).send('Post not found')
    }
    const id = req.params.id;
    const likes = notifications.filter(n => n.post.id === id && n.type === 'Like');
    const comments = notifications.filter(n => n.post.id === id && n.type === 'Comment');
    console.log({ likes, comments });
    res.status(200).json({ likes, comments });
})


app.post('/create', (req, res) => {
    const body = req.body as CreateBody;
    if (!body) return res.status(400).send('body is required');

    const userId = req.headers.userid as string;
    if (!userId || !userId.length) return res.status(400).send('userid is required in headers');

    const notificationType = body.type;
    if (!notificationType || !notificationType.length) return res.status(400).send('type is required');

    const user = users[userId];
    if (!user) return res.status(400).send('user not found');

    const postId = body.postId;
    if (!postId || !postId.length) return res.status(400).send('postId is required');

    const postExists = notifications.some(n => n.post.id === postId);
    if (!postExists) return res.status(400).send('post not found');

    if (notificationType === 'Comment') {
        const comment = body.comment;
        if (!comment || !comment.length) return res.status(400).send('comment is required');
    }

    const notification: Notification = {
        type: notificationType,
        read: false,
        post: {
            id: postId,
            title: notifications.find(n => n.post.id === postId).post.title
        },
        ...(notificationType === 'Comment' && {
            comment: {
                id: uuid().replace(/-/g, ''),
                commentText: body.comment,
            }
        }),
        user
    }
    notifications.push(notification);
    res.status(200).json({
        message: `${notificationType} succefully created`,
        notification
    });
})


app.post('/read/:id', (req, res) => {
    const id = req.params.id;
    const notification = notifications.find(n => n.post.id === id);
    if (!notification) return res.status(400).send('notification not found');
    notification.read = true;
    res.status(200).json({
        message: 'notification read',
        notification
    });

})

app.listen(8080, () => {
    console.log('Example app listening on http://localhost:8080');
})