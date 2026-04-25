priv struct AutomatonState {
  mut columns : Int
  mut rows : Int
  birth_mask : Int
  survive_mask : Int
  mut seed : Int
  mut generation : Int
  mut current : Array[Int]
  mut next : Array[Int]
  mut energy : Array[Double]
}

let state : Ref[AutomatonState?] = { val: None }

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

fn seed_background(s : AutomatonState) -> Unit {
  let total = s.columns * s.rows
  for i = 0; i < total; i = i + 1 {
    let alive = if next_random(s) % 1000 > 810 { 1 } else { 0 }
    s.current[i] = alive
    s.next[i] = 0
    s.energy[i] = if alive == 1 {
      0.6 + (next_random(s) % 300).to_double() / 1000.0
    } else {
      0.0
    }
  }
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

pub fn setup(columns : Int, rows : Int, birth_mask : Int, survive_mask : Int, seed : Int) -> Unit {
  let safe_columns = if columns > 0 { columns } else { 1 }
  let safe_rows = if rows > 0 { rows } else { 1 }
  let s : AutomatonState = {
    columns: safe_columns,
    rows: safe_rows,
    birth_mask,
    survive_mask,
    seed,
    generation: 0,
    current: make_int_array(safe_columns * safe_rows),
    next: make_int_array(safe_columns * safe_rows),
    energy: make_double_array(safe_columns * safe_rows),
  }
  seed_background(s)
  inject_noise(s, 2160)
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
    None => setup(columns, rows, 8, 12, 1)
  }
}

pub fn step() -> Unit {
  match state.val {
    Some(s) => {
      let mut alive_count = 0
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
          let previous_energy = s.energy[index]
          s.energy[index] = if next_alive == 1 {
            min_double(1.0, previous_energy + 0.18)
          } else {
            max_double(0.0, previous_energy - 0.055)
          }
          alive_count += next_alive
        }
      }
      if alive_count < (s.columns * s.rows) * 8 / 100 || s.generation % 18 == 0 {
        inject_noise(s, 810)
      }
      let current = s.current
      s.current = s.next
      s.next = current
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

pub fn get_alive(index : Int) -> Int {
  match state.val {
    Some(s) =>
      if index >= 0 && index < s.current.length() { s.current[index] } else { 0 }
    None => 0
  }
}

pub fn get_energy(index : Int) -> Double {
  match state.val {
    Some(s) =>
      if index >= 0 && index < s.energy.length() { s.energy[index] } else { 0.0 }
    None => 0.0
  }
}
