export type GameFormat = "BO1" | "BO3" | "BO5" | "SPECIAL";

export interface Game {
    id: number;
    winningPlayerId: number;
    loosingPlayerId: number;
    format: GameFormat;
    specialTag?: string;
}
