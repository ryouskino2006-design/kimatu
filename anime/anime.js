'use strict';
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(__dirname + "/public"));
app.set('view engine', 'ejs');

let nextId = 5;

let animeList = [
    { id:1, Genre:"バトル・アクション" ,name:"Fate/staynight",note:"神作画でゲーム元とセリフが若干変更されているがそれが良い味を出している。声優の演技も素晴らしくストーリーも人生で見てきた中でも上位３番に入る"  },
    { id:2,Genre:"SF" ,name:"シュタインズゲート",note: "ストーリーが完成されていて最初から最終回までの流れが完璧すぎる。 また濃いキャラ達がさらに良い味を出している。これを超えるアニメは無いと思う。"},
    { id:3,Genre:"異世界" ,name:"無職転生",note:"そこらの量産系ゴミ異世界アニメと比べ物にならないほど違い、初見で泣いて2回目でも泣ける程よい。これが一つの異世界モノの完成系とも言える。正直アニメはシュタゲが一番すごいと思うけど一番好きなのは無職転生"},
    { id:4,Genre:"日常系・萌え" ,name:"まちカドまぞく",note:"萌えアニメではあるのだが、ストーリが良い。それでいて作者のワードチョイスが絶妙なので他では味わえないこの作品独特の良さがある"},
];

const findAnimeById = (id) => animeList.find(a => a.id === parseInt(id));
const findAnimeIndexById = (id) => animeList.findIndex(a => a.id === parseInt(id));

// 一覧表示
app.get("/anime", (req, res) => {
    res.render('anime_list', { data: animeList });
});

// 新規作成画面
app.get("/anime/new", (req, res) => {
    res.redirect('/public/anime.html'); 
});

// 新規登録実行 (GET)
    app.get("/anime_add", (req, res) => {
    const newAnime = {
        id: nextId++,
        Genre: req.query.genre,
        name: req.query.anime,
        note: req.query.note,
    };
    animeList.push(newAnime);
    res.redirect('/anime');
});

// 詳細表示
app.get("/anime/:id", (req, res) => {
    const anime = findAnimeById(req.params.id);
    if (!anime) return res.status(404).send("見つかりません");
    res.render('anime_detail', { anime: anime });
});

// 編集画面表示
app.get("/anime/:id/edit", (req, res) => {
    const anime = findAnimeById(req.params.id);
    if (!anime) return res.status(404).send("見つかりません");
    res.render('anime_edit', { anime: anime });
});

// 更新実行 (GET)
app.get("/anime_update/:id", (req, res) => {
    const index = findAnimeIndexById(req.params.id);
    if (index === -1) return res.status(404).send("更新対象が見つかりません");

    animeList[index].Genre = req.query.Genre;
    animeList[index].name = req.query.anime;
    animeList[index].note = req.query.note;

    res.redirect(`/anime/${req.params.id}`);
});

// 削除実行 (GET)
app.get("/anime_delete/:id", (req, res) => {
    const index = findAnimeIndexById(req.params.id);
    if (index === -1) return res.status(404).send("削除対象が見つかりません");

    animeList.splice(index, 1);
    res.redirect('/anime');
});

app.listen(8080, () => console.log("Anime app listening on port 8080!"));