priv struct AutomatonState {
  mut columns : Int
  mut rows : Int
  mut birth_mask : Int
  mut survive_mask : Int
  mut initial_alive_per_1000 : Int
  mut rule_index : Int
  mut palette_red : Double
  mut palette_green : Double
  mut palette_blue : Double
  mut palette_red_gain : Double
  mut palette_green_gain : Double
  mut palette_blue_gain : Double
  mut palette_alpha_base : Double
  mut palette_alpha_gain : Double
  mut seed : Int
  mut generation : Int
  mut stagnant_generations : Int
  mut current : Array[Int]
  mut next : Array[Int]
  mut energy : Array[Double]
}

priv struct AutomatonRule {
  birth_mask : Int
  survive_mask : Int
  initial_alive_per_1000 : Int
}

let state : Ref[AutomatonState?] = { val: None }

fn mask_for(values : Array[Int]) -> Int {
  let mut mask = 0
  for i = 0; i < values.length(); i = i + 1 {
    mask = mask | (1 << values[i])
  }
  mask
}

fn bs(birth : Array[Int], survive : Array[Int], initial_alive_per_1000 : Int) -> AutomatonRule {
  {
    birth_mask: mask_for(birth),
    survive_mask: mask_for(survive),
    initial_alive_per_1000,
  }
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

fn min_int(left : Int, right : Int) -> Int {
  if left < right { left } else { right }
}

fn min_double(left : Double, right : Double) -> Double {
  if left < right { left } else { right }
}

fn max_double(left : Double, right : Double) -> Double {
  if left > right { left } else { right }
}

fn clamp_double(value : Double, lower : Double, upper : Double) -> Double {
  min_double(max_double(value, lower), upper)
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

fn next_random(s : AutomatonState) -> Int {
  s.seed = (s.seed * 1664525 + 1013904223) & 0x7fffffff
  s.seed
}

fn random_index(s : AutomatonState, limit : Int) -> Int {
  if limit <= 0 { 0 } else { next_random(s) % limit }
}

fn mask_contains(mask : Int, value : Int) -> Bool {
  ((mask >> value) & 1) == 1
}

fn mask_count(mask : Int) -> Int {
  let mut count = 0
  for i = 0; i <= 8; i = i + 1 {
    if mask_contains(mask, i) {
      count += 1
    }
  }
  count
}

fn mask_sum(mask : Int) -> Int {
  let mut total = 0
  for i = 0; i <= 8; i = i + 1 {
    if mask_contains(mask, i) {
      total += i
    }
  }
  total
}

fn normalized_average(mask : Int) -> Double {
  let count = mask_count(mask)
  if count == 0 { 0.0 } else { mask_sum(mask).to_double() / (count * 8).to_double() }
}

fn seeded_unit(seed : Int) -> Double {
  (seed % 97).to_double() / 96.0
}

fn apply_palette(s : AutomatonState) -> Unit {
  let birth_sum = mask_sum(s.birth_mask)
  let survive_sum = mask_sum(s.survive_mask)
  let birth_count = mask_count(s.birth_mask)
  let survive_count = mask_count(s.survive_mask)
  let birth_density = birth_count.to_double() / 9.0
  let survive_density = survive_count.to_double() / 9.0
  let birth_average = normalized_average(s.birth_mask)
  let survive_average = normalized_average(s.survive_mask)
  let activity = clamp_double(birth_density * 0.58 + survive_density * 0.42, 0.0, 1.0)
  let contrast = clamp_double((birth_average - survive_average).abs(), 0.0, 1.0)
  let stability = clamp_double(1.0 - contrast * 0.82, 0.0, 1.0)
  let warm_seed = seeded_unit(
    birth_sum * 37 + survive_sum * 19 + birth_count * 53 + survive_count * 29,
  )
  let cool_seed = seeded_unit(
    birth_sum * 17 + survive_sum * 31 + birth_count * 11 + survive_count * 47,
  )
  s.palette_red = clamp_double(14.0 + 84.0 * warm_seed + 34.0 * contrast, 0.0, 255.0)
  s.palette_green = clamp_double(58.0 + 52.0 * stability + 28.0 * activity, 0.0, 255.0)
  s.palette_blue = clamp_double(68.0 + 78.0 * cool_seed + 18.0 * (1.0 - activity), 0.0, 255.0)
  s.palette_red_gain = clamp_double(12.0 + 44.0 * (1.0 - survive_average) + 20.0 * warm_seed, 0.0, 255.0)
  s.palette_green_gain = clamp_double(24.0 + 42.0 * stability + 16.0 * activity, 0.0, 255.0)
  s.palette_blue_gain = clamp_double(22.0 + 48.0 * (1.0 - contrast) + 18.0 * cool_seed, 0.0, 255.0)
  s.palette_alpha_base = clamp_double(0.11 + activity * 0.04, 0.08, 0.2)
  s.palette_alpha_gain = clamp_double(0.24 + contrast * 0.09 + stability * 0.05, 0.18, 0.4)
}

fn select_rule(s : AutomatonState) -> Unit {
  let selected_index = random_index(s, rules.length())
  let rule = rules[selected_index]
  s.rule_index = selected_index
  s.birth_mask = rule.birth_mask
  s.survive_mask = rule.survive_mask
  s.initial_alive_per_1000 = rule.initial_alive_per_1000
  apply_palette(s)
}

fn seed_background(s : AutomatonState) -> Unit {
  let total = s.columns * s.rows
  let alive_threshold = if s.initial_alive_per_1000 < 0 {
    0
  } else if s.initial_alive_per_1000 > 1000 {
    1000
  } else {
    s.initial_alive_per_1000
  }
  for i = 0; i < total; i = i + 1 {
    let alive = if next_random(s) % 1000 < alive_threshold { 1 } else { 0 }
    s.current[i] = alive
    s.next[i] = 0
    s.energy[i] = if alive == 1 {
      0.6 + (next_random(s) % 300).to_double() / 1000.0
    } else {
      0.0
    }
  }
}

fn reseed_background(s : AutomatonState) -> Unit {
  seed_background(s)
  inject_noise(s, 2160)
  s.stagnant_generations = 0
}

fn inject_noise(s : AutomatonState, strength_per_100k : Int) -> Unit {
  let count = s.current.length() * strength_per_100k / 100000
  let splashes = if count > 4 { count } else { 4 }
  for i = 0; i < splashes; i = i + 1 {
    let anchor_column = random_index(s, s.columns)
    let anchor_row = random_index(s, s.rows)
    for row_offset = -1; row_offset <= 1; row_offset = row_offset + 1 {
      for column_offset = -1; column_offset <= 1; column_offset = column_offset + 1 {
        let row = wrap_index(anchor_row + row_offset, s.rows)
        let column = wrap_index(anchor_column + column_offset, s.columns)
        let index = row * s.columns + column
        if next_random(s) % 1000 > 450 {
          s.next[index] = 1
          s.energy[index] = max_double(s.energy[index], 0.45)
        }
      }
    }
  }
}

fn thin_next_generation(s : AutomatonState, clear_per_1000 : Int) -> Unit {
  let clear_threshold = if clear_per_1000 < 0 {
    0
  } else if clear_per_1000 > 1000 {
    1000
  } else {
    clear_per_1000
  }
  for i = 0; i < s.next.length(); i = i + 1 {
    if s.next[i] == 1 && next_random(s) % 1000 < clear_threshold {
      s.next[i] = 0
      s.energy[i] = min_double(s.energy[i], 0.35)
    }
  }
}

pub fn setup(
  columns : Int,
  rows : Int,
  seed : Int
) -> Unit {
  let safe_columns = if columns > 0 { columns } else { 1 }
  let safe_rows = if rows > 0 { rows } else { 1 }
  let s : AutomatonState = {
    columns: safe_columns,
    rows: safe_rows,
    birth_mask: 8,
    survive_mask: 12,
    initial_alive_per_1000: 190,
    rule_index: 0,
    palette_red: 0.0,
    palette_green: 0.0,
    palette_blue: 0.0,
    palette_red_gain: 0.0,
    palette_green_gain: 0.0,
    palette_blue_gain: 0.0,
    palette_alpha_base: 0.0,
    palette_alpha_gain: 0.0,
    seed,
    generation: 0,
    stagnant_generations: 0,
    current: make_int_array(safe_columns * safe_rows),
    next: make_int_array(safe_columns * safe_rows),
    energy: make_double_array(safe_columns * safe_rows),
  }
  select_rule(s)
  reseed_background(s)
  s.generation = 1
  state.val = Some(s)
}

pub fn resize(columns : Int, rows : Int) -> Unit {
  match state.val {
    Some(s) => {
      let old_columns = s.columns
      let old_rows = s.rows
      let old_current = s.current
      let old_next = s.next
      let old_energy = s.energy
      let new_columns = if columns > 0 { columns } else { 1 }
      let new_rows = if rows > 0 { rows } else { 1 }
      s.columns = new_columns
      s.rows = new_rows
      s.current = make_int_array(new_columns * new_rows)
      s.next = make_int_array(new_columns * new_rows)
      s.energy = make_double_array(new_columns * new_rows)
      let columns_to_copy = min_int(old_columns, new_columns)
      let rows_to_copy = min_int(old_rows, new_rows)
      for row = 0; row < rows_to_copy; row = row + 1 {
        for column = 0; column < columns_to_copy; column = column + 1 {
          let old_index = row * old_columns + column
          let new_index = row * new_columns + column
          s.current[new_index] = old_current[old_index]
          s.next[new_index] = old_next[old_index]
          s.energy[new_index] = old_energy[old_index]
        }
      }
      if new_columns != old_columns || new_rows != old_rows {
        inject_noise(s, 324)
      }
    }
    None => setup(columns, rows, 1)
  }
}

pub fn step() -> Unit {
  match state.val {
    Some(s) => {
      let mut alive_count = 0
      let mut changed_count = 0
      for row = 0; row < s.rows; row = row + 1 {
        for column = 0; column < s.columns; column = column + 1 {
          let index = row * s.columns + column
          let mut neighbors = 0
          for row_offset = -1; row_offset <= 1; row_offset = row_offset + 1 {
            for column_offset = -1; column_offset <= 1; column_offset = column_offset + 1 {
              if row_offset != 0 || column_offset != 0 {
                let neighbor_row = wrap_index(row + row_offset, s.rows)
                let neighbor_column = wrap_index(column + column_offset, s.columns)
                neighbors += s.current[neighbor_row * s.columns + neighbor_column]
              }
            }
          }
          let alive = s.current[index] == 1
          let next_alive = if alive {
            if mask_contains(s.survive_mask, neighbors) { 1 } else { 0 }
          } else if mask_contains(s.birth_mask, neighbors) {
            1
          } else {
            0
          }
          s.next[index] = next_alive
          if next_alive != s.current[index] {
            changed_count += 1
          }
          let previous_energy = s.energy[index]
          s.energy[index] = if next_alive == 1 {
            min_double(1.0, previous_energy + 0.18)
          } else {
            max_double(0.0, previous_energy - 0.055)
          }
          alive_count += next_alive
        }
      }
      let total = s.columns * s.rows
      if changed_count < total * 2 / 100 {
        s.stagnant_generations += 1
      } else {
        s.stagnant_generations = 0
      }
      let mut did_reseed = false
      if s.generation > 24 && s.stagnant_generations >= 12 {
        reseed_background(s)
        did_reseed = true
      } else if s.generation > 24 && alive_count > total * 70 / 100 {
        reseed_background(s)
        did_reseed = true
      } else if alive_count > total * 50 / 100 {
        thin_next_generation(s, 700)
      } else if alive_count < total * 5 / 100 {
        inject_noise(s, 360)
      }
      if !did_reseed {
        let current = s.current
        s.current = s.next
        s.next = current
      }
      s.generation += 1
    }
    None => ()
  }
}

pub fn get_columns() -> Int {
  match state.val { Some(s) => s.columns; None => 0 }
}

pub fn get_rows() -> Int {
  match state.val { Some(s) => s.rows; None => 0 }
}

pub fn get_energy(index : Int) -> Double {
  match state.val {
    Some(s) =>
      if index >= 0 && index < s.energy.length() { s.energy[index] } else { 0.0 }
    None => 0.0
  }
}

pub fn get_birth_mask() -> Int {
  match state.val { Some(s) => s.birth_mask; None => 0 }
}

pub fn get_survive_mask() -> Int {
  match state.val { Some(s) => s.survive_mask; None => 0 }
}

pub fn get_initial_alive_per_1000() -> Int {
  match state.val { Some(s) => s.initial_alive_per_1000; None => 0 }
}

pub fn get_rule_index() -> Int {
  match state.val { Some(s) => s.rule_index; None => 0 }
}

pub fn get_cell_red(index : Int) -> Int {
  match state.val {
    Some(s) =>
      if index >= 0 && index < s.energy.length() {
        let value = s.energy[index]
        let glow = if s.current[index] == 1 { value } else { value * 0.72 }
        (s.palette_red + glow * s.palette_red_gain).round().to_int()
      } else {
        0
      }
    None => 0
  }
}

pub fn get_cell_green(index : Int) -> Int {
  match state.val {
    Some(s) =>
      if index >= 0 && index < s.energy.length() {
        let value = s.energy[index]
        let glow = if s.current[index] == 1 { value } else { value * 0.72 }
        (s.palette_green + glow * s.palette_green_gain).round().to_int()
      } else {
        0
      }
    None => 0
  }
}

pub fn get_cell_blue(index : Int) -> Int {
  match state.val {
    Some(s) =>
      if index >= 0 && index < s.energy.length() {
        let value = s.energy[index]
        let glow = if s.current[index] == 1 { value } else { value * 0.72 }
        (s.palette_blue + glow * s.palette_blue_gain).round().to_int()
      } else {
        0
      }
    None => 0
  }
}

pub fn get_cell_alpha(index : Int) -> Double {
  match state.val {
    Some(s) =>
      if index >= 0 && index < s.energy.length() {
        let value = s.energy[index]
        let glow = if s.current[index] == 1 { value } else { value * 0.72 }
        s.palette_alpha_base + glow * s.palette_alpha_gain
      } else {
        0.0
      }
    None => 0.0
  }
}
