import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { GameFormat } from "src/domain/game/game.entity";

export const GAME_FORMATS = ["BO1", "BO3", "B05"];

export class GameRequestDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        description: "Either put firstName or player pseudo",
    })
    winningPlayer: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        description: "Either put firstName or player pseudo",
    })
    loosingPlayer: string;

    @IsString()
    @IsIn(GAME_FORMATS)
    @ApiProperty({ required: true })
    format: GameFormat;
}
