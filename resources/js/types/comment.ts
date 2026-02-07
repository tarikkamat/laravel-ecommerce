export type CommentUser = {
    id: number;
    name: string;
    email: string;
};

export type CommentProduct = {
    id: number;
    title: string;
};

export type ProductComment = {
    id: number;
    product_id: number;
    parent_id: number | null;
    body: string;
    status: string;
    approved_at?: string | null;
    created_at: string;
    user: CommentUser;
    product?: CommentProduct;
    replies?: ProductComment[];
};
