class Main1 extends React.Component {
  render() {
    return (
      <div className="welcome">
        <h3>Welcome to Warfare</h3>
        <h5>A Rouguelike Dungeon Crawler Game</h5>
        <div className="buttons">
          <button onClick={() => show(3)}>Start</button>
          <button onSubmit={() => show(2)} onClick={() => show(2)}>
            Instructions
          </button>
        </div>
      </div>
    );
  }
}
class Main2 extends React.Component {
  render() {
    return (
      <div class="welcome it">
        <h3>Story</h3>
        <p>
          Caldor has to defeat Bossman go get back his most precious jewel
          stolen, but on the way to fight him, he is entrapped in a maze. Now he
          has to deactivate all the mines in the maze before he can face
          Bossman, he embarks on the task but can he do it?
        </p>
        <h3>Instructions</h3>
        <p>
          Click on Caldor(the green chip) to shoot at the mines to deactivate
          them, but careful now the mines also have traps in them, so avoid
          hovering or clicking on the mines themselves. The shooting range of
          Caldor's gun is 3 boxes and costs 25xp. You can move Caldor by
          clicking on any adjacent box except they are already occupied by
          obstacles or mines. After destroying all the mines. You'll then face
          Bossman, but he isn't unarmed, he'll shoot at you.
        </p>
        <button onClick={() => show(3)}>Start</button>
      </div>
    );
  }
}

