/*DROP TABLE IF EXISTS "scores";*/

CREATE TABLE IF NOT EXISTS "scores" (
  "id" INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "game" VARCHAR(128),
  "score" INT,
  "pseudo" VARCHAR(50),
);

/* CREATE TABLE IF NOT EXISTS "student" (
  "id" SERIAL PRIMARY KEY,
  "first_name" VARCHAR(128),
  "last_name" VARCHAR(128),
  "github_username" VARCHAR(255),
  "profile_picture_url" VARCHAR(255),
  "promo_id" INT REFERENCES "promo"("id")
); */
