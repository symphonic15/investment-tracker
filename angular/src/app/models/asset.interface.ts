import { Operation } from './operation.interface';

export interface Asset {
    id: Number,
    name: string,
    invested: Number,
    investment_value: Number,
    quantity: Number,
    market_price: Number,
    per_profit: Number,
    cur_profit: Number,
    last_update: String,
    operations: Operation[],
    operations_count: Number;
}