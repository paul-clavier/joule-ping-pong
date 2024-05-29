import { Controller, Post, Query } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { PrismaClient } from "@prisma/client";
import { GAME_FORMATS, GameRequestDto } from "./game.dto";
import { PlayerService } from "./player.service";
import { EloService } from "./elo.service";

@Controller("game")
@ApiTags("game")
export class GameController {
  constructor(
    private prisma: PrismaClient,
    private players: PlayerService,
    private eloCalculus: EloService,
  ) {}

  @Post()
  @ApiQuery({
    name: "format",
    type: String,
    enum: GAME_FORMATS,
    required: true,
  })
  async create(
    @Query() { winningPlayer, loosingPlayer, format }: GameRequestDto,
  ) {
    const winningPlayerEntity = {
      ...(await this.players.findPlayer(winningPlayer)),
    };
    const loosingPlayerEntity = {
      ...(await this.players.findPlayer(loosingPlayer)),
    };

    const winningPlayerNewScore = this.eloCalculus.getPlayerANewElo(
      winningPlayerEntity.elo,
      loosingPlayerEntity.elo,
      1,
      format,
    );
    const loosingPlayerNewScore = this.eloCalculus.getPlayerANewElo(
      loosingPlayerEntity.elo,
      winningPlayerEntity.elo,
      0,
      format,
    );

    const game = await this.prisma.game.create({
      data: {
        winningPlayerId: winningPlayerEntity.id,
        loosingPlayerId: loosingPlayerEntity.id,
        format,
      },
    });

    await this.prisma.history.createMany({
      data: [
        {
          playerId: winningPlayerEntity.id,
          gameId: game.id,
          scoreBefore: winningPlayerEntity.elo,
          scoreAfter: winningPlayerNewScore,
        },
        {
          playerId: loosingPlayerEntity.id,
          gameId: game.id,
          scoreBefore: loosingPlayerEntity.elo,
          scoreAfter: loosingPlayerNewScore,
        },
      ],
    });

    await this.prisma.player.update({
      where: { id: winningPlayerEntity.id },
      data: { elo: winningPlayerNewScore },
    });

    await this.prisma.player.update({
      where: { id: loosingPlayerEntity.id },
      data: { elo: loosingPlayerNewScore },
    });
  }
}
