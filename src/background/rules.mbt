// Curated Life-like rules in Golly/RLE B.../S... order.
// Initial densities are selected with `bun run score:rules`, then kept conservative when browser runs looked risky.

let rules : Array[AutomatonRule] = [
  bs([3], [2, 3], 180), // Conway's Life: B3/S23
  bs([3, 6], [2, 3], 140), // HighLife: B36/S23
  bs([3, 7], [2, 3], 500), // DryLife: B37/S23
  bs([3], [2, 3, 8], 350), // EightLife: B3/S238
  bs([3], [0, 2, 3], 100), // DotLife: B3/S023
  bs([3, 6], [1, 2, 5], 180), // 2x2: B36/S125
  bs([3, 5, 7], [2, 3, 8], 350), // Pseudo Life: B357/S238
  bs([3, 8], [2, 3, 8], 80), // HoneyLife: B38/S238
  bs([3, 8], [2, 3], 100), // Pedestrian Life: B38/S23
  bs([3], [0, 1, 3, 5, 7], 250), // Catagolue-tracked OCA: B3/S01357
  bs([3, 6, 8], [2, 3, 8], 250), // LowDeath: B368/S238
  bs([3, 6, 7, 8], [2, 3], 250), // OCA: B3678/S23
  bs([3, 5, 7], [1, 3, 5, 8], 180), // Amoeba: B357/S1358
]
