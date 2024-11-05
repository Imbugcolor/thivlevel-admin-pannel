export interface Review {
    _id: string,
    rating: number,
    comment: string,
    user: Reviewer,
    productId: string,
    createdAt: string,
    updatedAt: string,
}

export interface Reviewer {
    _id: string,
    username: string
    avatar: string,
}