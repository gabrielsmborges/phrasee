export type User = {
    id: string,
    name: string,
}

export type Post = {
    id: string,
    title: string,
}

export type Comment = {
    id: string,
    commentText: string,
}

export type Notification = {
    type: "Like" | "Comment",
    read: boolean,
    post: Post,
    user: User,
    comment?: Comment,
}


export type CreateBody = CreateLikeBody | CreateCommentBody;
type CreateLikeBody = {
    type: "Like",
    postId: string
}
type CreateCommentBody = {
    type: "Comment",
    postId: string,
    comment: string
}