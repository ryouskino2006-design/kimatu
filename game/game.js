'use strict'; 

const express = require("express");
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

let nextId = 5;

let game = [
    { id: 1, genre: "RPG", name: "UNDERTALE", note: "作者が東方好きで影響を受けたことが有名。弾幕ゲーとしては簡単に作られているがかなりやりごたえがある。音楽も作者のtobyfo氏手ずからでその才能を分けてほしい。人生で一度はやるべき" },
    { id: 2, genre: "RPG", name: "OMORI", note: "人間の光と闇を描いている作品。設定が重いが重いだけの作品ではなくちゃんと的確に心を抉ってくる。個人的に最も好き。" },
    { id: 3, genre: "格闘", name: "street figfter6", note: "従来のストリートファイターと違いドライブシステムが追加されセットプレイ・起き攻めゲーミングになっていた５と比べて展開も早くなりとても面白い。" },
    { id: 4, genre: "格闘/アクション", name: "大乱闘スマッシュブラザーズ", note: "７年目に入ってもまだ味がする。" },
];

const findGameById = (id) => game.find(g => g.id === parseInt(id));
const findGameIndexById = (id) => game.findIndex(g => g.id === parseInt(id));

app.get("/", (req, res) => {
    res.redirect('/game');
});

// 一覧
app.get("/game", (req, res) => {
    res.render('game_list', { data: game });
});

// 新規登録フォーム（静的HTML）
app.get("/game/new", (req, res) => {
    res.redirect('/public/game_new.html');
});

// 新規追加処理 (GET)
app.get("/game_add", (req, res) => {
    const genre = req.query.genre;
    const name = req.query.game; 
    const note = req.query.note;
    const newGame = {
        id: nextId++,
        genre: genre,
        name: name,
        note: note
    };
    game.push(newGame);
    res.redirect('/game');
});

// 詳細表示
app.get("/game/:id", (req, res) => {
    const targetgame = findGameById(req.params.id);
    if (!targetgame) {
        return res.status(404).send("ゲームが見つかりません。");
    }
    res.render('game_detail', { game: targetgame });
});

// 編集画面表示
app.get("/game/:id/edit", (req, res) => {
    const targetgame = findGameById(req.params.id);
    if (!targetgame) {
        return res.status(404).send("ゲームが見つかりません。");
    }
    res.render('game_edit', { game: targetgame });
});

// 更新処理 (GET)
app.get("/game_update/:id", (req, res) => {
    const index = findGameIndexById(req.params.id);
    if (index === -1) {
        return res.status(404).send("更新対象が見つかりません。");
    }
    game[index].genre = req.query.genre;
    game[index].name = req.query.game; 
    game[index].note = req.query.note;
    res.redirect(`/game/${req.params.id}`);
});

// 削除処理 (GET)
app.get("/game_delete/:id", (req, res) => {
    const index = findGameIndexById(req.params.id);
    if (index === -1) {
        return res.status(404).send("削除対象が見つかりません。");
    }
    game.splice(index, 1);
    res.redirect('/game');
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));