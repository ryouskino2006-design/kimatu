'use strict';

const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(__dirname + "/public"));
app.set('view engine', 'ejs');

let nextId = 5;

let lunchMenu = [
  { id: 1, name: "学食", menu: "カレー", price: 250, note: "大盛り+50円がとても量が増えるのでおそらくもっともコスパが良い" },
  { id: 2, name: "学食", menu: "定食", price: 350, note: "日によって変わり丼もの、揚げ物、焼飯など多岐にわたり飽きづらい" },
  { id: 3, name: "学食", menu: "麺", price: 350, note: "大体いつも350円程度でうどん、そば、ラーメンなどがある。油そばや坦々うどんは100円のご飯が合う" },
  { id: 4, name: "丸亀製麺", menu: "釜揚げうどん", price: 370, note: "毎月1日は半額なのでとてもお得" },
];

const findMenuById = (id) => lunchMenu.find(menu => menu.id === parseInt(id));
const findMenuIndexById = (id) => lunchMenu.findIndex(menu => menu.id === parseInt(id));

app.get("/", (req, res) => {
  res.redirect('/menu');
});

app.get("/menu", (req, res) => {
  res.render('menu_list', { data: lunchMenu });
});

app.get("/menu/new", (req, res) => {
  res.render('menu_new');
});

app.get("/menu/add", (req, res) => {
  const newMenu = {
    id: nextId++,
    name: req.query.name,
    menu: req.query.menu,
    price: parseInt(req.query.price),
    note: req.query.note,
  };
  lunchMenu.push(newMenu);
  res.redirect('/menu');
});

app.get("/menu/:id", (req, res) => {
  const menu = findMenuById(req.params.id);
  if (!menu) {
    return res.status(404).send("メニューが見つかりません。");
  }
  res.render('menu_detail', { menu: menu });
});

app.get("/menu/:id/edit", (req, res) => {
  const menu = findMenuById(req.params.id);
  if (!menu) {
    return res.status(404).send("メニューが見つかりません。");
  }
  res.render('menu_edit', { menu: menu });
});


app.get("/menu/:id/update", (req, res) => {
  const index = findMenuIndexById(req.params.id);
  if (index === -1) {
    return res.status(404).send("更新対象が見つかりません。");
  }

  lunchMenu[index].name = req.query.name;
  lunchMenu[index].menu = req.query.menu; 
  lunchMenu[index].price = parseInt(req.query.price);
  lunchMenu[index].note = req.query.note;

  res.redirect(`/menu/${req.params.id}`);
});


app.get("/menu/:id/delete", (req, res) => {
  const index = findMenuIndexById(req.params.id);
  if (index === -1) {
    return res.status(404).send("削除対象が見つかりません。");
  }

  lunchMenu.splice(index, 1);
  res.redirect('/menu');
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