var svg, po, veer;
var boss_ind = -1;
var tt = screen.width;
var hh = screen.height;
var wdd = tt >= 1080 ? 400 : tt >= 800 ? 300 : 200;
var hdd = hh >= 800 ? 300 : 200;
var state = { pos: [], ren: [], moves: 0 };
class Main3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hint: "",
      moves: 0,
      move_count: 0,
      xp: 5000,
      boss_xp: 5000,
      enemy_count: 0,
      enemy_counter: 1000
    };
    this.shoot = this.shoot.bind(this);
    this.update = this.update.bind(this);
    this.conjure = this.conjure.bind(this);
    this.start = this.start.bind(this);
    this.obstacles = this.obstacles.bind(this);
    this.position = this.position.bind(this);
    this.player = this.player.bind(this);
    this.enemies = this.enemies.bind(this);
    this.collide = this.collide.bind(this);
    this.battle = this.battle.bind(this);
    this.boss = this.boss.bind(this);
    this.ene = this.ene.bind(this);
    this.orient = this.orient.bind(this);
    this.reveal = this.reveal.bind(this);
  }
  componentDidMount() {
    this.start();
    this.player();
    this.enemies();
  }
  obstacles() {
    var h = 100;
    var arr = [];
    let i = 0;
    while (i < h) {
      arr[i] = [];
      i++;
    }
    for (let i = 0; i < h; i++) {
      for (let j = 0; j < h; j++) {
        arr[i][j] =
          Math.floor(Math.random() * 2) == 1
            ? Math.floor(Math.random() * 2) == 1
              ? Math.floor(Math.random() * 2)
              : 0
            : 0;
      }
    }
    return arr;
  }
  conjure() {
    var h = 100;
    var arr = [];
    let i = 0;
    while (i < h) {
      arr[i] = [];
      i++;
    }
    for (let i = 0; i < h; i++) {
      for (let j = 0; j < h; j++) {
        if (i > 0 && j > 0) {
          arr[i][j] = arr[i][j - 1] == 0 ? 1 : 0;
        } else {
          arr[i][j] = ((i + 1) * (j + 1)) % 2;
        }
      }
    }
    return arr;
  }
  position(e) {
    let ne = state.pos;
    if (
      e == state.moves + 1 ||
      e == state.moves - 1 ||
      e == state.moves - 100 ||
      e == state.moves + 100 ||
      e == state.moves - 99 ||
      e == state.moves - 101 ||
      e == state.moves + 99 ||
      e == state.moves + 101 ||
      e == state.moves
    ) {
      if (ne[e] != 1 && state.ren[e] != 1) {
        ne = ne.map((i, j) => {
          if (i == 2) {
            return j - 1 > 0 ? (j - 1 == 0 ? 1 : 0) : 0;
          }
          if (j == e) {
            return 2;
          } else {
            return i;
          }
        });
        this.setState({ moves: e, pos: ne });
        state.pos = ne;
        state.moves = e;
      }
    }
    return ne;
  }
  start() {
    let board = this.conjure();
    let ob = this.obstacles();
    var ex = [];
    var ex2 = [];
    board.map((i) => {
      i.map((j) => {
        ex.push(j);
      });
    });
    ob.map((i) => {
      i.map((j) => {
        ex2.push(j);
      });
    });
    let hh = Math.floor(Math.random() * 100);
    let ww = Math.floor(Math.random() * 100);
    let p = hh * ww;
    if (ex2[p] == 1) {
      ex2[p] == 0;
    }
    this.setState({ pos: ex2, moves: p });
    state.pos = ex2;
    state.moves = p;
    let height = board.length;
    let width = board[0].length;
    document
      .getElementById("board")
      .scrollTo(
        (state.moves % 100) * 100 - wdd,
        Math.floor(state.moves / 100) * 100 - hdd
      );
    svg = d3.select(".let").attr("class", "svg");
    svg
      .selectAll("rect")
      .data(ex)
      .enter()
      .append("rect")
      .attr("x", (d, i) => (i % width) * 100)
      .attr("y", (d, i) => Math.floor(i / height) * 100)
      .attr("height", 100)
      .attr("width", 100)
      .attr("class", "cell")
      .attr("fill", (d, i) =>
        ex2[i] == 1 ? "#3e2723" : ex[i] == 1 ? "#b0bec5" : "#263238"
      )
      .attr("stroke", "#ffca28")
      .attr("stroke-width", (d, i) => (ex2[i] == 1 ? "0.135rem" : "0px"))
      .on("mousedown", (d, i) => this.update(i, 35));
  }
  player() {
    var e = state.moves;
    var pos = this.position(e);
    if (state.ren[e] == 1 || state.pos[e] == 1) {
      state.moves = Math.floor(Math.random() * 150 * (Math.random() * 150));
      this.player();
    } else {
      svg
        .append("g")
        .attr("class", "player")
        .selectAll("circle")
        .data(pos)
        .enter()
        .append("circle")
        .attr("class", "player")
        .attr("cx", (d, i) => (i % 100) * 100 + 50)
        .attr("cy", (d, i) => Math.floor(i / 100) * 100 + 50)
        .attr("r", (d, i) => (d == 2 ? 35 : 0))
        .attr("stroke", "grey")
        .attr("stroke-width", (d, i) => (d == 2 ? "0.135rem" : "0px"))
        .attr("fill", (d) => (d == 2 ? "green" : "#263238"))
        .on("mousedown", (d, i) => this.shoot(i));
    }
  }
  enemies() {
    var arr2 = this.obstacles();
    let arr = [];
    arr2.map((i) => {
      i.map((j) => {
        arr.push(j);
      });
    });
    var count = 0;
    var renewed = arr.map((i, j) => {
      if (
        state.pos[j] == 1 ||
        j == state.moves ||
        j == state.moves + 1 ||
        j == state.moves - 1 ||
        j == state.moves - 100 ||
        j == state.moves + 100
      ) {
        return 0;
      } else {
        let t =
          i == 1
            ? Math.floor(Math.random() * 2) == 1
              ? Math.floor(Math.random() * 2)
              : 0
            : 0;
        return t;
      }
    });
    state.ren = renewed;
    this.setState({
      ren: renewed,
      enemy_count: renewed.filter((i) => i == 1).length
    });
    svg
      .append("g")
      .attr("class", "enemies")
      .selectAll("circle")
      .data(renewed)
      .enter()
      .append("circle")
      .attr("cx", (d, j) => (j % 100) * 100 + 50)
      .attr("cy", (d, j) => Math.floor(j / 100) * 100 + 50)
      .attr("r", (d, j) => (renewed[j] == 1 ? 35 : 0))
      .attr("stroke", "grey")
      .attr("stroke-width", (d, i) => (renewed[i] == 1 ? "0.135rem" : "0px"))
      .attr("fill", (d, i) => (renewed[i] == 1 ? "red" : "#263238"))
      .on("mouseover", (d, i) => this.shoot(i, "he"));
  }
  update(e, num) {
    var pos = this.position(e);
    let p = pos.findIndex((i) => i == 2);
    var circle = svg.select(".player").selectAll("circle");
    circle.data(pos).enter();
    circle
      .transition()
      .duration(100)
      .attr("r", (d, i) => (d == 2 ? num : 0))
      .attr("stroke", "grey")
      .attr("stroke-width", (d, i) => (d == 2 ? "0.135rem" : "0px"))
      .attr("fill", (d) => (d == 2 ? "green" : "#263238"));
    document
      .getElementById("board")
      .scrollTo(
        (this.state.moves % 100) * 100 - wdd,
        Math.floor(this.state.moves / 100) * 100 - hdd
      );
  }
  ene() {
    var pos = state.ren;
    var circle = svg.select(".enemies").selectAll("circle");
    circle.data(pos).enter();
    circle
      .transition()
      .duration(1000)
      .attr("r", (d, i) => (d == 1 ? 35 : 0))
      .attr("stroke", "grey")
      .attr("stroke-width", (d, i) => (d == 1 ? "0.135rem" : "0px"))
      .attr("class", "enemos")
      .attr("fill", (d) => (d == 1 ? "red" : "#263238"));
  }
  boss() {
    po = Math.floor(Math.random() * 100) * Math.floor(Math.random() * 100);
    if (
      state.ren[po] == 1 ||
      state.pos[po] == 1 ||
      state.pos[po + 1] == 1 ||
      state.pos[po - 1] == 1 ||
      state.pos[po - 100] == 1 ||
      state.pos[po + 100] == 1 ||
      state.pos[po - 99] == 1 ||
      state.pos[po - 101] == 1 ||
      state.pos[po + 99] == 1 ||
      state.pos[po + 101] == 1
    ) {
      this.boss();
    } else {
      svg
        .append("g")
        .attr("class", "boss")
        .append("circle")
        .attr("cx", (po % 100) * 100 + 50)
        .attr("cy", Math.floor(po / 100) * 100 + 50)
        .attr("r", 100)
        .attr("fill", "red")
        .attr("stroke", "grey")
        .attr("stroke-width", "0.15rem");
    }
    setInterval(() => {
      this.shoot(po, "he");
    }, 1500);
  }
  collide(e) {
    var enemy = state.ren;
    var obs = state.pos;
    if (enemy[e] == 1 || obs[e] == 1) {
      return true;
    }
    return false;
  }
  battle(e, f) {
    let xp = this.state.xp;
    if (this.state.enemy_count > 0) {
      if (state.ren[e] == 1 && !f) {
        document.getElementById("score").style.display = "block";
        state.ren[e] = 0;
        this.setState({
          xp: this.state.xp + 100,
          enemy_count: this.state.enemy_count - 1
        });
        this.ene();
      } else if (e == state.moves) {
        document.getElementById("lose").style.display = "block";
        this.setState({ xp: this.state.xp - 500 });
      }
    } else {
      if (!po) {
        this.boss();
        this.setState({
          hint:
            "You'll find the boss at " +
            "Column: " +
            (po % 100) +
            ", Row:" +
            Math.floor(po / 100)
        });
        document.getElementById("hint").style.display = "block";
      } else {
        if (e == po) {
          document.getElementById("score").style.display = "block";
          this.setState({
            xp: this.state.xp + 100,
            boss_xp: this.state.boss_xp - 100
          });
        } else if (e == state.moves) {
          document.getElementById("lose").style.display = "block";
          this.setState({
            xp: this.state.xp - 200,
            boss_xp: this.state.boss_xp + 200
          });
        }
      }
    }
    if (this.state.xp <= 0) {
      this.update(state.moves, 0);
      document.getElementById("lose").innerHTML += "<br>You Lose";
      document.getElementById("lose").style.display = "block";
      clearInterval(veer);
      show(2);
    } else if (this.state.boss_xp <= 0) {
      document.getElementById("score").innerHTML += "<br>You Win!";
      document.getElementById("score").style.display = "block";
      clearInterval(veer);
      show(2);
    }
    setTimeout(() => {
      document.getElementById("score").style.display = "none";
      document.getElementById("lose").style.display = "none";
    }, 750);
  }
  shoot(e, f) {
    svg.select(".gun").remove();
    if (!f) {
      this.setState({ xp: this.state.xp - 25 });
    }
    var datum = [e + 1, e - 1, e + 100, e - 100];
    svg
      .append("g")
      .attr("class", "gun")
      .selectAll("circle")
      .data(datum)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => (d % 100) * 100 + 50)
      .attr("cy", (d, i) => Math.floor(d / 100) * 100 + 50)
      .attr("r", (d, i) => (this.collide(i) ? 0 : 15))
      .attr("stroke", "red")
      .attr("stroke-width", "0.12em")
      .attr("fill", "yellow");
    for (let k = 0; k < 3; k++) {
      for (let j = 0; j < datum.length; j++) {
        if (f) {
          this.battle(datum[j], f);
        } else {
          this.battle(datum[j]);
        }
        if (j == 0 || j == 2) {
          datum[j] =
            j == 0
              ? datum[j] +
                (state.ren[datum[j]] == 1 || state.pos[datum[j]] == 1
                  ? 0
                  : datum[j] % 100 > 98
                  ? 0
                  : 1)
              : datum[j] +
                (state.ren[datum[j]] == 1 || state.pos[datum[j]] == 1
                  ? 0
                  : Math.floor(datum[j] / 100) > 98
                  ? 0
                  : 100);
        } else {
          datum[j] =
            j == 1
              ? datum[j] -
                (state.ren[datum[j]] == 1 || state.pos[datum[j]] == 1
                  ? 0
                  : datum[j] % 100 < 1
                  ? 0
                  : 1)
              : datum[j] -
                (state.ren[datum[j]] == 1 || state.pos[datum[j]] == 1
                  ? 0
                  : datum[j] - 100 < 0
                  ? 0
                  : 100);
        }
      }
      var bull = svg.select(".gun").selectAll("circle");
      bull.data(datum).enter();
      bull
        .transition()
        .duration(750)
        .attr("cx", (d, i) => (d % 100) * 100 + 50)
        .attr("cy", (d, i) => Math.floor(d / 100) * 100 + 50)
        .attr("r", (d, i) => (this.collide(i) ? 0 : k == 2 ? 0 : 15))
        .attr("stroke", "red")
        .attr("stroke-width", "0.12em")
        .attr("fill", "yellow");
    }
  }
  orient() {
    document
      .getElementById("board")
      .scrollTo(
        (this.state.moves % 100) * 100 - wdd,
        Math.floor(this.state.moves / 100) * 100 - hdd
      );
  }
  reveal() {
    let arr = [];
    state.ren.map((d, i) => {
      if (d == 1) {
        arr.push(i);
      }
    });
    let arr1 = arr.map((d) =>
      d < this.state.moves ? this.state.moves - d : d - this.state.moves
    );
    let ans = arr1.findIndex((d) => d == Math.min(...arr1));
    this.setState({
      hint:
        "Row: " + (arr[ans] % 100) + ", Column:" + Math.floor(arr[ans] / 100)
    });
    document.getElementById("hint").style.display = "block";
    setTimeout(() => {
      document.getElementById("hint").style.display = "none";
    }, 2000);
  }
  render() {
    return (
      <div className="tell">
        <div id="hint" style={{ display: "none" }}>
          {!po ? "The nearest enemy is at" : ""} {this.state.hint}
        </div>
        <div class="top">
          <h3>Column position:{this.state.moves % 100}</h3>
          <h3>Row position:{Math.floor(this.state.moves / 100)}</h3>
          <button onClick={this.reveal}>Help?</button>
        </div>
        <div class="top">
          <h3>Mines remaining:{this.state.enemy_count}</h3>
          <h3>
            XP:{this.state.xp}XP <br />{" "}
            {po ? "Boss XP " + this.state.boss_xp + "XP" : ""}
          </h3>
          <button onClick={this.orient}>Reorient Player</button>
        </div>
        <div className="board" id="board">
          <svg className="let" width="10000" height="10000"></svg>
        </div>
        <div id="score" class="tint" style={{ display: "none" }}>
          +100XP!
        </div>
        <div id="lose" style={{ display: "none" }}>
          {po ? "-200XP!" : "-500XP!"}
        </div>
      </div>
    );
  }
}
function show(e) {
  this.setState({ show: e });
}
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: 1
    };
    show = show.bind(this);
  }
  render() {
    let t;
    if (this.state.show == 1) {
      t = <Main1 />;
    } else {
      t = this.state.show == 2 ? <Main2 /> : <Main3 />;
    }
    return <div className="total">{t}</div>;
  }
}
ReactDOM.render(<Main />, document.getElementById("root"));
