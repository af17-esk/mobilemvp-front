export type MarketType = {
    id: string;
    question: string;
    subtotal?: number;
    options: MarketOptiontype[];
    market_data?: string;
}

export type MarketOptiontype = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
}