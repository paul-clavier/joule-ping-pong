import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const players = [
  { firstName: "paul", lastName: "clavier" },
  { firstName: "benjamin", lastName: "peter" },
  { firstName: "kevin", lastName: "menon" },
  { firstName: "yannis", lastName: "bouhrour" },
  { firstName: "emmanuel", lastName: "lorenzotti" },
  { firstName: "harold", lastName: "basa" },
  { firstName: "remy", lastName: "" },
  { firstName: "marie", lastName: "drecq" },
];

const createPlayer = async (
  firstName: string,
  lastName: string,
  pseudo = "",
) => {
  await prisma.player.create({
    data: { firstName, lastName, pseudo, elo: 500 },
  });
};

async function main() {
  players.forEach(({ firstName, lastName }) =>
    createPlayer(firstName, lastName),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
