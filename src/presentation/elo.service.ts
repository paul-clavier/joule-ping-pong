import { Injectable } from "@nestjs/common";
import { GameFormat } from "src/domain/game/game.entity";

const SCALE_FACTOR = 400;
const SPEED_FACTOR = 32;

@Injectable()
export class EloService {
  getPlayerANewElo = (
    playerAElo: number,
    playerBElo: number,
    isAWinner: 0 | 1,
    format: GameFormat,
  ) => {
    return (
      playerAElo +
      this.getFormatFactor(format) *
        SPEED_FACTOR *
        (isAWinner - this.getPlayerAWinningProbability(playerAElo, playerBElo))
    );
  };

  private getFormatFactor = (format: GameFormat): number => {
    switch (format) {
      case "BO1":
        return 1;
      case "BO3":
        return 3;
      case "BO5":
        return 5;
      case "SPECIAL":
        return 0;
    }
  };

  private getPlayerAWinningProbability = (
    playerAElo: number,
    playerBElo: number,
  ) => {
    const power = (playerBElo - playerAElo) / SCALE_FACTOR;
    return 1 / (1 + 10 ** power);
  };
}
