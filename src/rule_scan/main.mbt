priv struct Rule {
  name : String
  birth_mask : Int
  survive_mask : Int
  density_per_1000 : Int
}

priv struct RunStats {
  score : Double
  mean_density : Double
  mean_activity : Double
  repeat_rate : Double
}

let board_size : Int = 64
let burn_in_steps : Int = 64
let measure_steps : Int = 96
let recent_hash_count : Int = 8

fn mask_for(values : Array[Int]) -> Int {
  let mut mask = 0
  for i = 0; i < values.length(); i = i + 1 {
    mask = mask | (1 << values[i])
  }
  mask
}

fn rule(name : String, birth : Array[Int], survive : Array[Int], density_per_1000 : Int) -> Rule {
  {
    name,
    birth_mask: mask_for(birth),
    survive_mask: mask_for(survive),
    density_per_1000,
  }
}

fn mask_contains(mask : Int, value : Int) -> Bool {
  ((mask >> value) & 1) == 1
}

fn make_int_array(length : Int, value : Int) -> Array[Int] {
  let arr : Array[Int] = []
  for i = 0; i < length; i = i + 1 {
    arr.push(value)
  }
  arr
}

fn next_random(state : Int) -> Int {
  (state * 173 + 139) % 1000003
}

fn seed_board(board : Array[Int], r : Rule) -> Unit {
  let mut random = (
    r.birth_mask * 2003 + r.survive_mask * 9176 + r.density_per_1000 * 37 + 1
  ) % 1000003
  for i = 0; i < board.length(); i = i + 1 {
    random = next_random(random)
    board[i] = if random % 1000 < r.density_per_1000 { 1 } else { 0 }
  }
}

fn step_board(current : Array[Int], next : Array[Int], r : Rule) -> Int {
  let mut changed = 0
  for y = 0; y < board_size; y = y + 1 {
    let up = if y == 0 { board_size - 1 } else { y - 1 }
    let down = if y + 1 == board_size { 0 } else { y + 1 }
    for x = 0; x < board_size; x = x + 1 {
      let left = if x == 0 { board_size - 1 } else { x - 1 }
      let right = if x + 1 == board_size { 0 } else { x + 1 }
      let count =
        current[up * board_size + left] +
        current[up * board_size + x] +
        current[up * board_size + right] +
        current[y * board_size + left] +
        current[y * board_size + right] +
        current[down * board_size + left] +
        current[down * board_size + x] +
        current[down * board_size + right]
      let index = y * board_size + x
      let old = current[index]
      let mask = if old == 1 { r.survive_mask } else { r.birth_mask }
      let value = if mask_contains(mask, count) { 1 } else { 0 }
      next[index] = value
      if value != old {
        changed += 1
      }
    }
  }
  changed
}

fn swap_boards(current : Array[Int], next : Array[Int]) -> Unit {
  for i = 0; i < current.length(); i = i + 1 {
    let value = current[i]
    current[i] = next[i]
    next[i] = value
  }
}

fn board_density(board : Array[Int]) -> Double {
  let mut live = 0
  for i = 0; i < board.length(); i = i + 1 {
    live += board[i]
  }
  live.to_double() / board.length().to_double()
}

fn board_hash(board : Array[Int]) -> Int {
  let mut hash = 216613
  for i = 0; i < board.length(); i = i + 1 {
    hash = (hash * 167 + board[i] + i) % 1000003
  }
  hash
}

fn has_recent_hash(recent : Array[Int], hash : Int) -> Bool {
  let mut found = false
  for i = 0; i < recent.length(); i = i + 1 {
    if recent[i] == hash {
      found = true
    }
  }
  found
}

fn record_recent_hash(recent : Array[Int], hash : Int, index : Int) -> Unit {
  recent[index % recent.length()] = hash
}

