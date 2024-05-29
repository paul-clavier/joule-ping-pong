import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Player } from "src/domain/player/player.entity";

export class PlayerRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  pseudo: string;
}

export class OppositionDto {
  player1Name: string;
  player2Name: string;
}

export class PlayerQueryDto {
  firstName?: string | undefined;
}

export class PlayerResponseDto implements Player {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  pseudo: string;

  @ApiProperty()
  elo: number;
}
