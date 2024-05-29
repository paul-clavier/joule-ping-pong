import { Module } from "@nestjs/common";
import { DomainModule } from "src/domain/domain.module";
import { PlayerController } from "./player.controller";
import { PrismaClient } from "@prisma/client";
import { PlayerService } from "./player.service";
import { GameController } from "./game.controller";
import { EloService } from "./elo.service";

@Module({
  imports: [DomainModule],
  providers: [
    PlayerController,
    GameController,
    PrismaClient,
    PlayerService,
    EloService,
  ],
  controllers: [PlayerController, GameController],
})
export class PresentationModule {}
