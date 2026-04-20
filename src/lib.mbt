enum Lang {
  Ja
  En
  Id
} derive(Eq)

fn Lang::to_string(self : Lang) -> String {
  match self {
    Ja => "ja"
    En => "en"
    Id => "id"
  }
}

struct I18n {
  eyebrow : String
  headline : String
  summary : Array[String]
  quote_text : String
  quote_author : String
  about_title : String
  about : Array[String]
  current_title : String
  current_role : String
  current_meta : String
  current_points : Array[String]
  oss_title : String
  oss_role : String
  oss_meta : String
  oss_points : Array[String]
  education_title : String
  education_school : String
  education_detail : String
  links_title : String
  link_notes : Array[String]
}

fn i18n(lang : Lang) -> I18n {
  match lang {
    Ja =>
      {
        eyebrow: "gaato.net",
        headline: "ソフトウェアを書いています。",
        summary: [
          "日本語・英語・インドネシア語でだいたい話せます。広くいろいろ触るタイプです。",
        ],
        quote_text:
          "Most of the good programmers do programming not because they expect to get paid or get adulation by the public, but because it is fun to program.",
        quote_author: "Linus Torvalds",
        about_title: "About",
        about: [
          "新しい技術に触れたり、手間を減らす仕組みを整えたりするのが好きです。",
          "東京の端の方で暮らしながら、hololive や言語の話を楽しんでいます。このサイトは MoonBit で書いています。",
        ],
        current_title: "Work",
        current_role: "（株）クレアンスメアードでソフトウェアエンジニアをしています",
        current_meta: "CRM / AI を活用した IoT / モバイルアプリ",
        current_points: [
          "CRM の開発や改善を進めています。",
          "AI を活用した IoT 製品の開発に関わっています。",
          "Ionic + Cordova 製アプリを Capacitor へ移行しています。",
        ],
        oss_title: "OSS",
        oss_role: "openSUSE 向けの packaging や upstream へのコントリビュートをしています",
        oss_meta: "仕事とは別の時間で続けていること",
        oss_points: [
          "openSUSE 向けのパッケージングを継続しています。",
          "karukan を openSUSE:Factory に提出し、fcitx5-karukan と karukan-tools として accepted されました。",
          "KDE の kholidays に、日本の祝日データの不足分を補う修正を送りました。",
          "2024–2027 年ぶんの日本の祝日更新が upstream にマージされています。",
        ],
        education_title: "Background",
        education_school: "東京理科大学 理学部第一部 応用数学科",
        education_detail:
          "2020.04 - 2025.03 / 数理統計学、計算機科学、数値解析を学び、卒業研究では窓付きフーリエ変換と連続ウェーブレット変換を用いた音源分離を研究しました。",
        links_title: "Links",
        link_notes: [
          "いちばんよく更新している場所です。",
          "@gaato11 です。いちばん雑に近況を書いています。",
          "hololive や言語学習について書いています。",
          "VTuber ファン向けの言語交流 Discord サーバーです。",
          "仕事まわりのプロフィールです。",
          "日本語で書いた記事です。",
          "短めのメモや記事です。",
          "karukan などのパッケージやビルド作業です。",
          "openSUSE 側の活動です。",
          "kholidays など KDE 側の活動です。",
        ],
      }
    En =>
      {
        eyebrow: "gaato.net",
        headline: "I write software.",
        summary: [
          "I am generally fine in Japanese, English, and Indonesian. I tend to work across a fairly wide range of things.",
        ],
        quote_text:
          "Most of the good programmers do programming not because they expect to get paid or get adulation by the public, but because it is fun to program.",
        quote_author: "Linus Torvalds",
        about_title: "About",
        about: [
          "I like getting my hands on new technology and building small systems that reduce friction.",
          "I live on the outskirts of Tokyo. I like hololive and languages, and this site is written in MoonBit.",
        ],
        current_title: "Work",
        current_role: "Software Engineer at Cleansmaerd Inc.",
        current_meta: "CRM / AI-assisted IoT / mobile apps",
        current_points: [
          "Working on CRM development and improvements.",
          "Building AI-assisted IoT products.",
          "Migrating an Ionic + Cordova application to Capacitor.",
        ],
        oss_title: "OSS",
        oss_role: "I do openSUSE packaging work and contribute upstream outside my day job",
        oss_meta: "separate from work",
        oss_points: [
          "I keep doing packaging work for openSUSE.",
          "Submitted karukan to openSUSE:Factory, where it was accepted as fcitx5-karukan and karukan-tools.",
          "I sent fixes to KDE's kholidays to fill in missing Japanese holiday data.",
          "The Japanese holiday updates for 2024-2027 have been merged upstream.",
        ],
        education_title: "Background",
        education_school:
          "Tokyo University of Science / Faculty of Science Division I / Department of Applied Mathematics",
        education_detail:
          "2020.04 - 2025.03 / Studied mathematical statistics, computer science, and numerical analysis, then researched source separation with STFT and continuous wavelet transform.",
        links_title: "Links",
        link_notes: [
          "Where most of my code ends up.",
          "I am @gaato11 there, and it is where I post the most casually.",
          "I write there about hololive and language learning.",
          "A language exchange Discord server for VTuber fans.",
          "A work-oriented profile.",
          "Articles written in Japanese.",
          "Short notes and posts.",
          "Packaging and build work, including karukan.",
          "openSUSE-side activity.",
          "KDE-side activity, including kholidays.",
        ],
      }
    Id =>
      {
        eyebrow: "gaato.net",
        headline: "Saya menulis perangkat lunak.",
        summary: [
          "Saya umumnya nyaman memakai bahasa Jepang, Inggris, dan Indonesia. Saya cenderung mengerjakan banyak hal yang cukup beragam.",
        ],
        quote_text:
          "Most of the good programmers do programming not because they expect to get paid or get adulation by the public, but because it is fun to program.",
        quote_author: "Linus Torvalds",
        about_title: "Tentang",
        about: [
          "Saya suka menyentuh teknologi baru dan membuat sistem kecil yang mengurangi kerepotan.",
          "Saya tinggal di pinggiran Tokyo. Saya suka hololive dan bahasa, dan situs ini ditulis dengan MoonBit.",
        ],
        current_title: "Pekerjaan",
        current_role: "Software Engineer di Cleansmaerd Inc.",
        current_meta: "CRM / IoT berbantuan AI / aplikasi mobile",
        current_points: [
          "Mengerjakan pengembangan dan perbaikan CRM.",
          "Terlibat dalam pengembangan produk IoT berbantuan AI.",
          "Memigrasikan aplikasi Ionic + Cordova ke Capacitor.",
        ],
        oss_title: "OSS",
        oss_role: "Di luar pekerjaan saya mengerjakan packaging openSUSE dan kontribusi upstream",
        oss_meta: "terpisah dari pekerjaan",
        oss_points: [
          "Saya terus mengerjakan packaging untuk openSUSE.",
          "Saya mengirimkan karukan ke openSUSE:Factory, lalu diterima sebagai fcitx5-karukan dan karukan-tools.",
          "Saya juga mengirim perbaikan ke kholidays milik KDE untuk melengkapi data hari libur Jepang.",
          "Pembaruan hari libur Jepang untuk 2024-2027 sudah di-merge ke upstream.",
        ],
        education_title: "Latar Belakang",
        education_school:
          "Tokyo University of Science / Fakultas Sains Divisi I / Departemen Matematika Terapan",
        education_detail:
          "2020.04 - 2025.03 / Mempelajari statistika matematika, ilmu komputer, dan analisis numerik, lalu meneliti pemisahan sumber suara dengan STFT dan continuous wavelet transform.",
        links_title: "Tautan",
        link_notes: [
          "Tempat yang paling sering saya perbarui.",
          "Akun saya di sana adalah @gaato11, dan itulah tempat saya menulis paling santai.",
          "Saya menulis di sana tentang hololive dan belajar bahasa.",
          "Server Discord pertukaran bahasa untuk penggemar VTuber.",
          "Profil yang lebih berorientasi kerja.",
          "Artikel dalam bahasa Jepang.",
          "Catatan dan tulisan pendek.",
          "Pekerjaan packaging dan build, termasuk karukan.",
          "Aktivitas di sisi openSUSE.",
          "Aktivitas di sisi KDE, termasuk kholidays.",
        ],
      }
  }
}

