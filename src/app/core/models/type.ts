import { ID } from '@datorama/akita';

export interface Type {
    id: ID;
    name: string;
}

export const Types: Type[] = [
    { id: 1, name: 'ミニストップ'},
    { id: 2, name: 'ST'},
    { id: 3, name: 'cisca'}
];
