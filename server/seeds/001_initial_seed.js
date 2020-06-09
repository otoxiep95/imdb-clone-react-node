exports.seed = function (knex) {
  return knex("watchLink")
    .del()
    .then(() => {
      return knex("review")
        .del()
        .then(() => {
          return knex("movieLike")
            .del()
            .then(() => {
              return knex("users").del();
            });
        });
    })
    .then(() => {
      return knex("users").insert([
        {
          username: "alpaketo",
          email: "adummydummypapa@gmail.com",
          password:
            "$2a$10$iI639qF9gX0hqktt745/TO1nKb1KR8ClP1KoJoPG0mcNZzM15Nwcm", //test123
        },
        {
          username: "mamaBear",
          email: "adummydummymama@gmail.com",
          password:
            "$2a$10$iI639qF9gX0hqktt745/TO1nKb1KR8ClP1KoJoPG0mcNZzM15Nwcm", //test123
        },
        {
          username: "miniTheCub",
          email: "adummydummycub@gmail.com",
          password:
            "$2a$10$iI639qF9gX0hqktt745/TO1nKb1KR8ClP1KoJoPG0mcNZzM15Nwcm", //test123
        },
      ]);
    })
    .then((users) => {
      return knex("review").insert([
        {
          user_id: 1, //-> Alberto
          title: "Amazing",
          rating: 5,
          content: "Cried like a baby, couldnt hold my tears back",
          movie_id: 67,
        },
        {
          user_id: 2, //-> Alberto
          title: "Meh",
          rating: 2,
          content: "Such a dumb movie",
          movie_id: 67,
        },
      ]);
    });
};