struct ProfileLink {
  label : String
  url : String
}

fn links() -> Array[ProfileLink] {
  [
    { label: "GitHub", url: "https://github.com/gaato" },
    { label: "X / Twitter", url: "https://x.com/gaato11" },
    { label: "note", url: "https://note.com/gaato" },
    { label: "HoloLang Exchange", url: "https://join.hololang.exchange/" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/gaato" },
    { label: "Qiita", url: "https://qiita.com/gaato" },
    { label: "Zenn", url: "https://zenn.dev/gaato" },
    { label: "openSUSE Build Service", url: "https://build.opensuse.org/users/gaato" },
    { label: "openSUSE Gitea", url: "https://src.opensuse.org/gaato" },
    { label: "KDE GitLab", url: "https://invent.kde.org/gaato" },
  ]
}

const BG_CLASS = "background-automaton"
const BG_MAX_DPR = 2.0
const BG_BASE_STEP_MS = 140.0
const BG_REDUCED_STEP_MS = 520.0
const BG_MIN_CELL_SIZE = 10
const BG_MAX_CELL_SIZE = 18
const BG_TARGET_COLS = 72
const BG_NOISE_REFRESH_INTERVAL = 18

struct AutomatonRule {
  birth : Array[Int]
  survive : Array[Int]
}

fn automaton_rules() -> Array[AutomatonRule] {
  [
    { birth: [3], survive: [2, 3] },
    { birth: [3, 6], survive: [2, 3] },
    { birth: [3], survive: [1, 2, 3, 4, 5] },
    { birth: [3, 6, 7, 8], survive: [3, 4, 6, 7, 8] },
    { birth: [4, 6, 7, 8], survive: [3, 5, 6, 7, 8] },
  ]
}

fn random_automaton_rule() -> AutomatonRule {
  let rules = automaton_rules()
  rules[random_index(rules.length())]
}

priv struct BackgroundState {
  win : @js_dom.Window
  canvas : @js_dom.HTMLCanvasElement
  ctx : @canvas.CanvasRenderingContext2D
  rule : AutomatonRule
  mut last_time : Double
  mut accumulated : Double
  mut width : Int
  mut height : Int
  mut dpr : Double
  mut cell_size : Int
  mut columns : Int
  mut rows : Int
  mut generation : Int
  mut current : Array[Int]
  mut next : Array[Int]
  mut energy : Array[Double]
  mut reduced_motion : Bool
}

extern "js" fn prefers_reduced_motion(win : @js_dom.Window) -> Bool =
  #|(win) => win.matchMedia("(prefers-reduced-motion: reduce)").matches

fn clamp_int(value : Int, lower : Int, upper : Int) -> Int {
  if value < lower {
    lower
  } else if value > upper {
    upper
  } else {
    value
  }
}

fn max_double(left : Double, right : Double) -> Double {
  if left > right {
    left
  } else {
    right
  }
}

fn min_double(left : Double, right : Double) -> Double {
  if left < right {
    left
  } else {
    right
  }
}

fn ceil_div(value : Int, divisor : Int) -> Int {
  (value + divisor - 1) / divisor
}

fn make_int_array(length : Int) -> Array[Int] {
  let arr : Array[Int] = []
  for i = 0; i < length; i = i + 1 {
    arr.push(0)
  }
  arr
}

fn make_double_array(length : Int) -> Array[Double] {
  let arr : Array[Double] = []
  for i = 0; i < length; i = i + 1 {
    arr.push(0.0)
  }
  arr
}

fn wrap_index(value : Int, size : Int) -> Int {
  if value < 0 {
    value + size
  } else if value >= size {
    value - size
  } else {
    value
  }
}

fn random_index(limit : Int) -> Int {
  @math.Math::floor(@math.Math::random() * limit.to_double())
}

fn contains_neighbor_count(values : Array[Int], target : Int) -> Bool {
  for value in values {
    if value == target {
      return true
    }
  }
  false
}

fn ensure_background_canvas(doc : @js_dom.Document) -> @js_dom.HTMLCanvasElement {
  match doc.querySelector("." + BG_CLASS) {
    Some(existing) => existing.as_any().cast()
    None => {
      let canvas : @js_dom.HTMLCanvasElement = doc.createElement("canvas").as_any().cast()
      canvas.as_element().setClassName(BG_CLASS)
      canvas.as_element().setAttribute("aria-hidden", "true")
      match doc.body() {
        Some(body) => body.as_element().prepend([canvas.as_node()])
        None => ()
      }
      canvas
    }
  }
}

fn render_background(state : BackgroundState) -> Unit {
  state.ctx.clearRect(0.0, 0.0, state.width.to_double(), state.height.to_double())
  for row = 0; row < state.rows; row = row + 1 {
    for column = 0; column < state.columns; column = column + 1 {
      let index = row * state.columns + column
      let value = state.energy[index]
      if value >= 0.03 {
        let x = (column * state.cell_size).to_double()
        let y = (row * state.cell_size).to_double()
        let inset = state.cell_size.to_double() * 0.08
        let glow = if state.current[index] == 1 { value } else { value * 0.72 }
        let red = @math.Math::round(8.0 + glow * 10.0)
        let green = @math.Math::round(102.0 + glow * 64.0)
        let blue = @math.Math::round(108.0 + glow * 82.0)
        let alpha = 0.14 + glow * 0.32
        state.ctx.fillStyle = "rgba(" +
          red.to_string() +
          ", " +
          green.to_string() +
          ", " +
          blue.to_string() +
          ", " +
          alpha.to_string() +
          ")"
        state.ctx.fillRect(
          x + inset,
          y + inset,
          state.cell_size.to_double() - inset * 2.0,
          state.cell_size.to_double() - inset * 2.0,
        )
      }
    }
  }
}

fn inject_noise(state : BackgroundState, strength : Double) -> Unit {
  let count = @math.Math::round(state.current.length().to_double() * strength * 0.18)
  let splashes = if count > 4 { count } else { 4 }
  for i = 0; i < splashes; i = i + 1 {
    let anchor_column = random_index(state.columns)
    let anchor_row = random_index(state.rows)
    for row_offset = -1; row_offset <= 1; row_offset = row_offset + 1 {
      for column_offset = -1; column_offset <= 1; column_offset = column_offset + 1 {
        let row = wrap_index(anchor_row + row_offset, state.rows)
        let column = wrap_index(anchor_column + column_offset, state.columns)
        let cell_index = row * state.columns + column
        if @math.Math::random() > 0.45 {
          state.next[cell_index] = 1
          state.energy[cell_index] = max_double(state.energy[cell_index], 0.45)
        }
      }
    }
  }
}

fn seed_background(state : BackgroundState) -> Unit {
  for index = 0; index < state.current.length(); index = index + 1 {
    let alive = if @math.Math::random() > 0.81 { 1 } else { 0 }
    state.current[index] = alive
    state.next[index] = 0
    state.energy[index] = if alive == 1 {
      0.6 + @math.Math::random() * 0.3
    } else {
      0.0
    }
  }
  inject_noise(state, 0.12)
  state.generation = 1
}

fn count_neighbors(state : BackgroundState, row : Int, column : Int) -> Int {
  let mut count = 0
  for row_offset = -1; row_offset <= 1; row_offset = row_offset + 1 {
    for column_offset = -1; column_offset <= 1; column_offset = column_offset + 1 {
      if row_offset != 0 || column_offset != 0 {
        let neighbor_row = wrap_index(row + row_offset, state.rows)
        let neighbor_column = wrap_index(column + column_offset, state.columns)
        count += state.current[neighbor_row * state.columns + neighbor_column]
      }
    }
  }
  count
}

fn step_background(state : BackgroundState) -> Unit {
  let mut alive_count = 0
  for row = 0; row < state.rows; row = row + 1 {
    for column = 0; column < state.columns; column = column + 1 {
      let index = row * state.columns + column
      let alive = state.current[index] == 1
      let neighbors = count_neighbors(state, row, column)
      let next_alive = if alive {
        if contains_neighbor_count(state.rule.survive, neighbors) { 1 } else { 0 }
      } else if contains_neighbor_count(state.rule.birth, neighbors) {
        1
      } else {
        0
      }
      state.next[index] = next_alive
      let previous_energy = state.energy[index]
      state.energy[index] = if next_alive == 1 {
        min_double(1.0, previous_energy + 0.18)
      } else {
        max_double(0.0, previous_energy - 0.055)
      }
      alive_count += next_alive
    }
  }
  if alive_count < @math.Math::round((state.columns * state.rows).to_double() * 0.08) ||
    state.generation % BG_NOISE_REFRESH_INTERVAL == 0 {
    inject_noise(state, 0.045)
  }
  let current = state.current
  state.current = state.next
  state.next = current
  state.generation += 1
}

fn resize_background(state : BackgroundState) -> Unit {
  state.width = state.win.innerWidth()
  state.height = state.win.innerHeight()
  state.dpr = min_double(state.win.devicePixelRatio(), BG_MAX_DPR)
  state.reduced_motion = prefers_reduced_motion(state.win)
  state.cell_size = clamp_int(
    @math.Math::round(state.width.to_double() / BG_TARGET_COLS.to_double()),
    BG_MIN_CELL_SIZE,
    BG_MAX_CELL_SIZE,
  )
  state.columns = ceil_div(state.width, state.cell_size)
  state.rows = ceil_div(state.height, state.cell_size)
  state.canvas.width = @math.Math::round(state.width.to_double() * state.dpr)
  state.canvas.height = @math.Math::round(state.height.to_double() * state.dpr)
  state.ctx.setTransform(state.dpr, 0.0, 0.0, state.dpr, 0.0, 0.0)
  let cell_count = state.columns * state.rows
  state.current = make_int_array(cell_count)
  state.next = make_int_array(cell_count)
  state.energy = make_double_array(cell_count)
  seed_background(state)
  render_background(state)
}

fn schedule_background_frame(state : BackgroundState) -> Unit {
  state.win.requestAnimationFrame(fn(time) {
    if state.last_time == 0.0 {
      state.last_time = time
    }
    let mut delta = time - state.last_time
    if delta > 1000.0 {
      delta = 1000.0
    }
    state.last_time = time
    state.accumulated += delta
    let step_ms = if state.reduced_motion {
      BG_REDUCED_STEP_MS
    } else {
      BG_BASE_STEP_MS
    }
    while state.accumulated >= step_ms {
      step_background(state)
      state.accumulated -= step_ms
    }
    render_background(state)
    schedule_background_frame(state)
  })
  |> ignore
}

fn mount_cellular_background() -> Unit {
  let doc = @js_dom.document()
  let win = @js_dom.window()
  let canvas = ensure_background_canvas(doc)
  let ctx : @canvas.CanvasRenderingContext2D = canvas.getContext("2d").cast()
  let rule = random_automaton_rule()
  let state : BackgroundState = {
    win,
    canvas,
    ctx,
    rule,
    last_time: 0.0,
    accumulated: 0.0,
    width: 0,
    height: 0,
    dpr: 1.0,
    cell_size: BG_MIN_CELL_SIZE,
    columns: 0,
    rows: 0,
    generation: 0,
    current: [],
    next: [],
    energy: [],
    reduced_motion: false,
  }
  resize_background(state)
  win.as_event_target().addEventListener("resize", _ => resize_background(state))
  schedule_background_frame(state)
}

fn lang_button(
  lang : Lang,
  current : @signal.Signal[Lang]
) -> @dom.DomNode {
  @dom.button(
    on=@dom.events().click(fn(_) { current.set(lang) }),
    dyn_attrs=[
      (
        "data-active",
        @dom.AttrValue::Dynamic(fn() {
          if current.get() == lang {
            "true"
          } else {
            "false"
          }
        }),
      ),
    ],
    [@dom.text(lang.to_string())],
  )
}

fn summary_line(index : Int, current : @signal.Signal[Lang]) -> @dom.DomNode {
  @dom.p([
    @dom.text_dyn(fn() { i18n(current.get()).summary[index] }),
  ])
}

fn about_line(index : Int, current : @signal.Signal[Lang]) -> @dom.DomNode {
  @dom.p([
    @dom.text_dyn(fn() { i18n(current.get()).about[index] }),
  ])
}

fn hero_quote(current : @signal.Signal[Lang]) -> @dom.DomNode {
  @dom.div(
    class="hero-quote",
    [
      @dom.p(
        class="hero-quote-text",
        [@dom.text_dyn(fn() { i18n(current.get()).quote_text })],
      ),
      @dom.p(
        class="hero-quote-author",
        [@dom.text_dyn(fn() { i18n(current.get()).quote_author })],
      ),
    ],
  )
}

fn current_point(index : Int, current : @signal.Signal[Lang]) -> @dom.DomNode {
  @dom.li([
    @dom.text_dyn(fn() { i18n(current.get()).current_points[index] }),
  ])
}

fn oss_point(index : Int, current : @signal.Signal[Lang]) -> @dom.DomNode {
  @dom.li([
    @dom.text_dyn(fn() { i18n(current.get()).oss_points[index] }),
  ])
}

fn link_card(index : Int, current : @signal.Signal[Lang]) -> @dom.DomNode {
  let link = links()[index]
  @dom.li([
    @dom.a(
      class="link-card",
      href=link.url,
      target="_blank",
      attrs=[("rel", @dom.Attr::AttrString("noopener noreferrer"))],
      [
        @dom.div(
          class="link-label-row",
          [
            @dom.p(class="link-label", [@dom.text(link.label)]),
            @dom.p(class="link-arrow", [@dom.text("↗")]),
          ],
        ),
        @dom.p(
          class="link-note",
          [
            @dom.text_dyn(fn() { i18n(current.get()).link_notes[index] }),
          ],
        ),
      ],
    ),
  ])
}

fn main {
  let current_lang : @signal.Signal[Lang] = @signal.signal(Ja)
  let doc = @js_dom.document()
  mount_cellular_background()
  match doc.getElementById("app") {
    Some(el) => {
      let app = @dom.div(
        class="page",
        [
          @dom.div(
            class="topbar",
            [
              @dom.div(
                class="eyebrow-block",
                [
                  @dom.p(
                    class="eyebrow",
                    [@dom.text_dyn(fn() { i18n(current_lang.get()).eyebrow })],
                  ),
                ],
              ),
              @dom.div(
                class="lang-switcher",
                [
                  lang_button(Ja, current_lang),
                  lang_button(En, current_lang),
                  lang_button(Id, current_lang),
                ],
              ),
            ],
          ),
          @dom.div(
            class="panel hero",
            [
              @dom.h1([@dom.text("がーと / gaato")]),
              @dom.p(
                class="headline",
                [@dom.text_dyn(fn() { i18n(current_lang.get()).headline })],
              ),
              @dom.div(
                class="summary",
                [
                  summary_line(0, current_lang),
                ],
              ),
              hero_quote(current_lang),
            ],
          ),
          @dom.div(
            class="section-grid",
            [
              @dom.div(
                class="panel",
                [
                  @dom.h2(
                    class="section-title",
                    [@dom.text_dyn(fn() { i18n(current_lang.get()).about_title })],
                  ),
                  @dom.div(
                    class="stack",
                    [
                      about_line(0, current_lang),
                      about_line(1, current_lang),
                    ],
                  ),
                ],
              ),
              @dom.div(
                class="panel",
                [
                  @dom.h2(
                    class="section-title",
                    [@dom.text_dyn(fn() { i18n(current_lang.get()).current_title })],
                  ),
                  @dom.p(
                    class="card-title",
                    [@dom.text_dyn(fn() { i18n(current_lang.get()).current_role })],
                  ),
                  @dom.p(
                    class="meta-line",
                    [@dom.text_dyn(fn() { i18n(current_lang.get()).current_meta })],
                  ),
                  @dom.ul(
                    class="detail-list",
                    [
                      current_point(0, current_lang),
                      current_point(1, current_lang),
                      current_point(2, current_lang),
                    ],
                  ),
                ],
              ),
              @dom.div(
                class="panel",
                [
                  @dom.h2(
                    class="section-title",
                    [@dom.text_dyn(fn() { i18n(current_lang.get()).oss_title })],
                  ),
                  @dom.p(
                    class="card-title",
                    [@dom.text_dyn(fn() { i18n(current_lang.get()).oss_role })],
                  ),
                  @dom.p(
                    class="meta-line",
                    [@dom.text_dyn(fn() { i18n(current_lang.get()).oss_meta })],
                  ),
                  @dom.ul(
                    class="detail-list",
                    [
                      oss_point(0, current_lang),
                      oss_point(1, current_lang),
                      oss_point(2, current_lang),
                      oss_point(3, current_lang),
                    ],
                  ),
                ],
              ),
              @dom.div(
                class="panel",
                [
                  @dom.h2(
                    class="section-title",
                    [@dom.text_dyn(fn() { i18n(current_lang.get()).education_title })],
                  ),
                  @dom.p(
                    class="card-title",
                    [@dom.text_dyn(fn() { i18n(current_lang.get()).education_school })],
                  ),
                  @dom.p(
                    class="meta-line",
                    [@dom.text_dyn(fn() { i18n(current_lang.get()).education_detail })],
                  ),
                ],
              ),
            ],
          ),
          @dom.div(
            class="panel",
            [
              @dom.h2(
                class="section-title",
                [@dom.text_dyn(fn() { i18n(current_lang.get()).links_title })],
              ),
              @dom.ul(
                class="links",
                [
                  link_card(0, current_lang),
                  link_card(1, current_lang),
                  link_card(2, current_lang),
                  link_card(3, current_lang),
                  link_card(4, current_lang),
                  link_card(5, current_lang),
                  link_card(6, current_lang),
                  link_card(7, current_lang),
                  link_card(8, current_lang),
                  link_card(9, current_lang),
                ],
              ),
            ],
          ),
        ],
      )
      @dom.render(el |> @dom.DomElement::from_jsdom, app)
    }
    None => ()
  }
}
