-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gamesDrewAsBlack" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "gamesDrewAsWhite" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "gamesLostAsBlack" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "gamesLostAsWhite" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "gamesWonAsBlack" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "gamesWonAsWhite" INTEGER NOT NULL DEFAULT 0;
