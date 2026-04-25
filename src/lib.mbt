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
  links_title : String
  link_notes : Array[String]
}

fn i18n(lang : Lang) -> I18n {
  match lang {
    Ja =>
      {
        eyebrow: "gaato.net",
        headline: "がーと / gaato",
        summary: [
          "数学と技術と語学とVTuberが好きです。",
        ],
        links_title: "Links",
        link_notes: [
          "コードと実験",
          "オタク活動",
          "記事",
          "技術メモ",
          "数学",
          "openSUSE packaging",
        ],
      }
    En =>
      {
        eyebrow: "gaato.net",
        headline: "がーと / gaato",
        summary: [
          "I like mathematics, technology, languages, and VTubers.",
        ],
        links_title: "Links",
        link_notes: [
          "Code and experiments",
          "Otaku activity",
          "Articles",
          "Technical notes",
          "Mathematics",
          "openSUSE packaging",
        ],
      }
    Id =>
      {
        eyebrow: "gaato.net",
        headline: "がーと / gaato",
        summary: [
          "Saya suka matematika, teknologi, bahasa, dan VTuber.",
        ],
        links_title: "Tautan",
        link_notes: [
          "Kode dan eksperimen",
          "Aktivitas otaku",
          "Artikel",
          "Catatan teknis",
          "Matematika",
          "Packaging openSUSE",
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
    { label: "Zenn", url: "https://zenn.dev/gaato" },
    { label: "Mathlog", url: "https://mathlog.info/users/368" },
    { label: "openSUSE Build Service", url: "https://build.opensuse.org/users/gaato" },
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

struct AutomatonPalette {
  red : Double
  green : Double
  blue : Double
  red_gain : Double
  green_gain : Double
  blue_gain : Double
  alpha_base : Double
  alpha_gain : Double
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
  palette : AutomatonPalette
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

extern "js" fn start_background_after_paint(callback : () -> Unit) -> Unit =
  #|(callback) => {
  #|  const start = () => {
  #|    if ("requestAnimationFrame" in globalThis) {
  #|      requestAnimationFrame(() => requestAnimationFrame(callback))
  #|    } else {
  #|      setTimeout(callback, 0)
  #|    }
  #|  }
  #|  if (document.readyState === "loading") {
  #|    addEventListener("DOMContentLoaded", start, { once: true })
  #|  } else {
  #|    start()
  #|  }
  #|}

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

fn min_int(left : Int, right : Int) -> Int {
  if left < right {
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

fn clamp_double(value : Double, lower : Double, upper : Double) -> Double {
  if value < lower {
    lower
  } else if value > upper {
    upper
  } else {
    value
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

fn sum_ints(values : Array[Int]) -> Int {
  let mut total = 0
  for value in values {
    total += value
  }
  total
}

fn normalized_average(values : Array[Int]) -> Double {
  if values.length() == 0 {
    0.0
  } else {
    sum_ints(values).to_double() / (values.length() * 8).to_double()
  }
}

fn seeded_unit(seed : Int) -> Double {
  (seed % 97).to_double() / 96.0
}

fn palette_for_rule(rule : AutomatonRule) -> AutomatonPalette {
  let birth_sum = sum_ints(rule.birth)
  let survive_sum = sum_ints(rule.survive)
  let birth_density = rule.birth.length().to_double() / 8.0
  let survive_density = rule.survive.length().to_double() / 8.0
  let birth_average = normalized_average(rule.birth)
  let survive_average = normalized_average(rule.survive)
  let activity = clamp_double(birth_density * 0.58 + survive_density * 0.42, 0.0, 1.0)
  let contrast = clamp_double(@math.Math::abs(birth_average - survive_average), 0.0, 1.0)
  let stability = clamp_double(1.0 - contrast * 0.82, 0.0, 1.0)
  let warm_seed = seeded_unit(
    birth_sum * 37 + survive_sum * 19 + rule.birth.length() * 53 + rule.survive.length() * 29,
  )
  let cool_seed = seeded_unit(
    birth_sum * 17 + survive_sum * 31 + rule.birth.length() * 11 + rule.survive.length() * 47,
  )
  {
    red: clamp_double(14.0 + 84.0 * warm_seed + 34.0 * contrast, 0.0, 255.0),
    green: clamp_double(58.0 + 52.0 * stability + 28.0 * activity, 0.0, 255.0),
    blue: clamp_double(68.0 + 78.0 * cool_seed + 18.0 * (1.0 - activity), 0.0, 255.0),
    red_gain: clamp_double(12.0 + 44.0 * (1.0 - survive_average) + 20.0 * warm_seed, 0.0, 255.0),
    green_gain: clamp_double(24.0 + 42.0 * stability + 16.0 * activity, 0.0, 255.0),
    blue_gain: clamp_double(22.0 + 48.0 * (1.0 - contrast) + 18.0 * cool_seed, 0.0, 255.0),
    alpha_base: clamp_double(0.11 + activity * 0.04, 0.08, 0.2),
    alpha_gain: clamp_double(0.24 + contrast * 0.09 + stability * 0.05, 0.18, 0.4),
  }
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
  let palette = state.palette
  for row = 0; row < state.rows; row = row + 1 {
    for column = 0; column < state.columns; column = column + 1 {
      let index = row * state.columns + column
      let value = state.energy[index]
      if value >= 0.03 {
        let x = (column * state.cell_size).to_double()
        let y = (row * state.cell_size).to_double()
        let inset = state.cell_size.to_double() * 0.08
        let glow = if state.current[index] == 1 { value } else { value * 0.72 }
        let red = @math.Math::round(palette.red + glow * palette.red_gain)
        let green = @math.Math::round(palette.green + glow * palette.green_gain)
        let blue = @math.Math::round(palette.blue + glow * palette.blue_gain)
        let alpha = palette.alpha_base + glow * palette.alpha_gain
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
  let old_columns = state.columns
  let old_rows = state.rows
  let old_current = state.current
  let old_next = state.next
  let old_energy = state.energy
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
  if old_columns == 0 || old_rows == 0 {
    seed_background(state)
  } else {
    let columns_to_copy = min_int(old_columns, state.columns)
    let rows_to_copy = min_int(old_rows, state.rows)
    for row = 0; row < rows_to_copy; row = row + 1 {
      for column = 0; column < columns_to_copy; column = column + 1 {
        let old_index = row * old_columns + column
        let new_index = row * state.columns + column
        state.current[new_index] = old_current[old_index]
        state.next[new_index] = old_next[old_index]
        state.energy[new_index] = old_energy[old_index]
      }
    }
    if state.columns != old_columns || state.rows != old_rows {
      inject_noise(state, 0.018)
    }
  }
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
    palette: palette_for_rule(rule),
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
              @dom.h1([@dom.text_dyn(fn() { i18n(current_lang.get()).headline })]),
              @dom.p(
                class="handle",
                [@dom.text("gaato.net")],
              ),
              @dom.div(
                class="summary",
                [
                  summary_line(0, current_lang),
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
                ],
              ),
            ],
          ),
        ],
      )
      @dom.render(el |> @dom.DomElement::from_jsdom, app)
      start_background_after_paint(fn() { mount_cellular_background() })
    }
    None => ()
  }
}
