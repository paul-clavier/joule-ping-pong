import { BadRequestException, Injectable } from "@nestjs/common";
import { Player, PrismaClient } from "@prisma/client";

@Injectable()
export class PlayerService {
  constructor(private prisma: PrismaClient) {}

  findPlayer = async (playerName: string): Promise<Player> => {
    const clearedPlayerName = playerName.trim().toLowerCase();
    try {
      const playerFromFirstName = this.findPlayerByFirstName(clearedPlayerName);
      return playerFromFirstName;
    } catch (error) {
      return this.findPlayerByPseudo(clearedPlayerName);
    }
  };

  private findPlayerByFirstName = async (
    playerName: string,
  ): Promise<Player> => {
    const playerFromFirstName = await this.prisma.player.findMany({
      where: { firstName: playerName },
    });

    if (playerFromFirstName.length === 0) {
      throw new BadRequestException(
        `The player ${playerName} does not exist in the database`,
      );
    }

    if (playerFromFirstName.length > 1) {
      throw new BadRequestException(
        `The player ${playerName} exists multiple times in the database. Please use a pseudo.`,
      );
    }

    return playerFromFirstName.pop();
  };

  private findPlayerByPseudo = async (playerName: string): Promise<Player> => {
    const playerFromPseudo = await this.prisma.player.findMany({
      where: { pseudo: playerName },
    });

    if (playerFromPseudo.length === 0) {
      throw new BadRequestException(
        `The player ${playerName} does not exist in the database`,
      );
    }

    if (playerFromPseudo.length > 1) {
      throw new BadRequestException(
        `The player ${playerName} exists multiple times in the database.`,
      );
    }

    return playerFromPseudo.pop();
  };
}
