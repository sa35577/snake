import { Direction } from './direction'

export type Player = {
    positions : Array<Array<number>>;
    direction : Direction;
    futureDirection : Direction;
    lastPosition : Array<number>;
};
