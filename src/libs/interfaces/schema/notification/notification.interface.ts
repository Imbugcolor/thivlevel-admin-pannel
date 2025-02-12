interface NotificationSchema {
    _id: string;
    title: string;
    message: string;
    type: string;
    image_url?: string;
    variables?: string;
    target_url?: string;
    createdAt: Date,
    updatedAt: Date,
}