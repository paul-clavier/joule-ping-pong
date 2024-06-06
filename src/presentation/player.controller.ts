import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import {
  OppositionDto,
  PlayerQueryDto,
  PlayerRequestDto,
  PlayerResponseDto,
} from "./player.dto";
import { PrismaClient } from "@prisma/client";
import { PlayerService } from "./player.service";

@Controller("player")
@ApiTags("player")
export class PlayerController {
  constructor(
    private prisma: PrismaClient,
    private players: PlayerService,
  ) {}

  @Get("/ranking")
  @ApiQuery({ name: "firstName", type: String, required: false })
  @ApiOkResponse({ type: PlayerResponseDto, isArray: true })
  async getPlayers(@Query() { firstName }: PlayerQueryDto) {
    return this.prisma.player
      .findMany({
        select: {
          id: true,
          firstName: true,
          elo: true,
        },
        orderBy: { elo: "desc" },
      })
      .then((players) =>
        players
          .map((player) => ({ ...player, rank: players.indexOf(player) + 1 }))
          .filter((player) => !firstName || player.firstName === firstName),
      );
  }

  @Get("/history")
  @ApiQuery({ name: "player", type: String, required: true })
  async getHistory(@Query() { player }: { player: string }) {
    const playerEntity = await this.players.findPlayer(player);
    const data = await this.prisma.game.findMany({
      where: {
        OR: [
          { winningPlayerId: playerEntity.id },
          { loosingPlayerId: playerEntity.id },
        ],
      },
      select: {
        format: true,
        createdAt: true,
        winningPlayer: { select: { firstName: true } },
        loosingPlayer: { select: { firstName: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    const toto = {
      gamesPlayed: data.length,
      win: data.filter((game) => game.winningPlayer.firstName === player)
        .length,
      lost: data.filter((game) => game.loosingPlayer.firstName === player)
        .length,
      BO1: {
        win: data.filter(
          (game) =>
            game.winningPlayer.firstName === player && game.format === "BO1",
        ).length,
        lost: data.filter(
          (game) =>
            game.loosingPlayer.firstName === player && game.format === "BO1",
        ).length,
      },
      BO3: {
        win: data.filter(
          (game) =>
            game.winningPlayer.firstName === player && game.format === "BO3",
        ).length,
        lost: data.filter(
          (game) =>
            game.loosingPlayer.firstName === player && game.format === "BO3",
        ).length,
      },
      BO5: {
        win: data.filter(
          (game) =>
            game.winningPlayer.firstName === player && game.format === "BO5",
        ).length,
        lost: data.filter(
          (game) =>
            game.loosingPlayer.firstName === player && game.format === "BO5",
        ).length,
      },
      data,
    };

    return toto;
  }

  @Get("opposition")
  @ApiQuery({ name: "player1Name", type: String, required: true })
  @ApiQuery({ name: "player2Name", type: String, required: true })
  async getOpposition(@Query() { player1Name, player2Name }: OppositionDto) {
    const player1 = await this.players.findPlayer(player1Name);
    const player2 = await this.players.findPlayer(player2Name);

    const wonBy1 = await this.prisma.game.findMany({
      where: { winningPlayerId: player1.id, loosingPlayerId: player2.id },
    });

    const wonBy2 = await this.prisma.game.findMany({
      where: { winningPlayerId: player2.id, loosingPlayerId: player1.id },
    });
    return {
      [`win ${player1Name}`]: wonBy1.length,
      [`win ${player2Name}`]: wonBy2.length,
      BO1: {
        [`win ${player1Name}`]: wonBy1.filter((game) => game.format === "BO1")
          .length,
        [`win ${player2Name}`]: wonBy2.filter((game) => game.format === "BO1")
          .length,
      },
      BO3: {
        [`win ${player1Name}`]: wonBy1.filter((game) => game.format === "BO3")
          .length,
        [`win ${player2Name}`]: wonBy2.filter((game) => game.format === "BO3")
          .length,
      },
      BO5: {
        [`win ${player1Name}`]: wonBy1.filter((game) => game.format === "BO5")
          .length,
        [`win ${player2Name}`]: wonBy2.filter((game) => game.format === "BO5")
          .length,
      },
    };
  }

  @Post()
  async create(@Body() { firstName, lastName, pseudo }: PlayerRequestDto) {
    return this.prisma.player.create({
      data: {
        firstName,
        lastName,
        pseudo,
        elo: 500,
      },
    });
  }
}
