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

    @Get()
    @ApiQuery({ name: "firstName", type: String, required: false })
    @ApiQuery({ name: "lastName", type: String, required: false })
    @ApiQuery({ name: "pseudo", type: String, required: false })
    @ApiOkResponse({ type: PlayerResponseDto, isArray: true })
    async getPlayers(@Query() { firstName, lastName, pseudo }: PlayerQueryDto) {
        return this.prisma.player.findMany({
            where: {
                firstName,
                lastName,
                pseudo,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                pseudo: true,
                elo: true,
            },
            orderBy: { elo: "desc" },
        });
    }

    @Get("/history")
    @ApiQuery({ name: "player", type: String, required: true })
    async getHistory(@Query() { player }: { player: string }) {
        const playerEntity = await this.players.findPlayer(player);
        return this.prisma.game.findMany({
            where: {OR: [{ winningPlayerId: playerEntity.id }, { loosingPlayerId: playerEntity.id }], },
            select: {format: true, createdAt: true, winningPlayer: {select: {firstName: true} }, loosingPlayer: {select: {firstName: true}}},
            orderBy: { createdAt: "desc" },
        });
    }

    @Get("opposition")
    @ApiQuery({ name: "player1Name", type: String, required: true })
    @ApiQuery({ name: "player2Name", type: String, required: true })
    async getOpposition(@Query() { player1Name, player2Name }: OppositionDto) {
        const player1 = await this.players.findPlayer(player1Name);
        const player2 = await this.players.findPlayer(player2Name);

        const wonBy1 = await this.prisma.game.count({
            where: { winningPlayerId: player1.id, loosingPlayerId: player2.id },
        });

        const wonBy2 = await this.prisma.game.count({
            where: { winningPlayerId: player2.id, loosingPlayerId: player1.id },
        });
        return { [`win ${player1Name}`]: wonBy1, [`win ${player2Name}`]: wonBy2 };
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