fn pattern_diversity_2x2(board : Array[Int]) -> Double {
  let counts = make_int_array(16, 0)
  for y = 0; y < board_size; y = y + 1 {
    let down = if y + 1 == board_size { 0 } else { y + 1 }
    for x = 0; x < board_size; x = x + 1 {
      let right = if x + 1 == board_size { 0 } else { x + 1 }
      let pattern =
        board[y * board_size + x] +
        2 * board[down * board_size + x] +
        4 * board[y * board_size + right] +
        8 * board[down * board_size + right]
      counts[pattern] += 1
    }
  }
  let total = (board_size * board_size).to_double()
  let mut concentration = 0.0
  for i = 0; i < counts.length(); i = i + 1 {
    let p = counts[i].to_double() / total
    concentration += p * p
  }
  (1.0 - concentration) / (15.0 / 16.0)
}

fn closeness(value : Double, target : Double, width : Double) -> Double {
  let distance = (value - target).abs()
  let score = 1.0 - distance / width
  if score < 0.0 { 0.0 } else if score > 1.0 { 1.0 } else { score }
}

fn score_rule(r : Rule) -> RunStats {
  let board_cells = board_size * board_size
  let current = make_int_array(board_cells, 0)
  let next = make_int_array(board_cells, 0)
  seed_board(current, r)
  for i = 0; i < burn_in_steps; i = i + 1 {
    ignore(step_board(current, next, r))
    swap_boards(current, next)
  }
  let recent = make_int_array(recent_hash_count, -1)
  let mut repeat_count = 0
  let mut density_total = 0.0
  let mut activity_total = 0.0
  for step = 0; step < measure_steps; step = step + 1 {
    let changed = step_board(current, next, r)
    swap_boards(current, next)
    let hash = board_hash(current)
    if has_recent_hash(recent, hash) {
      repeat_count += 1
    }
    record_recent_hash(recent, hash, step)
    density_total += board_density(current)
    activity_total += changed.to_double() / board_cells.to_double()
  }
  let mean_density = density_total / measure_steps.to_double()
  let mean_activity = activity_total / measure_steps.to_double()
  let repeat_rate = repeat_count.to_double() / measure_steps.to_double()
  let score = if mean_density < 0.002 || mean_density > 0.98 || mean_activity < 0.0005 {
    0.0
  } else {
    let density_score = closeness(mean_density, 0.22, 0.22)
    let activity_score = closeness(mean_activity, 0.07, 0.12)
    let diversity_score = closeness(pattern_diversity_2x2(current), 0.68, 0.42)
    density_score * activity_score * (0.35 + 0.65 * diversity_score) * (1.0 - repeat_rate)
  }
  { score, mean_density, mean_activity, repeat_rate }
}

fn print_score(r : Rule) -> Unit {
  let stats = score_rule(r)
  println(
    "\{r.name}\t\{r.density_per_1000.to_double() / 10.0}%\t\{stats.score}\t\{stats.mean_density}\t\{stats.mean_activity}\t\{stats.repeat_rate}",
  )
}

fn main {
  let rules : Array[Rule] = [
    rule("B3/S23", [3], [2, 3], 140),
    rule("B36/S23", [3, 6], [2, 3], 100),
    rule("B37/S23", [3, 7], [2, 3], 80),
    rule("B3/S238", [3], [2, 3, 8], 120),
    rule("B3/S023", [3], [0, 2, 3], 80),
    rule("B36/S125", [3, 6], [1, 2, 5], 80),
    rule("B357/S238", [3, 5, 7], [2, 3, 8], 100),
    rule("B38/S238", [3, 8], [2, 3, 8], 100),
    rule("B1357/S1357", [1, 3, 5, 7], [1, 3, 5, 7], 35),
    rule("B2/S", [2], [], 20),
    rule("B234/S", [2, 3, 4], [], 15),
    rule("B34/S34", [3, 4], [3, 4], 220),
    rule("B25/S4", [2, 5], [4], 30),
  ]
  println("rule\tdensity\tscore\tmean_density\tmean_activity\trepeat_rate")
  for i = 0; i < rules.length(); i = i + 1 {
    print_score(rules[i])
  }
}
