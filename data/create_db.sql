/*DROP TABLE IF EXISTS "scores";*/
/*psql -U hugo -d invaders -f chemin/du/fichier.sql */

CREATE TABLE IF NOT EXISTS "scores" (
  "id" INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "game" VARCHAR(20),
  "score" INT,
  "pseudo" VARCHAR(30)
);

/* CREATE TABLE IF NOT EXISTS "student" (
  "id" SERIAL PRIMARY KEY,
  "first_name" VARCHAR(128),
  "last_name" VARCHAR(128),
  "github_username" VARCHAR(255),
  "profile_picture_url" VARCHAR(255),
  "promo_id" INT REFERENCES "promo"("id")
); */
