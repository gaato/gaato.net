function _M0TPC13ref3RefGiE(param0) {
  this.val = param0;
}
function _M0TP46mizchi4luna4luna6signal15ReactiveContext(param0, param1, param2, param3, param4, param5) {
  this.current_subscriber = param0;
  this.current_owner = param1;
  this.current_cleanups = param2;
  this.batch_depth = param3;
  this.pending_effects = param4;
  this.pending_ids = param5;
}
function _M0DTPC16option6OptionGRPB5ArrayGWEuEE4None() {}
_M0DTPC16option6OptionGRPB5ArrayGWEuEE4None.prototype.$tag = 0;
const _M0DTPC16option6OptionGRPB5ArrayGWEuEE4None__ = new _M0DTPC16option6OptionGRPB5ArrayGWEuEE4None();
function _M0DTPC16option6OptionGRPB5ArrayGWEuEE4Some(param0) {
  this._0 = param0;
}
_M0DTPC16option6OptionGRPB5ArrayGWEuEE4Some.prototype.$tag = 1;
function _M0TPB13StringBuilder(param0) {
  this.val = param0;
}
function $compare_int(a, b) {
  return (a >= b) - (a <= b);
}
class $PanicError extends Error {}
function $panic() {
  throw new $PanicError();
}
function _M0TPC16string10StringView(param0, param1, param2) {
  this.str = param0;
  this.start = param1;
  this.end = param2;
}
const _M0FPB19int__to__string__js = (x, radix) => {
  return x.toString(radix);
};
function $bound_check(arr, index) {
  if (index < 0 || index >= arr.length) throw new Error("Index out of bounds");
}
const _M0MPB7JSArray4push = (arr, val) => { arr.push(val); };
function _M0TPB8MutLocalGiE(param0) {
  this.val = param0;
}
function _M0TPB9ArrayViewGRP46mizchi4luna4luna6signal12EffectRunnerE(param0, param1, param2) {
  this.buf = param0;
  this.start = param1;
  this.end = param2;
}
const _M0FPB15ryu__to__string = (number) => number.toString();
const _M0MPB7JSArray11set__length = (arr, len) => { arr.length = len; };
const _M0MP36mizchi2js4core3Any5__get = (obj, key) => obj[key];
const _M0MP36mizchi2js4core3Any6__call = (obj, key, args) => obj[key](...args);
const _M0FP36mizchi2js4core11is__nullish = (v) => v == null;
const _M0FP36mizchi2js4core11new__object = () => ({});
const _M0MP36mizchi2js4core3Any5__set = (obj, key, value) => { obj[key] = value };
const _M0FP36mizchi2js4core13from__entries = (entries) => Object.fromEntries(entries.map(e => [e._0, e._1]));
function _M0DTPC16option6OptionGRP46mizchi2js7browser3dom7ElementE4None() {}
_M0DTPC16option6OptionGRP46mizchi2js7browser3dom7ElementE4None.prototype.$tag = 0;
const _M0DTPC16option6OptionGRP46mizchi2js7browser3dom7ElementE4None__ = new _M0DTPC16option6OptionGRP46mizchi2js7browser3dom7ElementE4None();
function _M0DTPC16option6OptionGRP46mizchi2js7browser3dom7ElementE4Some(param0) {
  this._0 = param0;
}
_M0DTPC16option6OptionGRP46mizchi2js7browser3dom7ElementE4Some.prototype.$tag = 1;
const _M0MP46mizchi2js8builtins4math4Math6random = () => Math.random();
const _M0MP46mizchi2js8builtins4math4Math5floor = (x) => Math.floor(x);
const _M0MP46mizchi2js8builtins4math4Math5round = (x) => Math.round(x);
const _M0FP46mizchi2js7browser3dom6window = () => window;
const _M0MP46mizchi2js7browser3dom7Element7prepend = (self, nodes) => self.prepend(...nodes);
const _M0FP46mizchi2js7browser3dom8document = () => document;
const _M0MP46mizchi2js7browser3dom8Document13createElement = (self, tag) => self.createElement(tag);
const _M0MP46mizchi2js7browser3dom8Document14createTextNode = (self, data) => self.createTextNode(data);
const _M0MP46mizchi2js7browser6canvas24CanvasRenderingContext2D8fillRect = (self, x, y, width, height) => self.fillRect(x, y, width, height);
const _M0MP46mizchi2js7browser6canvas24CanvasRenderingContext2D9clearRect = (self, x, y, width, height) => self.clearRect(x, y, width, height);
const _M0MP46mizchi2js7browser6canvas24CanvasRenderingContext2D12setTransform = (self, a, b, c, d, e, f) => self.setTransform(a, b, c, d, e, f);
function _M0TP46mizchi4luna4luna6signal11EffectState(param0, param1) {
  this.active = param0;
  this.cleanups = param1;
}
function _M0TPC13ref3RefGORP46mizchi4luna4luna6signal12EffectRunnerE(param0) {
  this.val = param0;
}
function _M0TP46mizchi4luna4luna6signal12EffectRunner(param0, param1) {
  this.id = param0;
  this.run = param1;
}
function _M0TP46mizchi4luna4luna6signal6SignalGRP28internal11gaato_2dnet4LangE(param0, param1) {
  this.value = param0;
  this.subscribers = param1;
}
function _M0TP46mizchi4luna4luna6signal6SignalGRP28internal11gaato_2dnet8InterestE(param0, param1) {
  this.value = param0;
  this.subscribers = param1;
}
function _M0DTP56mizchi4luna8platform3dom7element7DomNode2El(param0) {
  this._0 = param0;
}
_M0DTP56mizchi4luna8platform3dom7element7DomNode2El.prototype.$tag = 0;
function _M0DTP56mizchi4luna8platform3dom7element7DomNode3Txt(param0) {
  this._0 = param0;
}
_M0DTP56mizchi4luna8platform3dom7element7DomNode3Txt.prototype.$tag = 1;
function _M0DTP56mizchi4luna8platform3dom7element7DomNode3Raw(param0) {
  this._0 = param0;
}
_M0DTP56mizchi4luna8platform3dom7element7DomNode3Raw.prototype.$tag = 2;
const _M0FP56mizchi4luna8platform3dom7element21apply__event__handler = (elem, name, handler) => elem.addEventListener(name, handler);
function _M0TP56mizchi4luna8platform3dom7element10DomElement(param0) {
  this.inner = param0;
}
function _M0DTP56mizchi4luna8platform3dom7element9AttrValue6Static(param0) {
  this._0 = param0;
}
_M0DTP56mizchi4luna8platform3dom7element9AttrValue6Static.prototype.$tag = 0;
function _M0DTP56mizchi4luna8platform3dom7element9AttrValue7Dynamic(param0) {
  this._0 = param0;
}
_M0DTP56mizchi4luna8platform3dom7element9AttrValue7Dynamic.prototype.$tag = 1;
function _M0DTP56mizchi4luna8platform3dom7element9AttrValue7Handler(param0) {
  this._0 = param0;
}
_M0DTP56mizchi4luna8platform3dom7element9AttrValue7Handler.prototype.$tag = 2;
const _M0MP56mizchi4luna8platform3dom7element10HandlerMap5click = (m, handler) => { m.click = handler; return m; };
const _M0MP56mizchi4luna8platform3dom7element10HandlerMap9to__attrs = (m) => Object.entries(m).map(([k, v]) => ({ _0: k, _1: { $tag: 2, _0: v } }));
function _M0TP28internal11gaato_2dnet4I18n(param0, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11, param12, param13, param14, param15, param16, param17, param18, param19, param20) {
  this.eyebrow = param0;
  this.headline = param1;
  this.summary = param2;
  this.about_title = param3;
  this.about = param4;
  this.current_title = param5;
  this.current_role = param6;
  this.current_meta = param7;
  this.current_points = param8;
  this.moonbit_title = param9;
  this.moonbit_intro = param10;
  this.education_title = param11;
  this.education_school = param12;
  this.education_detail = param13;
  this.focus_title = param14;
  this.focus_areas = param15;
  this.signals_title = param16;
  this.signal_values = param17;
  this.signal_labels = param18;
  this.links_title = param19;
  this.link_notes = param20;
}
function _M0TP28internal11gaato_2dnet12InterestNote(param0, param1) {
  this.title = param0;
  this.lines = param1;
}
function _M0TP28internal11gaato_2dnet11ProfileLink(param0, param1) {
  this.label = param0;
  this.url = param1;
}
const _M0FP28internal11gaato_2dnet24prefers__reduced__motion = (win) => win.matchMedia("(prefers-reduced-motion: reduce)").matches;
function _M0TPB8MutLocalGdE(param0) {
  this.val = param0;
}
function _M0TP28internal11gaato_2dnet15BackgroundState(param0, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11, param12, param13, param14, param15) {
  this.win = param0;
  this.canvas = param1;
  this.ctx = param2;
  this.last_time = param3;
  this.accumulated = param4;
  this.width = param5;
  this.height = param6;
  this.dpr = param7;
  this.cell_size = param8;
  this.columns = param9;
  this.rows = param10;
  this.generation = param11;
  this.current = param12;
  this.next = param13;
  this.energy = param14;
  this.reduced_motion = param15;
}
function _M0DTPC16option6OptionGRP311moonbitlang5async9js__async11AbortSignalE4None() {}
_M0DTPC16option6OptionGRP311moonbitlang5async9js__async11AbortSignalE4None.prototype.$tag = 0;
const _M0DTPC16option6OptionGRP311moonbitlang5async9js__async11AbortSignalE4None__ = new _M0DTPC16option6OptionGRP311moonbitlang5async9js__async11AbortSignalE4None();
function _M0DTPC16option6OptionGRP311moonbitlang5async9js__async11AbortSignalE4Some(param0) {
  this._0 = param0;
}
_M0DTPC16option6OptionGRP311moonbitlang5async9js__async11AbortSignalE4Some.prototype.$tag = 1;
function _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None() {}
_M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None.prototype.$tag = 0;
const _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__ = new _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None();
function _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4Some(param0) {
  this._0 = param0;
}
_M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4Some.prototype.$tag = 1;
function _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None() {}
_M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None.prototype.$tag = 0;
const _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__ = new _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None();
function _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4Some(param0) {
  this._0 = param0;
}
_M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4Some.prototype.$tag = 1;
function _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None() {}
_M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None.prototype.$tag = 0;
const _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__ = new _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None();
function _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4Some(param0) {
  this._0 = param0;
}
_M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4Some.prototype.$tag = 1;
function _M0DTP56mizchi4luna8platform3dom7element4Attr10AttrString(param0) {
  this._0 = param0;
}
_M0DTP56mizchi4luna8platform3dom7element4Attr10AttrString.prototype.$tag = 0;
function _M0DTP56mizchi4luna8platform3dom7element4Attr10AttrNumber(param0) {
  this._0 = param0;
}
_M0DTP56mizchi4luna8platform3dom7element4Attr10AttrNumber.prototype.$tag = 1;
function _M0DTP56mizchi4luna8platform3dom7element4Attr7AttrInt(param0) {
  this._0 = param0;
}
_M0DTP56mizchi4luna8platform3dom7element4Attr7AttrInt.prototype.$tag = 2;
function _M0DTP56mizchi4luna8platform3dom7element4Attr8AttrBool(param0) {
  this._0 = param0;
}
_M0DTP56mizchi4luna8platform3dom7element4Attr8AttrBool.prototype.$tag = 3;
const _M0FP092moonbitlang_2fcore_2fbuiltin_2fStringBuilder_24as_24_40moonbitlang_2fcore_2fbuiltin_2eLogger = { method_0: _M0IPB13StringBuilderPB6Logger13write__string, method_1: _M0IP016_24default__implPB6Logger16write__substringGRPB13StringBuilderE, method_2: _M0IPB13StringBuilderPB6Logger11write__view, method_3: _M0IPB13StringBuilderPB6Logger11write__char };
const _M0FP46mizchi4luna4luna6signal19effect__id__counter = new _M0TPC13ref3RefGiE(0);
const _M0FP46mizchi4luna4luna6signal17reactive__context = new _M0TP46mizchi4luna4luna6signal15ReactiveContext(undefined, undefined, _M0DTPC16option6OptionGRPB5ArrayGWEuEE4None__, 0, [], []);
function _M0MPB13StringBuilder11new_2einner(size_hint) {
  return new _M0TPB13StringBuilder("");
}
function _M0MPB13StringBuilder10to__string(self) {
  return self.val;
}
function _M0IPB13StringBuilderPB6Logger11write__char(self, ch) {
  self.val = `${self.val}${String.fromCodePoint(ch)}`;
}
function _M0MPC16uint166UInt1623is__trailing__surrogate(self) {
  return _M0IP016_24default__implPB7Compare6op__geGkE(self, 56320) && _M0IP016_24default__implPB7Compare6op__leGkE(self, 57343);
}
function _M0IPB13StringBuilderPB6Logger13write__string(self, str) {
  self.val = `${self.val}${str}`;
}
function _M0IPC16uint166UInt16PB7Compare7compare(self, that) {
  return $compare_int(self, that);
}
function _M0IP016_24default__implPB7Compare6op__leGkE(x, y) {
  return _M0IPC16uint166UInt16PB7Compare7compare(x, y) <= 0;
}
function _M0IP016_24default__implPB7Compare6op__geGkE(x, y) {
  return _M0IPC16uint166UInt16PB7Compare7compare(x, y) >= 0;
}
function _M0MPC16string6String11sub_2einner(self, start, end) {
  const len = self.length;
  let end$2;
  if (end === undefined) {
    end$2 = len;
  } else {
    const _Some = end;
    const _end = _Some;
    end$2 = _end < 0 ? len + _end | 0 : _end;
  }
  const start$2 = start < 0 ? len + start | 0 : start;
  if (start$2 >= 0 && (start$2 <= end$2 && end$2 <= len)) {
    if (start$2 < len) {
      if (!_M0MPC16uint166UInt1623is__trailing__surrogate(self.charCodeAt(start$2))) {
      } else {
        $panic();
      }
    }
    if (end$2 < len) {
      if (!_M0MPC16uint166UInt1623is__trailing__surrogate(self.charCodeAt(end$2))) {
      } else {
        $panic();
      }
    }
    return new _M0TPC16string10StringView(self, start$2, end$2);
  } else {
    return $panic();
  }
}
function _M0IP016_24default__implPB6Logger16write__substringGRPB13StringBuilderE(self, value, start, len) {
  _M0IPB13StringBuilderPB6Logger11write__view(self, _M0MPC16string6String11sub_2einner(value, start, start + len | 0));
}
function _M0IP016_24default__implPB4Show10to__stringGbE(self) {
  const logger = _M0MPB13StringBuilder11new_2einner(0);
  _M0IPC14bool4BoolPB4Show6output(self, { self: logger, method_table: _M0FP092moonbitlang_2fcore_2fbuiltin_2fStringBuilder_24as_24_40moonbitlang_2fcore_2fbuiltin_2eLogger });
  return _M0MPB13StringBuilder10to__string(logger);
}
function _M0IP016_24default__implPB4Show10to__stringGRP56mizchi4luna8platform3dom7element4AttrE(self) {
  const logger = _M0MPB13StringBuilder11new_2einner(0);
  _M0IP56mizchi4luna8platform3dom7element4AttrPB4Show6output(self, { self: logger, method_table: _M0FP092moonbitlang_2fcore_2fbuiltin_2fStringBuilder_24as_24_40moonbitlang_2fcore_2fbuiltin_2eLogger });
  return _M0MPB13StringBuilder10to__string(logger);
}
function _M0MPB4Iter4nextGRP46mizchi4luna4luna6signal12EffectRunnerE(self) {
  const _func = self;
  return _func();
}
function _M0MPC13int3Int18to__string_2einner(self, radix) {
  return _M0FPB19int__to__string__js(self, radix);
}
function _M0MPB4Iter3newGRP46mizchi4luna4luna6signal12EffectRunnerE(f) {
  return f;
}
function _M0IPC16string10StringViewPB4Show10to__string(self) {
  return self.str.substring(self.start, self.end);
}
function _M0MPC15array9ArrayView6lengthGRP46mizchi4luna4luna6signal12EffectRunnerE(self) {
  return self.end - self.start | 0;
}
function _M0IPB13StringBuilderPB6Logger11write__view(self, str) {
  self.val = `${self.val}${_M0IPC16string10StringViewPB4Show10to__string(str)}`;
}
function _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(self, value) {
  _M0MPB7JSArray4push(self, value);
}
function _M0MPC15array5Array4pushGiE(self, value) {
  _M0MPB7JSArray4push(self, value);
}
function _M0MPC15array5Array4pushGdE(self, value) {
  _M0MPB7JSArray4push(self, value);
}
function _M0IPC14bool4BoolPB4Show6output(self, logger) {
  if (self) {
    logger.method_table.method_0(logger.self, "true");
    return;
  } else {
    logger.method_table.method_0(logger.self, "false");
    return;
  }
}
function _M0MPC15array9ArrayView4iterGRP46mizchi4luna4luna6signal12EffectRunnerE(self) {
  const i = new _M0TPB8MutLocalGiE(0);
  return _M0MPB4Iter3newGRP46mizchi4luna4luna6signal12EffectRunnerE(() => {
    if (i.val < _M0MPC15array9ArrayView6lengthGRP46mizchi4luna4luna6signal12EffectRunnerE(self)) {
      const elem = self.buf[self.start + i.val | 0];
      i.val = i.val + 1 | 0;
      return elem;
    } else {
      return undefined;
    }
  });
}
function _M0MPC15array5Array4iterGRP46mizchi4luna4luna6signal12EffectRunnerE(self) {
  return _M0MPC15array9ArrayView4iterGRP46mizchi4luna4luna6signal12EffectRunnerE(new _M0TPB9ArrayViewGRP46mizchi4luna4luna6signal12EffectRunnerE(self, 0, self.length));
}
function _M0MPC15array5Array3setGiE(self, index, value) {
  const len = self.length;
  if (index >= 0 && index < len) {
    $bound_check(self, index);
    self[index] = value;
    return;
  } else {
    $panic();
    return;
  }
}
function _M0MPC15array5Array3setGdE(self, index, value) {
  const len = self.length;
  if (index >= 0 && index < len) {
    $bound_check(self, index);
    self[index] = value;
    return;
  } else {
    $panic();
    return;
  }
}
function _M0MPC15array5Array3mapGRP28internal11gaato_2dnet8InterestRP56mizchi4luna8platform3dom7element7DomNodeE(self, f) {
  const arr = new Array(self.length);
  const _bind = self.length;
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < _bind) {
      const v = self[i];
      arr[i] = f(v);
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return arr;
}
function _M0MPB4Iter3anyGRP46mizchi4luna4luna6signal12EffectRunnerE(self, f) {
  while (true) {
    const _bind = _M0MPB4Iter4nextGRP46mizchi4luna4luna6signal12EffectRunnerE(self);
    if (_bind === undefined) {
      return false;
    } else {
      const _Some = _bind;
      const _x = _Some;
      if (f(_x)) {
        return true;
      }
      continue;
    }
  }
}
function _M0MPC16double6Double10to__string(self) {
  return _M0FPB15ryu__to__string(self);
}
function _M0MPC15array5Array28unsafe__truncate__to__lengthGWEuE(self, new_len) {
  _M0MPB7JSArray11set__length(self, new_len);
}
function _M0MPC15array5Array2atGsE(self, index) {
  const len = self.length;
  if (index >= 0 && index < len) {
    $bound_check(self, index);
    return self[index];
  } else {
    return $panic();
  }
}
function _M0MPC15array5Array2atGdE(self, index) {
  const len = self.length;
  if (index >= 0 && index < len) {
    $bound_check(self, index);
    return self[index];
  } else {
    return $panic();
  }
}
function _M0MPC15array5Array2atGiE(self, index) {
  const len = self.length;
  if (index >= 0 && index < len) {
    $bound_check(self, index);
    return self[index];
  } else {
    return $panic();
  }
}
function _M0MPC15array5Array5clearGWEuE(self) {
  _M0MPC15array5Array28unsafe__truncate__to__lengthGWEuE(self, 0);
}
function _M0FP36mizchi2js4core16identity__optionGRP46mizchi2js7browser3dom7ElementE(v) {
  return _M0FP36mizchi2js4core11is__nullish(v) ? _M0DTPC16option6OptionGRP46mizchi2js7browser3dom7ElementE4None__ : new _M0DTPC16option6OptionGRP46mizchi2js7browser3dom7ElementE4Some(v);
}
function _M0MP46mizchi2js3web5event11EventTarget24addEventListener_2einner(self, event_type, handler, capture, once, passive, signal) {
  const entries = [];
  _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(entries, { _0: "capture", _1: capture });
  _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(entries, { _0: "once", _1: once });
  _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(entries, { _0: "passive", _1: passive });
  let v;
  _L: {
    _L$2: {
      if (signal.$tag === 1) {
        const _Some = signal;
        const _v = _Some._0;
        v = _v;
        break _L$2;
      }
      break _L;
    }
    _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(entries, { _0: "signal", _1: v });
  }
  _M0MP36mizchi2js4core3Any6__call(self, "addEventListener", [event_type, handler, _M0FP36mizchi2js4core13from__entries(entries)]);
}
function _M0MP46mizchi2js7browser3dom6Window10innerWidth(self) {
  return _M0MP36mizchi2js4core3Any5__get(self, "innerWidth");
}
function _M0MP46mizchi2js7browser3dom6Window11innerHeight(self) {
  return _M0MP36mizchi2js4core3Any5__get(self, "innerHeight");
}
function _M0MP46mizchi2js7browser3dom6Window16devicePixelRatio(self) {
  return _M0MP36mizchi2js4core3Any5__get(self, "devicePixelRatio");
}
function _M0MP46mizchi2js7browser3dom6Window21requestAnimationFrame(self, callback) {
  return _M0MP36mizchi2js4core3Any6__call(self, "requestAnimationFrame", [callback]);
}
function _M0MP46mizchi2js7browser3dom4Node11appendChild(self, child) {
  return _M0MP36mizchi2js4core3Any6__call(self, "appendChild", [child]);
}
function _M0MP46mizchi2js7browser3dom4Node14setTextContent(self, content) {
  _M0MP36mizchi2js4core3Any5__set(self, "textContent", content);
}
function _M0MP46mizchi2js7browser3dom17HTMLCanvasElement10getContext(self, context_type) {
  return _M0MP36mizchi2js4core3Any6__call(self, "getContext", [context_type]);
}
function _M0MP46mizchi2js7browser3dom7Element12setClassName(self, class_name) {
  _M0MP36mizchi2js4core3Any5__set(self, "className", class_name);
}
function _M0MP46mizchi2js7browser3dom7Element12setAttribute(self, name, value) {
  _M0MP36mizchi2js4core3Any6__call(self, "setAttribute", [name, value]);
}
function _M0MP46mizchi2js7browser3dom7Element15removeAttribute(self, name) {
  _M0MP36mizchi2js4core3Any6__call(self, "removeAttribute", [name]);
}
function _M0MP46mizchi2js7browser3dom8Document14getElementById(self, id) {
  const v = _M0MP36mizchi2js4core3Any6__call(self, "getElementById", [id]);
  return _M0FP36mizchi2js4core16identity__optionGRP46mizchi2js7browser3dom7ElementE(v);
}
function _M0MP46mizchi2js7browser3dom8Document13querySelector(self, selector) {
  const v = _M0MP36mizchi2js4core3Any6__call(self, "querySelector", [selector]);
  return _M0FP36mizchi2js4core16identity__optionGRP46mizchi2js7browser3dom7ElementE(v);
}
function _M0MP46mizchi2js7browser3dom8Document4body(self) {
  const v = _M0MP36mizchi2js4core3Any5__get(self, "body");
  return _M0FP36mizchi2js4core16identity__optionGRP46mizchi2js7browser3dom7ElementE(v);
}
function _M0FP46mizchi4luna4luna6signal15new__effect__id() {
  const id = _M0FP46mizchi4luna4luna6signal19effect__id__counter.val;
  _M0FP46mizchi4luna4luna6signal19effect__id__counter.val = id + 1 | 0;
  return id;
}
function _M0FP46mizchi4luna4luna6signal18register__disposer(disposer) {
  let owner;
  _L: {
    const _bind = _M0FP46mizchi4luna4luna6signal17reactive__context.current_owner;
    if (_bind === undefined) {
      return;
    } else {
      const _Some = _bind;
      const _owner = _Some;
      owner = _owner;
      break _L;
    }
  }
  _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(owner.disposers, disposer);
}
function _M0FP46mizchi4luna4luna6signal13run__cleanups(cleanups) {
  let _tmp = cleanups.length - 1 | 0;
  while (true) {
    const i = _tmp;
    if (i >= 0) {
      const _func = _M0MPC15array5Array2atGsE(cleanups, i);
      _func();
      _tmp = i - 1 | 0;
      continue;
    } else {
      break;
    }
  }
  _M0MPC15array5Array5clearGWEuE(cleanups);
}
function _M0FP46mizchi4luna4luna6signal22set__current__cleanups(cleanups) {
  const prev = _M0FP46mizchi4luna4luna6signal17reactive__context.current_cleanups;
  _M0FP46mizchi4luna4luna6signal17reactive__context.current_cleanups = cleanups;
  return prev;
}
function _M0FP46mizchi4luna4luna6signal28run__with__cleanup__trackingGuE(cleanups, f) {
  const prev = _M0FP46mizchi4luna4luna6signal22set__current__cleanups(new _M0DTPC16option6OptionGRPB5ArrayGWEuEE4Some(cleanups));
  f();
  _M0FP46mizchi4luna4luna6signal17reactive__context.current_cleanups = prev;
}
function _M0FP46mizchi4luna4luna6signal21run__with__subscriberGuE(subscriber, f) {
  const prev = _M0FP46mizchi4luna4luna6signal17reactive__context.current_subscriber;
  _M0FP46mizchi4luna4luna6signal17reactive__context.current_subscriber = subscriber;
  f();
  _M0FP46mizchi4luna4luna6signal17reactive__context.current_subscriber = prev;
}
function _M0FP46mizchi4luna4luna6signal6effect(fn_) {
  const state = new _M0TP46mizchi4luna4luna6signal11EffectState(true, []);
  const id = _M0FP46mizchi4luna4luna6signal15new__effect__id();
  const runner_ref = new _M0TPC13ref3RefGORP46mizchi4luna4luna6signal12EffectRunnerE(undefined);
  const run_effect = () => {
    if (!state.active) {
      return undefined;
    }
    _M0FP46mizchi4luna4luna6signal13run__cleanups(state.cleanups);
    let runner;
    _L: {
      const _bind = runner_ref.val;
      if (_bind === undefined) {
        return;
      } else {
        const _Some = _bind;
        const _runner = _Some;
        runner = _runner;
        break _L;
      }
    }
    _M0FP46mizchi4luna4luna6signal21run__with__subscriberGuE(runner, () => {
      _M0FP46mizchi4luna4luna6signal28run__with__cleanup__trackingGuE(state.cleanups, fn_);
    });
  };
  const runner = new _M0TP46mizchi4luna4luna6signal12EffectRunner(id, run_effect);
  runner_ref.val = runner;
  run_effect();
  const dispose = () => {
    state.active = false;
    _M0FP46mizchi4luna4luna6signal13run__cleanups(state.cleanups);
  };
  _M0FP46mizchi4luna4luna6signal18register__disposer(dispose);
  return dispose;
}
function _M0FP46mizchi4luna4luna6signal24get__current__subscriber() {
  return _M0FP46mizchi4luna4luna6signal17reactive__context.current_subscriber;
}
function _M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(self) {
  let subscriber;
  _L: {
    _L$2: {
      const _bind = _M0FP46mizchi4luna4luna6signal24get__current__subscriber();
      if (_bind === undefined) {
      } else {
        const _Some = _bind;
        const _subscriber = _Some;
        subscriber = _subscriber;
        break _L$2;
      }
      break _L;
    }
    const already_subscribed = _M0MPB4Iter3anyGRP46mizchi4luna4luna6signal12EffectRunnerE(_M0MPC15array5Array4iterGRP46mizchi4luna4luna6signal12EffectRunnerE(self.subscribers), (s) => s.id === subscriber.id);
    if (!already_subscribed) {
      _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(self.subscribers, subscriber);
    }
  }
  return self.value;
}
function _M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet8InterestE(self) {
  let subscriber;
  _L: {
    _L$2: {
      const _bind = _M0FP46mizchi4luna4luna6signal24get__current__subscriber();
      if (_bind === undefined) {
      } else {
        const _Some = _bind;
        const _subscriber = _Some;
        subscriber = _subscriber;
        break _L$2;
      }
      break _L;
    }
    const already_subscribed = _M0MPB4Iter3anyGRP46mizchi4luna4luna6signal12EffectRunnerE(_M0MPC15array5Array4iterGRP46mizchi4luna4luna6signal12EffectRunnerE(self.subscribers), (s) => s.id === subscriber.id);
    if (!already_subscribed) {
      _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(self.subscribers, subscriber);
    }
  }
  return self.value;
}
function _M0MP46mizchi4luna4luna6signal6Signal3newGRP28internal11gaato_2dnet4LangE(initial) {
  return new _M0TP46mizchi4luna4luna6signal6SignalGRP28internal11gaato_2dnet4LangE(initial, []);
}
function _M0MP46mizchi4luna4luna6signal6Signal3newGRP28internal11gaato_2dnet8InterestE(initial) {
  return new _M0TP46mizchi4luna4luna6signal6SignalGRP28internal11gaato_2dnet8InterestE(initial, []);
}
function _M0FP46mizchi4luna4luna6signal6signalGRP28internal11gaato_2dnet4LangE(initial) {
  return _M0MP46mizchi4luna4luna6signal6Signal3newGRP28internal11gaato_2dnet4LangE(initial);
}
function _M0FP46mizchi4luna4luna6signal6signalGRP28internal11gaato_2dnet8InterestE(initial) {
  return _M0MP46mizchi4luna4luna6signal6Signal3newGRP28internal11gaato_2dnet8InterestE(initial);
}
function _M0FP46mizchi4luna4luna6signal11is__pending(id) {
  const _bind = _M0FP46mizchi4luna4luna6signal17reactive__context.pending_ids;
  const _bind$2 = _bind.length;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind$2) {
      const pending_id = _bind[_];
      if (pending_id === id) {
        return true;
      }
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return false;
}
function _M0FP46mizchi4luna4luna6signal16schedule__effect(effect) {
  if (_M0FP46mizchi4luna4luna6signal17reactive__context.batch_depth > 0) {
    if (!_M0FP46mizchi4luna4luna6signal11is__pending(effect.id)) {
      _M0MPC15array5Array4pushGiE(_M0FP46mizchi4luna4luna6signal17reactive__context.pending_ids, effect.id);
      _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(_M0FP46mizchi4luna4luna6signal17reactive__context.pending_effects, effect);
      return;
    } else {
      return;
    }
  } else {
    const _func = effect.run;
    _func();
    return;
  }
}
function _M0MP46mizchi4luna4luna6signal6Signal6notifyGRP28internal11gaato_2dnet4LangE(self) {
  const _bind = self.subscribers;
  const _bind$2 = _bind.length;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind$2) {
      const subscriber = _bind[_];
      _M0FP46mizchi4luna4luna6signal16schedule__effect(subscriber);
      _tmp = _ + 1 | 0;
      continue;
    } else {
      return;
    }
  }
}
function _M0MP46mizchi4luna4luna6signal6Signal6notifyGRP28internal11gaato_2dnet8InterestE(self) {
  const _bind = self.subscribers;
  const _bind$2 = _bind.length;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind$2) {
      const subscriber = _bind[_];
      _M0FP46mizchi4luna4luna6signal16schedule__effect(subscriber);
      _tmp = _ + 1 | 0;
      continue;
    } else {
      return;
    }
  }
}
function _M0MP46mizchi4luna4luna6signal6Signal3setGRP28internal11gaato_2dnet4LangE(self, new_value) {
  self.value = new_value;
  _M0MP46mizchi4luna4luna6signal6Signal6notifyGRP28internal11gaato_2dnet4LangE(self);
}
function _M0MP46mizchi4luna4luna6signal6Signal3setGRP28internal11gaato_2dnet8InterestE(self, new_value) {
  self.value = new_value;
  _M0MP46mizchi4luna4luna6signal6Signal6notifyGRP28internal11gaato_2dnet8InterestE(self);
}
function _M0FP56mizchi4luna8platform3dom7element10text__node(content) {
  const doc = _M0FP46mizchi2js7browser3dom8document();
  const initial = content();
  const node = _M0MP46mizchi2js7browser3dom8Document14createTextNode(doc, initial);
  _M0FP46mizchi4luna4luna6signal6effect(() => {
    const new_content = content();
    _M0MP46mizchi2js7browser3dom4Node14setTextContent(node, new_content);
  });
  return new _M0DTP56mizchi4luna8platform3dom7element7DomNode3Txt(node);
}
function _M0FP56mizchi4luna8platform3dom7element19apply__static__attr(elem, name, value) {
  if (name === "className") {
    _M0MP46mizchi2js7browser3dom7Element12setClassName(elem, value);
    return;
  } else {
    if (name === "value") {
      _M0MP36mizchi2js4core3Any5__set(elem, "value", value);
      return;
    } else {
      if (name === "checked") {
        _M0MP36mizchi2js4core3Any5__set(elem, "checked", value === "true");
        return;
      } else {
        if (name === "disabled") {
          if (value === "true") {
            _M0MP46mizchi2js7browser3dom7Element12setAttribute(elem, "disabled", "");
            return;
          } else {
            _M0MP46mizchi2js7browser3dom7Element15removeAttribute(elem, "disabled");
            return;
          }
        } else {
          _M0MP46mizchi2js7browser3dom7Element12setAttribute(elem, name, value);
          return;
        }
      }
    }
  }
}
function _M0FP56mizchi4luna8platform3dom7element20apply__style__string(elem, style) {
  _M0MP46mizchi2js7browser3dom7Element12setAttribute(elem, "style", style);
}
function _M0FP56mizchi4luna8platform3dom7element16apply__attribute(elem, name, value) {
  let handler;
  _L: {
    let getter;
    _L$2: {
      let s;
      _L$3: {
        switch (value.$tag) {
          case 0: {
            const _Static = value;
            const _s = _Static._0;
            s = _s;
            break _L$3;
          }
          case 1: {
            const _Dynamic = value;
            const _getter = _Dynamic._0;
            getter = _getter;
            break _L$2;
          }
          default: {
            const _Handler = value;
            const _handler = _Handler._0;
            handler = _handler;
            break _L;
          }
        }
      }
      if (name === "style") {
        _M0FP56mizchi4luna8platform3dom7element20apply__style__string(elem, s);
        return;
      } else {
        _M0FP56mizchi4luna8platform3dom7element19apply__static__attr(elem, name, s);
        return;
      }
    }
    _M0FP46mizchi4luna4luna6signal6effect(() => {
      const new_value = getter();
      if (name === "style") {
        _M0FP56mizchi4luna8platform3dom7element20apply__style__string(elem, new_value);
        return;
      } else {
        _M0FP56mizchi4luna8platform3dom7element19apply__static__attr(elem, name, new_value);
        return;
      }
    });
    return;
  }
  if (name === "__ref") {
    handler(elem);
    return;
  } else {
    _M0FP56mizchi4luna8platform3dom7element21apply__event__handler(elem, name, handler);
    return;
  }
}
function _M0MP56mizchi4luna8platform3dom7element10DomElement11from__jsdom(elem) {
  return new _M0TP56mizchi4luna8platform3dom7element10DomElement(elem);
}
function _M0MP56mizchi4luna8platform3dom7element7DomNode9to__jsdom(self) {
  let text;
  _L: {
    let elem;
    _L$2: {
      switch (self.$tag) {
        case 0: {
          const _El = self;
          const _elem = _El._0;
          elem = _elem;
          break _L$2;
        }
        case 1: {
          const _Txt = self;
          const _text = _Txt._0;
          text = _text;
          break _L;
        }
        default: {
          const _Raw = self;
          const _node = _Raw._0;
          return _node;
        }
      }
    }
    return elem.inner;
  }
  return text;
}
function _M0FP56mizchi4luna8platform3dom7element15create__element(tag, attrs, children) {
  const doc = _M0FP46mizchi2js7browser3dom8document();
  const elem = _M0MP46mizchi2js7browser3dom8Document13createElement(doc, tag);
  const _bind = attrs.length;
  let _tmp = 0;
  while (true) {
    const _ = _tmp;
    if (_ < _bind) {
      const attr = attrs[_];
      let name;
      let value;
      _L: {
        const _name = attr._0;
        const _value = attr._1;
        name = _name;
        value = _value;
        break _L;
      }
      _M0FP56mizchi4luna8platform3dom7element16apply__attribute(elem, name, value);
      _tmp = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  const _bind$2 = children.length;
  let _tmp$2 = 0;
  while (true) {
    const _ = _tmp$2;
    if (_ < _bind$2) {
      const child = children[_];
      _M0MP46mizchi2js7browser3dom4Node11appendChild(elem, _M0MP56mizchi4luna8platform3dom7element7DomNode9to__jsdom(child));
      _tmp$2 = _ + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return new _M0DTP56mizchi4luna8platform3dom7element7DomNode2El(_M0MP56mizchi4luna8platform3dom7element10DomElement11from__jsdom(elem));
}
function _M0MP56mizchi4luna8platform3dom7element10DomElement9to__jsdom(self) {
  return self.inner;
}
function _M0FP56mizchi4luna8platform3dom7element5mount(container, n) {
  _M0MP46mizchi2js7browser3dom4Node11appendChild(_M0MP56mizchi4luna8platform3dom7element10DomElement9to__jsdom(container), _M0MP56mizchi4luna8platform3dom7element7DomNode9to__jsdom(n));
}
function _M0FP56mizchi4luna8platform3dom7element5clear(container) {
  _M0MP46mizchi2js7browser3dom4Node14setTextContent(_M0MP56mizchi4luna8platform3dom7element10DomElement9to__jsdom(container), "");
}
function _M0FP56mizchi4luna8platform3dom7element6render(container, n) {
  _M0FP56mizchi4luna8platform3dom7element5clear(container);
  _M0FP56mizchi4luna8platform3dom7element5mount(container, n);
}
function _M0IPC16string6StringP56mizchi4luna8platform3dom7element9ToDomNode13to__dom__node(self) {
  const doc = _M0FP46mizchi2js7browser3dom8document();
  return new _M0DTP56mizchi4luna8platform3dom7element7DomNode3Txt(_M0MP46mizchi2js7browser3dom8Document14createTextNode(doc, self));
}
function _M0FP56mizchi4luna8platform3dom7element18double__to__string(d) {
  const any = d;
  return _M0MP36mizchi2js4core3Any6__call(any, "toString", []);
}
function _M0IP56mizchi4luna8platform3dom7element4AttrPB4Show6output(self, logger) {
  let b;
  _L: {
    let i;
    _L$2: {
      let d;
      _L$3: {
        let s;
        _L$4: {
          switch (self.$tag) {
            case 0: {
              const _AttrString = self;
              const _s = _AttrString._0;
              s = _s;
              break _L$4;
            }
            case 1: {
              const _AttrNumber = self;
              const _d = _AttrNumber._0;
              d = _d;
              break _L$3;
            }
            case 2: {
              const _AttrInt = self;
              const _i = _AttrInt._0;
              i = _i;
              break _L$2;
            }
            default: {
              const _AttrBool = self;
              const _b = _AttrBool._0;
              b = _b;
              break _L;
            }
          }
        }
        logger.method_table.method_0(logger.self, s);
        return;
      }
      logger.method_table.method_0(logger.self, _M0FP56mizchi4luna8platform3dom7element18double__to__string(d));
      return;
    }
    logger.method_table.method_0(logger.self, _M0MPC13int3Int18to__string_2einner(i, 10));
    return;
  }
  logger.method_table.method_0(logger.self, _M0IP016_24default__implPB4Show10to__stringGbE(b));
}
function _M0MP56mizchi4luna8platform3dom7element4Attr15to__attr__value(self) {
  return new _M0DTP56mizchi4luna8platform3dom7element9AttrValue6Static(_M0IP016_24default__implPB4Show10to__stringGRP56mizchi4luna8platform3dom7element4AttrE(self));
}
function _M0FP56mizchi4luna8platform3dom7element6events() {
  return _M0FP36mizchi2js4core11new__object();
}
function _M0FP56mizchi4luna8platform3dom7element20build__props_2einner(id, class_, style, on, ref_, attrs, dyn_attrs) {
  const result = [];
  let v;
  _L: {
    _L$2: {
      if (id === undefined) {
      } else {
        const _Some = id;
        const _v = _Some;
        v = _v;
        break _L$2;
      }
      break _L;
    }
    _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(result, { _0: "id", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue6Static(v) });
  }
  let v$2;
  _L$2: {
    _L$3: {
      if (class_ === undefined) {
      } else {
        const _Some = class_;
        const _v = _Some;
        v$2 = _v;
        break _L$3;
      }
      break _L$2;
    }
    _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(result, { _0: "className", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue6Static(v$2) });
  }
  let s;
  _L$3: {
    _L$4: {
      if (style === undefined) {
      } else {
        const _Some = style;
        const _s = _Some;
        s = _s;
        break _L$4;
      }
      break _L$3;
    }
    _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(result, { _0: "style", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue6Static(s) });
  }
  let handlers;
  _L$4: {
    _L$5: {
      if (on.$tag === 1) {
        const _Some = on;
        const _handlers = _Some._0;
        handlers = _handlers;
        break _L$5;
      }
      break _L$4;
    }
    const _bind = _M0MP56mizchi4luna8platform3dom7element10HandlerMap9to__attrs(handlers);
    const _bind$2 = _bind.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind$2) {
        const attr = _bind[_];
        _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(result, attr);
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
  }
  let cb;
  _L$5: {
    _L$6: {
      if (ref_ === undefined) {
      } else {
        const _Some = ref_;
        const _cb = _Some;
        cb = _cb;
        break _L$6;
      }
      break _L$5;
    }
    const handler = (el) => {
      cb(el);
    };
    _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(result, { _0: "__ref", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue7Handler(handler) });
  }
  let extra;
  _L$6: {
    _L$7: {
      if (attrs.$tag === 1) {
        const _Some = attrs;
        const _extra = _Some._0;
        extra = _extra;
        break _L$7;
      }
      break _L$6;
    }
    const _bind = extra.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const pair = extra[_];
        _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(result, { _0: pair._0, _1: _M0MP56mizchi4luna8platform3dom7element4Attr15to__attr__value(pair._1) });
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
  }
  let extra$2;
  _L$7: {
    _L$8: {
      if (dyn_attrs.$tag === 1) {
        const _Some = dyn_attrs;
        const _extra = _Some._0;
        extra$2 = _extra;
        break _L$8;
      }
      break _L$7;
    }
    const _bind = extra$2.length;
    let _tmp = 0;
    while (true) {
      const _ = _tmp;
      if (_ < _bind) {
        const pair = extra$2[_];
        _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(result, pair);
        _tmp = _ + 1 | 0;
        continue;
      } else {
        break;
      }
    }
  }
  return result;
}
function _M0FP56mizchi4luna8platform3dom7element3div(id, class_, style, dyn_class, dyn_style, on, ref_, attrs, dyn_attrs, children) {
  const props = _M0FP56mizchi4luna8platform3dom7element20build__props_2einner(id, class_, style, on, ref_, attrs, dyn_attrs);
  let getter;
  _L: {
    _L$2: {
      if (dyn_class === undefined) {
      } else {
        const _Some = dyn_class;
        const _getter = _Some;
        getter = _getter;
        break _L$2;
      }
      break _L;
    }
    _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(props, { _0: "className", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue7Dynamic(getter) });
  }
  let getter$2;
  _L$2: {
    _L$3: {
      if (dyn_style === undefined) {
      } else {
        const _Some = dyn_style;
        const _getter = _Some;
        getter$2 = _getter;
        break _L$3;
      }
      break _L$2;
    }
    _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(props, { _0: "style", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue7Dynamic(getter$2) });
  }
  return _M0FP56mizchi4luna8platform3dom7element15create__element("div", props, children);
}
function _M0FP56mizchi4luna8platform3dom7element1p(id, class_, style, dyn_class, dyn_style, on, ref_, attrs, dyn_attrs, children) {
  const props = _M0FP56mizchi4luna8platform3dom7element20build__props_2einner(id, class_, style, on, ref_, attrs, dyn_attrs);
  let getter;
  _L: {
    _L$2: {
      if (dyn_class === undefined) {
      } else {
        const _Some = dyn_class;
        const _getter = _Some;
        getter = _getter;
        break _L$2;
      }
      break _L;
    }
    _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(props, { _0: "className", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue7Dynamic(getter) });
  }
  let getter$2;
  _L$2: {
    _L$3: {
      if (dyn_style === undefined) {
      } else {
        const _Some = dyn_style;
        const _getter = _Some;
        getter$2 = _getter;
        break _L$3;
      }
      break _L$2;
    }
    _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(props, { _0: "style", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue7Dynamic(getter$2) });
  }
  return _M0FP56mizchi4luna8platform3dom7element15create__element("p", props, children);
}
function _M0FP56mizchi4luna8platform3dom7element1a(href, target, id, class_, style, dyn_class, dyn_style, on, ref_, attrs, dyn_attrs, children) {
  const props = _M0FP56mizchi4luna8platform3dom7element20build__props_2einner(id, class_, style, on, ref_, attrs, dyn_attrs);
  let v;
  _L: {
    _L$2: {
      if (href === undefined) {
      } else {
        const _Some = href;
        const _v = _Some;
        v = _v;
        break _L$2;
      }
      break _L;
    }
    _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(props, { _0: "href", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue6Static(v) });
  }
  let v$2;
  _L$2: {
    _L$3: {
      if (target === undefined) {
      } else {
        const _Some = target;
        const _v = _Some;
        v$2 = _v;
        break _L$3;
      }
      break _L$2;
    }
    _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(props, { _0: "target", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue6Static(v$2) });
  }
  let getter;
  _L$3: {
    _L$4: {
      if (dyn_class === undefined) {
      } else {
        const _Some = dyn_class;
        const _getter = _Some;
        getter = _getter;
        break _L$4;
      }
      break _L$3;
    }
    _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(props, { _0: "className", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue7Dynamic(getter) });
  }
  let getter$2;
  _L$4: {
    _L$5: {
      if (dyn_style === undefined) {
      } else {
        const _Some = dyn_style;
        const _getter = _Some;
        getter$2 = _getter;
        break _L$5;
      }
      break _L$4;
    }
    _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(props, { _0: "style", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue7Dynamic(getter$2) });
  }
  return _M0FP56mizchi4luna8platform3dom7element15create__element("a", props, children);
}
function _M0FP56mizchi4luna8platform3dom7element2h1(id, class_, style, dyn_class, dyn_style, on, ref_, attrs, dyn_attrs, children) {
  const props = _M0FP56mizchi4luna8platform3dom7element20build__props_2einner(id, class_, style, on, ref_, attrs, dyn_attrs);
  let getter;
  _L: {
    _L$2: {
      if (dyn_class === undefined) {
      } else {
        const _Some = dyn_class;
        const _getter = _Some;
        getter = _getter;
        break _L$2;
      }
      break _L;
    }
    _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(props, { _0: "className", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue7Dynamic(getter) });
  }
  let getter$2;
  _L$2: {
    _L$3: {
      if (dyn_style === undefined) {
      } else {
        const _Some = dyn_style;
        const _getter = _Some;
        getter$2 = _getter;
        break _L$3;
      }
      break _L$2;
    }
    _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(props, { _0: "style", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue7Dynamic(getter$2) });
  }
  return _M0FP56mizchi4luna8platform3dom7element15create__element("h1", props, children);
}
function _M0FP56mizchi4luna8platform3dom7element2h2(id, class_, style, dyn_class, dyn_style, on, ref_, attrs, dyn_attrs, children) {
  const props = _M0FP56mizchi4luna8platform3dom7element20build__props_2einner(id, class_, style, on, ref_, attrs, dyn_attrs);
  let getter;
  _L: {
    _L$2: {
      if (dyn_class === undefined) {
      } else {
        const _Some = dyn_class;
        const _getter = _Some;
        getter = _getter;
        break _L$2;
      }
      break _L;
    }
    _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(props, { _0: "className", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue7Dynamic(getter) });
  }
  let getter$2;
  _L$2: {
    _L$3: {
      if (dyn_style === undefined) {
      } else {
        const _Some = dyn_style;
        const _getter = _Some;
        getter$2 = _getter;
        break _L$3;
      }
      break _L$2;
    }
    _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(props, { _0: "style", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue7Dynamic(getter$2) });
  }
  return _M0FP56mizchi4luna8platform3dom7element15create__element("h2", props, children);
}
function _M0FP56mizchi4luna8platform3dom7element2ul(id, class_, style, dyn_class, dyn_style, on, ref_, attrs, dyn_attrs, children) {
  const props = _M0FP56mizchi4luna8platform3dom7element20build__props_2einner(id, class_, style, on, ref_, attrs, dyn_attrs);
  let getter;
  _L: {
    _L$2: {
      if (dyn_class === undefined) {
      } else {
        const _Some = dyn_class;
        const _getter = _Some;
        getter = _getter;
        break _L$2;
      }
      break _L;
    }
    _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(props, { _0: "className", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue7Dynamic(getter) });
  }
  let getter$2;
  _L$2: {
    _L$3: {
      if (dyn_style === undefined) {
      } else {
        const _Some = dyn_style;
        const _getter = _Some;
        getter$2 = _getter;
        break _L$3;
      }
      break _L$2;
    }
    _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(props, { _0: "style", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue7Dynamic(getter$2) });
  }
  return _M0FP56mizchi4luna8platform3dom7element15create__element("ul", props, children);
}
function _M0FP56mizchi4luna8platform3dom7element2li(id, class_, style, dyn_class, dyn_style, on, ref_, attrs, dyn_attrs, children) {
  const props = _M0FP56mizchi4luna8platform3dom7element20build__props_2einner(id, class_, style, on, ref_, attrs, dyn_attrs);
  let getter;
  _L: {
    _L$2: {
      if (dyn_class === undefined) {
      } else {
        const _Some = dyn_class;
        const _getter = _Some;
        getter = _getter;
        break _L$2;
      }
      break _L;
    }
    _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(props, { _0: "className", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue7Dynamic(getter) });
  }
  let getter$2;
  _L$2: {
    _L$3: {
      if (dyn_style === undefined) {
      } else {
        const _Some = dyn_style;
        const _getter = _Some;
        getter$2 = _getter;
        break _L$3;
      }
      break _L$2;
    }
    _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(props, { _0: "style", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue7Dynamic(getter$2) });
  }
  return _M0FP56mizchi4luna8platform3dom7element15create__element("li", props, children);
}
function _M0FP56mizchi4luna8platform3dom7element6button(disabled, id, class_, style, dyn_class, dyn_style, dyn_disabled, on, ref_, attrs, dyn_attrs, children) {
  const props = _M0FP56mizchi4luna8platform3dom7element20build__props_2einner(id, class_, style, on, ref_, attrs, dyn_attrs);
  if (disabled === -1) {
  } else {
    const _Some = disabled;
    const _x = _Some;
    if (_x === true) {
      _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(props, { _0: "disabled", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue6Static("true") });
    }
  }
  let getter;
  _L: {
    _L$2: {
      if (dyn_class === undefined) {
      } else {
        const _Some = dyn_class;
        const _getter = _Some;
        getter = _getter;
        break _L$2;
      }
      break _L;
    }
    _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(props, { _0: "className", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue7Dynamic(getter) });
  }
  let getter$2;
  _L$2: {
    _L$3: {
      if (dyn_style === undefined) {
      } else {
        const _Some = dyn_style;
        const _getter = _Some;
        getter$2 = _getter;
        break _L$3;
      }
      break _L$2;
    }
    _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(props, { _0: "style", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue7Dynamic(getter$2) });
  }
  let getter$3;
  _L$3: {
    _L$4: {
      if (dyn_disabled === undefined) {
      } else {
        const _Some = dyn_disabled;
        const _getter = _Some;
        getter$3 = _getter;
        break _L$4;
      }
      break _L$3;
    }
    _M0MPC15array5Array4pushGUsRP56mizchi4luna8platform3dom7element9AttrValueEE(props, { _0: "disabled", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue7Dynamic(() => _M0IP016_24default__implPB4Show10to__stringGbE(getter$3())) });
  }
  return _M0FP56mizchi4luna8platform3dom7element15create__element("button", props, children);
}
function _M0FP56mizchi4luna8platform3dom7element4text(content) {
  return _M0IPC16string6StringP56mizchi4luna8platform3dom7element9ToDomNode13to__dom__node(content);
}
function _M0FP56mizchi4luna8platform3dom7element9text__dyn(content) {
  return _M0FP56mizchi4luna8platform3dom7element10text__node(content);
}
function _M0IP28internal11gaato_2dnet4LangPB2Eq5equal(_x_118, _x_119) {
  switch (_x_118) {
    case 0: {
      if (_x_119 === 0) {
        return true;
      } else {
        return false;
      }
    }
    case 1: {
      if (_x_119 === 1) {
        return true;
      } else {
        return false;
      }
    }
    default: {
      if (_x_119 === 2) {
        return true;
      } else {
        return false;
      }
    }
  }
}
function _M0IP28internal11gaato_2dnet8InterestPB2Eq5equal(_x_114, _x_115) {
  switch (_x_114) {
    case 0: {
      if (_x_115 === 0) {
        return true;
      } else {
        return false;
      }
    }
    case 1: {
      if (_x_115 === 1) {
        return true;
      } else {
        return false;
      }
    }
    case 2: {
      if (_x_115 === 2) {
        return true;
      } else {
        return false;
      }
    }
    default: {
      if (_x_115 === 3) {
        return true;
      } else {
        return false;
      }
    }
  }
}
function _M0MP28internal11gaato_2dnet4Lang10to__string(self) {
  switch (self) {
    case 0: {
      return "ja";
    }
    case 1: {
      return "en";
    }
    default: {
      return "id";
    }
  }
}
function _M0FP28internal11gaato_2dnet4i18n(lang) {
  switch (lang) {
    case 0: {
      return new _M0TP28internal11gaato_2dnet4I18n("gaato.net", "ソフトウェアを書いています。Linux が好きで、hololive を楽しみつつ、言語も少しずつ勉強しています。", ["普段は Web、モバイル、AI を使った IoT まわりの開発をしています。", "ここには仕事のことよりも、自分が普段好きで触っていることを少し多めに置いています。"], "About", ["新しい技術に触れたり、手間を減らせる仕組みを整えたりするのが好きです。", "仕事の外では OSS へのコントリビュートや openSUSE 向けのパッケージングを続けています。"], "Lately", "最近やっていること", "仕事と趣味のあいだ", ["Ionic + Cordova 製アプリを Capacitor へ移行しています。", "PHP 製 CRM の保守や改善を進めています。", "インドネシア語を少しずつ勉強しています。英語ももう少し自然に使えるようになりたいです。"], "MoonBit Corner", "せっかく MoonBit で書いているので、型と signal で興味分野を切り替えられる小さい部品を置いています。", "Background", "Tokyo University of Science", "Applied Mathematics / 2020 - 2025 / 窓付きフーリエ変換と連続ウェーブレット変換を使った音源分離を研究しました。", "I Like", ["Linux", "openSUSE packaging", "hololive", "language learning"], "Elsewhere", ["code", "write", "notes"], ["GitHub でコードを書いています", "Qiita に日本語で書きます", "Zenn に短いメモを置きます"], "Links", ["いちばんよく更新している場所です。", "仕事まわりのプロフィールです。", "日本語で書いた記事です。", "短めのメモや記事です。", "パッケージやビルド作業です。", "openSUSE 側の活動です。", "KDE 側の活動です。"]);
    }
    case 1: {
      return new _M0TP28internal11gaato_2dnet4I18n("gaato.net", "I write software. I like Linux, enjoy hololive, and study languages a little at a time.", ["Most days I work across web, mobile, and AI-assisted IoT development.", "This site leans a bit more toward the things I personally like and keep returning to."], "About", ["I like trying new technology and building small systems that remove friction.", "Outside work I contribute to OSS and keep doing packaging work for openSUSE."], "Lately", "Things I have been spending time on", "between work and hobbies", ["Migrating an Ionic + Cordova application to Capacitor.", "Maintaining and improving a PHP-based CRM.", "Studying Indonesian a little at a time, and trying to get more comfortable in English too."], "MoonBit Corner", "Since this site is built with MoonBit, I left a small typed widget here that switches interests with signals.", "Background", "Tokyo University of Science", "Applied Mathematics / 2020 - 2025 / Researched source separation with STFT and continuous wavelet transform.", "I Like", ["Linux", "openSUSE packaging", "hololive", "language learning"], "Elsewhere", ["code", "write", "notes"], ["I write code on GitHub", "I publish Japanese posts on Qiita", "I leave shorter notes on Zenn"], "Links", ["Where most of my code ends up.", "A work-oriented profile.", "Articles written in Japanese.", "Short notes and posts.", "Packaging and build work.", "openSUSE-side activity.", "KDE-side activity."]);
    }
    default: {
      return new _M0TP28internal11gaato_2dnet4I18n("gaato.net", "Saya menulis perangkat lunak. Saya suka Linux, menikmati hololive, dan belajar bahasa sedikit demi sedikit.", ["Sehari-hari saya bekerja di pengembangan web, mobile, dan IoT berbantuan AI.", "Situs ini sedikit lebih condong ke hal-hal yang saya suka secara pribadi dan terus saya kerjakan."], "Tentang", ["Saya suka mencoba teknologi baru dan membuat sistem kecil yang mengurangi kerepotan.", "Di luar pekerjaan, saya berkontribusi ke OSS dan terus mengerjakan packaging untuk openSUSE."], "Akhir-Akhir Ini", "Hal-hal yang sedang saya kerjakan", "di antara pekerjaan dan hobi", ["Memigrasikan aplikasi Ionic + Cordova ke Capacitor.", "Merawat dan memperbaiki CRM berbasis PHP.", "Belajar bahasa Indonesia sedikit demi sedikit, dan juga ingin lebih natural memakai bahasa Inggris."], "MoonBit Corner", "Karena situs ini dibuat dengan MoonBit, saya menaruh komponen kecil berbasis tipe dan signal untuk mengganti minat di bawah ini.", "Latar Belakang", "Tokyo University of Science", "Applied Mathematics / 2020 - 2025 / Meneliti pemisahan sumber suara dengan STFT dan continuous wavelet transform.", "Saya Suka", ["Linux", "packaging openSUSE", "hololive", "belajar bahasa"], "Di Tempat Lain", ["code", "write", "notes"], ["Saya menulis kode di GitHub", "Saya menulis posting berbahasa Jepang di Qiita", "Saya menyimpan catatan pendek di Zenn"], "Tautan", ["Tempat yang paling sering saya perbarui.", "Profil yang lebih berorientasi kerja.", "Artikel dalam bahasa Jepang.", "Catatan dan tulisan pendek.", "Pekerjaan packaging dan build.", "Aktivitas di sisi openSUSE.", "Aktivitas di sisi KDE."]);
    }
  }
}
function _M0FP28internal11gaato_2dnet15interest__label(lang, interest) {
  switch (lang) {
    case 0: {
      switch (interest) {
        case 0: {
          return "Linux";
        }
        case 1: {
          return "OSS";
        }
        case 2: {
          return "hololive";
        }
        default: {
          return "language";
        }
      }
    }
    case 1: {
      switch (interest) {
        case 0: {
          return "Linux";
        }
        case 1: {
          return "OSS";
        }
        case 2: {
          return "hololive";
        }
        default: {
          return "language";
        }
      }
    }
    default: {
      switch (interest) {
        case 0: {
          return "Linux";
        }
        case 1: {
          return "OSS";
        }
        case 2: {
          return "hololive";
        }
        default: {
          return "language";
        }
      }
    }
  }
}
function _M0FP28internal11gaato_2dnet14interest__note(lang, interest) {
  switch (lang) {
    case 0: {
      switch (interest) {
        case 0: {
          return new _M0TP28internal11gaato_2dnet12InterestNote("Linux", ["長く Linux を日常環境として使っています。", "最近は openSUSE Kalpa Desktop みたいなイミュータブル寄りの環境も気に入っています。"]);
        }
        case 1: {
          return new _M0TP28internal11gaato_2dnet12InterestNote("OSS", ["小さい修正でも upstream に返せると気分が良いです。", "コードを書くこと自体より、継続して面倒を減らす仕組みの方に惹かれがちです。"]);
        }
        case 2: {
          return new _M0TP28internal11gaato_2dnet12InterestNote("hololive", ["作業の合間に見ることが多いです。", "技術とは別の文脈で元気をもらえるので、個人サイトには普通に置いておきたい要素です。"]);
        }
        default: {
          return new _M0TP28internal11gaato_2dnet12InterestNote("language learning", ["インドネシア語を少しずつ勉強しています。", "英語も、読むだけでなく自然に書いたり話したりできるようになりたいです。"]);
        }
      }
    }
    case 1: {
      switch (interest) {
        case 0: {
          return new _M0TP28internal11gaato_2dnet12InterestNote("Linux", ["Linux has been part of my everyday environment for a long time.", "Lately I have especially liked more immutable-leaning setups such as openSUSE Kalpa Desktop."]);
        }
        case 1: {
          return new _M0TP28internal11gaato_2dnet12InterestNote("OSS", ["It feels good when even a small fix can go back upstream.", "I am often more interested in reducing recurring friction than in code for its own sake."]);
        }
        case 2: {
          return new _M0TP28internal11gaato_2dnet12InterestNote("hololive", ["I often watch it between work sessions.", "It gives me energy from a completely different direction, so I want it to exist naturally on this site."]);
        }
        default: {
          return new _M0TP28internal11gaato_2dnet12InterestNote("language learning", ["I am studying Indonesian a little at a time.", "With English too, I want to get more natural not only in reading but also in writing and speaking."]);
        }
      }
    }
    default: {
      switch (interest) {
        case 0: {
          return new _M0TP28internal11gaato_2dnet12InterestNote("Linux", ["Linux sudah lama menjadi bagian dari lingkungan sehari-hari saya.", "Akhir-akhir ini saya terutama suka setup yang lebih condong ke immutable seperti openSUSE Kalpa Desktop."]);
        }
        case 1: {
          return new _M0TP28internal11gaato_2dnet12InterestNote("OSS", ["Rasanya menyenangkan kalau perbaikan kecil pun bisa dikirim kembali ke upstream.", "Saya sering lebih tertarik mengurangi kerepotan berulang daripada menulis kode demi kode itu sendiri."]);
        }
        case 2: {
          return new _M0TP28internal11gaato_2dnet12InterestNote("hololive", ["Saya sering menontonnya di sela-sela pekerjaan.", "Itu memberi energi dari arah yang berbeda, jadi saya ingin elemen ini ada secara alami di situs ini."]);
        }
        default: {
          return new _M0TP28internal11gaato_2dnet12InterestNote("language learning", ["Saya belajar bahasa Indonesia sedikit demi sedikit.", "Untuk bahasa Inggris juga, saya ingin lebih natural bukan hanya saat membaca tapi juga saat menulis dan berbicara."]);
        }
      }
    }
  }
}
function _M0FP28internal11gaato_2dnet5links() {
  return [new _M0TP28internal11gaato_2dnet11ProfileLink("GitHub", "https://github.com/gaato"), new _M0TP28internal11gaato_2dnet11ProfileLink("LinkedIn", "https://www.linkedin.com/in/gaato"), new _M0TP28internal11gaato_2dnet11ProfileLink("Qiita", "https://qiita.com/gaato"), new _M0TP28internal11gaato_2dnet11ProfileLink("Zenn", "https://zenn.dev/gaato"), new _M0TP28internal11gaato_2dnet11ProfileLink("openSUSE Build Service", "https://build.opensuse.org/users/gaato"), new _M0TP28internal11gaato_2dnet11ProfileLink("openSUSE Gitea", "https://src.opensuse.org/gaato"), new _M0TP28internal11gaato_2dnet11ProfileLink("KDE GitLab", "https://invent.kde.org/gaato")];
}
function _M0FP28internal11gaato_2dnet9interests() {
  return [0, 1, 2, 3];
}
function _M0FP28internal11gaato_2dnet10clamp__int(value, lower, upper) {
  return value < lower ? lower : value > upper ? upper : value;
}
function _M0FP28internal11gaato_2dnet11max__double(left, right) {
  return left > right ? left : right;
}
function _M0FP28internal11gaato_2dnet11min__double(left, right) {
  return left < right ? left : right;
}
function _M0FP28internal11gaato_2dnet9ceil__div(value, divisor) {
  if (divisor === 0) {
    $panic();
  }
  return ((value + divisor | 0) - 1 | 0) / divisor | 0;
}
function _M0FP28internal11gaato_2dnet16make__int__array(length) {
  const arr = [];
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < length) {
      _M0MPC15array5Array4pushGiE(arr, 0);
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return arr;
}
function _M0FP28internal11gaato_2dnet19make__double__array(length) {
  const arr = [];
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < length) {
      _M0MPC15array5Array4pushGdE(arr, 0);
      _tmp = i + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return arr;
}
function _M0FP28internal11gaato_2dnet11wrap__index(value, size) {
  return value < 0 ? value + size | 0 : value >= size ? value - size | 0 : value;
}
function _M0FP28internal11gaato_2dnet13random__index(limit) {
  return _M0MP46mizchi2js8builtins4math4Math5floor(_M0MP46mizchi2js8builtins4math4Math6random() * (limit + 0));
}
function _M0FP28internal11gaato_2dnet26ensure__background__canvas(doc) {
  let existing;
  _L: {
    const _bind = _M0MP46mizchi2js7browser3dom8Document13querySelector(doc, ".background-automaton");
    if (_bind.$tag === 1) {
      const _Some = _bind;
      const _existing = _Some._0;
      existing = _existing;
      break _L;
    } else {
      const canvas = _M0MP46mizchi2js7browser3dom8Document13createElement(doc, "canvas");
      _M0MP46mizchi2js7browser3dom7Element12setClassName(canvas, "background-automaton");
      _M0MP46mizchi2js7browser3dom7Element12setAttribute(canvas, "aria-hidden", "true");
      let body;
      _L$2: {
        _L$3: {
          const _bind$2 = _M0MP46mizchi2js7browser3dom8Document4body(doc);
          if (_bind$2.$tag === 1) {
            const _Some = _bind$2;
            const _body = _Some._0;
            body = _body;
            break _L$3;
          }
          break _L$2;
        }
        _M0MP46mizchi2js7browser3dom7Element7prepend(body, [canvas]);
      }
      return canvas;
    }
  }
  return existing;
}
function _M0FP28internal11gaato_2dnet18render__background(state) {
  _M0MP46mizchi2js7browser6canvas24CanvasRenderingContext2D9clearRect(state.ctx, 0, 0, state.width + 0, state.height + 0);
  let _tmp = 0;
  while (true) {
    const row = _tmp;
    if (row < state.rows) {
      let _tmp$2 = 0;
      while (true) {
        const column = _tmp$2;
        if (column < state.columns) {
          const index = (Math.imul(row, state.columns) | 0) + column | 0;
          const value = _M0MPC15array5Array2atGdE(state.energy, index);
          if (value >= 0.03) {
            const x = (Math.imul(column, state.cell_size) | 0) + 0;
            const y = (Math.imul(row, state.cell_size) | 0) + 0;
            const inset = (state.cell_size + 0) * 0.08;
            const glow = _M0MPC15array5Array2atGiE(state.current, index) === 1 ? value : value * 0.72;
            const red = _M0MP46mizchi2js8builtins4math4Math5round(8 + glow * 10);
            const green = _M0MP46mizchi2js8builtins4math4Math5round(102 + glow * 64);
            const blue = _M0MP46mizchi2js8builtins4math4Math5round(108 + glow * 82);
            const alpha = 0.14 + glow * 0.32;
            state.ctx.fillStyle = `rgba(${_M0MPC13int3Int18to__string_2einner(red, 10)}, ${_M0MPC13int3Int18to__string_2einner(green, 10)}, ${_M0MPC13int3Int18to__string_2einner(blue, 10)}, ${_M0MPC16double6Double10to__string(alpha)})`;
            _M0MP46mizchi2js7browser6canvas24CanvasRenderingContext2D8fillRect(state.ctx, x + inset, y + inset, state.cell_size + 0 - inset * 2, state.cell_size + 0 - inset * 2);
          }
          _tmp$2 = column + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      _tmp = row + 1 | 0;
      continue;
    } else {
      return;
    }
  }
}
function _M0FP28internal11gaato_2dnet13inject__noise(state, strength) {
  const count = _M0MP46mizchi2js8builtins4math4Math5round((state.current.length + 0) * strength * 0.18);
  const splashes = count > 4 ? count : 4;
  let _tmp = 0;
  while (true) {
    const i = _tmp;
    if (i < splashes) {
      const anchor_column = _M0FP28internal11gaato_2dnet13random__index(state.columns);
      const anchor_row = _M0FP28internal11gaato_2dnet13random__index(state.rows);
      let _tmp$2 = -1;
      while (true) {
        const row_offset = _tmp$2;
        if (row_offset <= 1) {
          let _tmp$3 = -1;
          while (true) {
            const column_offset = _tmp$3;
            if (column_offset <= 1) {
              const row = _M0FP28internal11gaato_2dnet11wrap__index(anchor_row + row_offset | 0, state.rows);
              const column = _M0FP28internal11gaato_2dnet11wrap__index(anchor_column + column_offset | 0, state.columns);
              const cell_index = (Math.imul(row, state.columns) | 0) + column | 0;
              if (_M0MP46mizchi2js8builtins4math4Math6random() > 0.45) {
                _M0MPC15array5Array3setGiE(state.next, cell_index, 1);
                _M0MPC15array5Array3setGdE(state.energy, cell_index, _M0FP28internal11gaato_2dnet11max__double(_M0MPC15array5Array2atGdE(state.energy, cell_index), 0.45));
              }
              _tmp$3 = column_offset + 1 | 0;
              continue;
            } else {
              break;
            }
          }
          _tmp$2 = row_offset + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      _tmp = i + 1 | 0;
      continue;
    } else {
      return;
    }
  }
}
function _M0FP28internal11gaato_2dnet16seed__background(state) {
  let _tmp = 0;
  while (true) {
    const index = _tmp;
    if (index < state.current.length) {
      const alive = _M0MP46mizchi2js8builtins4math4Math6random() > 0.81 ? 1 : 0;
      _M0MPC15array5Array3setGiE(state.current, index, alive);
      _M0MPC15array5Array3setGiE(state.next, index, 0);
      _M0MPC15array5Array3setGdE(state.energy, index, alive === 1 ? 0.6 + _M0MP46mizchi2js8builtins4math4Math6random() * 0.3 : 0);
      _tmp = index + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  _M0FP28internal11gaato_2dnet13inject__noise(state, 0.12);
  state.generation = 1;
}
function _M0FP28internal11gaato_2dnet16count__neighbors(state, row, column) {
  const count = new _M0TPB8MutLocalGiE(0);
  let _tmp = -1;
  while (true) {
    const row_offset = _tmp;
    if (row_offset <= 1) {
      let _tmp$2 = -1;
      while (true) {
        const column_offset = _tmp$2;
        if (column_offset <= 1) {
          if (row_offset !== 0 || column_offset !== 0) {
            const neighbor_row = _M0FP28internal11gaato_2dnet11wrap__index(row + row_offset | 0, state.rows);
            const neighbor_column = _M0FP28internal11gaato_2dnet11wrap__index(column + column_offset | 0, state.columns);
            count.val = count.val + _M0MPC15array5Array2atGiE(state.current, (Math.imul(neighbor_row, state.columns) | 0) + neighbor_column | 0) | 0;
          }
          _tmp$2 = column_offset + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      _tmp = row_offset + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  return count.val;
}
function _M0FP28internal11gaato_2dnet16step__background(state) {
  const alive_count = new _M0TPB8MutLocalGiE(0);
  let _tmp = 0;
  while (true) {
    const row = _tmp;
    if (row < state.rows) {
      let _tmp$2 = 0;
      while (true) {
        const column = _tmp$2;
        if (column < state.columns) {
          const index = (Math.imul(row, state.columns) | 0) + column | 0;
          const alive = _M0MPC15array5Array2atGiE(state.current, index) === 1;
          const neighbors = _M0FP28internal11gaato_2dnet16count__neighbors(state, row, column);
          const next_alive = neighbors === 3 || alive && neighbors === 2 ? 1 : 0;
          _M0MPC15array5Array3setGiE(state.next, index, next_alive);
          const previous_energy = _M0MPC15array5Array2atGdE(state.energy, index);
          _M0MPC15array5Array3setGdE(state.energy, index, next_alive === 1 ? _M0FP28internal11gaato_2dnet11min__double(1, previous_energy + 0.18) : _M0FP28internal11gaato_2dnet11max__double(0, previous_energy - 0.055));
          alive_count.val = alive_count.val + next_alive | 0;
          _tmp$2 = column + 1 | 0;
          continue;
        } else {
          break;
        }
      }
      _tmp = row + 1 | 0;
      continue;
    } else {
      break;
    }
  }
  let _tmp$2;
  if (alive_count.val < _M0MP46mizchi2js8builtins4math4Math5round(((Math.imul(state.columns, state.rows) | 0) + 0) * 0.08)) {
    _tmp$2 = true;
  } else {
    if (18 === 0) {
      $panic();
    }
    _tmp$2 = (state.generation % 18 | 0) === 0;
  }
  if (_tmp$2) {
    _M0FP28internal11gaato_2dnet13inject__noise(state, 0.045);
  }
  const current = state.current;
  state.current = state.next;
  state.next = current;
  state.generation = state.generation + 1 | 0;
}
function _M0FP28internal11gaato_2dnet18resize__background(state) {
  state.width = _M0MP46mizchi2js7browser3dom6Window10innerWidth(state.win);
  state.height = _M0MP46mizchi2js7browser3dom6Window11innerHeight(state.win);
  state.dpr = _M0FP28internal11gaato_2dnet11min__double(_M0MP46mizchi2js7browser3dom6Window16devicePixelRatio(state.win), 2);
  state.reduced_motion = _M0FP28internal11gaato_2dnet24prefers__reduced__motion(state.win);
  state.cell_size = _M0FP28internal11gaato_2dnet10clamp__int(_M0MP46mizchi2js8builtins4math4Math5round((state.width + 0) / (72 + 0)), 10, 18);
  state.columns = _M0FP28internal11gaato_2dnet9ceil__div(state.width, state.cell_size);
  state.rows = _M0FP28internal11gaato_2dnet9ceil__div(state.height, state.cell_size);
  state.canvas.width = _M0MP46mizchi2js8builtins4math4Math5round((state.width + 0) * state.dpr);
  state.canvas.height = _M0MP46mizchi2js8builtins4math4Math5round((state.height + 0) * state.dpr);
  _M0MP46mizchi2js7browser6canvas24CanvasRenderingContext2D12setTransform(state.ctx, state.dpr, 0, 0, state.dpr, 0, 0);
  const cell_count = Math.imul(state.columns, state.rows) | 0;
  state.current = _M0FP28internal11gaato_2dnet16make__int__array(cell_count);
  state.next = _M0FP28internal11gaato_2dnet16make__int__array(cell_count);
  state.energy = _M0FP28internal11gaato_2dnet19make__double__array(cell_count);
  _M0FP28internal11gaato_2dnet16seed__background(state);
  _M0FP28internal11gaato_2dnet18render__background(state);
}
function _M0FP28internal11gaato_2dnet27schedule__background__frame(state) {
  _M0MP46mizchi2js7browser3dom6Window21requestAnimationFrame(state.win, (time) => {
    if (state.last_time === 0) {
      state.last_time = time;
    }
    const delta = new _M0TPB8MutLocalGdE(time - state.last_time);
    if (delta.val > 1000) {
      delta.val = 1000;
    }
    state.last_time = time;
    state.accumulated = state.accumulated + delta.val;
    const step_ms = state.reduced_motion ? 520 : 140;
    while (true) {
      if (state.accumulated >= step_ms) {
        _M0FP28internal11gaato_2dnet16step__background(state);
        state.accumulated = state.accumulated - step_ms;
        continue;
      } else {
        break;
      }
    }
    _M0FP28internal11gaato_2dnet18render__background(state);
    _M0FP28internal11gaato_2dnet27schedule__background__frame(state);
  });
}
function _M0FP28internal11gaato_2dnet27mount__cellular__background() {
  const doc = _M0FP46mizchi2js7browser3dom8document();
  const win = _M0FP46mizchi2js7browser3dom6window();
  const canvas = _M0FP28internal11gaato_2dnet26ensure__background__canvas(doc);
  const ctx = _M0MP46mizchi2js7browser3dom17HTMLCanvasElement10getContext(canvas, "2d");
  const state = new _M0TP28internal11gaato_2dnet15BackgroundState(win, canvas, ctx, 0, 0, 0, 0, 1, 10, 0, 0, 0, [], [], [], false);
  _M0FP28internal11gaato_2dnet18resize__background(state);
  _M0MP46mizchi2js3web5event11EventTarget24addEventListener_2einner(win, "resize", (_discard_) => {
    _M0FP28internal11gaato_2dnet18resize__background(state);
  }, false, false, false, _M0DTPC16option6OptionGRP311moonbitlang5async9js__async11AbortSignalE4None__);
  _M0FP28internal11gaato_2dnet27schedule__background__frame(state);
}
function _M0FP28internal11gaato_2dnet12lang__button(lang, current) {
  return _M0FP56mizchi4luna8platform3dom7element6button(-1, undefined, undefined, undefined, undefined, undefined, undefined, new _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4Some(_M0MP56mizchi4luna8platform3dom7element10HandlerMap5click(_M0FP56mizchi4luna8platform3dom7element6events(), (_discard_) => {
    _M0MP46mizchi4luna4luna6signal6Signal3setGRP28internal11gaato_2dnet4LangE(current, lang);
  })), undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, new _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4Some([{ _0: "data-active", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue7Dynamic(() => _M0IP28internal11gaato_2dnet4LangPB2Eq5equal(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(current), lang) ? "true" : "false") }]), [_M0FP56mizchi4luna8platform3dom7element4text(_M0MP28internal11gaato_2dnet4Lang10to__string(lang))]);
}
function _M0FP28internal11gaato_2dnet16interest__button(interest, current_interest, current_lang) {
  return _M0FP56mizchi4luna8platform3dom7element6button(-1, undefined, "interest-button", undefined, undefined, undefined, undefined, new _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4Some(_M0MP56mizchi4luna8platform3dom7element10HandlerMap5click(_M0FP56mizchi4luna8platform3dom7element6events(), (_discard_) => {
    _M0MP46mizchi4luna4luna6signal6Signal3setGRP28internal11gaato_2dnet8InterestE(current_interest, interest);
  })), undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, new _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4Some([{ _0: "data-active", _1: new _M0DTP56mizchi4luna8platform3dom7element9AttrValue7Dynamic(() => _M0IP28internal11gaato_2dnet8InterestPB2Eq5equal(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet8InterestE(current_interest), interest) ? "true" : "false") }]), [_M0FP56mizchi4luna8platform3dom7element9text__dyn(() => _M0FP28internal11gaato_2dnet15interest__label(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(current_lang), interest))]);
}
function _M0FP28internal11gaato_2dnet13summary__line(index, current) {
  return _M0FP56mizchi4luna8platform3dom7element1p(undefined, undefined, undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element9text__dyn(() => _M0MPC15array5Array2atGsE(_M0FP28internal11gaato_2dnet4i18n(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(current)).summary, index))]);
}
function _M0FP28internal11gaato_2dnet11about__line(index, current) {
  return _M0FP56mizchi4luna8platform3dom7element1p(undefined, undefined, undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element9text__dyn(() => _M0MPC15array5Array2atGsE(_M0FP28internal11gaato_2dnet4i18n(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(current)).about, index))]);
}
function _M0FP28internal11gaato_2dnet14current__point(index, current) {
  return _M0FP56mizchi4luna8platform3dom7element2li(undefined, undefined, undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element9text__dyn(() => _M0MPC15array5Array2atGsE(_M0FP28internal11gaato_2dnet4i18n(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(current)).current_points, index))]);
}
function _M0FP28internal11gaato_2dnet11focus__area(index, current) {
  return _M0FP56mizchi4luna8platform3dom7element2li(undefined, "tag", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element9text__dyn(() => _M0MPC15array5Array2atGsE(_M0FP28internal11gaato_2dnet4i18n(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(current)).focus_areas, index))]);
}
function _M0FP28internal11gaato_2dnet12signal__card(index, current) {
  return _M0FP56mizchi4luna8platform3dom7element3div(undefined, "metric-card", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element1p(undefined, "metric-value", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element9text__dyn(() => _M0MPC15array5Array2atGsE(_M0FP28internal11gaato_2dnet4i18n(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(current)).signal_values, index))]), _M0FP56mizchi4luna8platform3dom7element1p(undefined, "metric-label", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element9text__dyn(() => _M0MPC15array5Array2atGsE(_M0FP28internal11gaato_2dnet4i18n(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(current)).signal_labels, index))])]);
}
function _M0FP28internal11gaato_2dnet14interest__line(index, current_lang, current_interest) {
  return _M0FP56mizchi4luna8platform3dom7element1p(undefined, undefined, undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element9text__dyn(() => _M0MPC15array5Array2atGsE(_M0FP28internal11gaato_2dnet14interest__note(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(current_lang), _M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet8InterestE(current_interest)).lines, index))]);
}
function _M0FP28internal11gaato_2dnet10link__card(index, current) {
  const link = _M0MPC15array5Array2atGsE(_M0FP28internal11gaato_2dnet5links(), index);
  return _M0FP56mizchi4luna8platform3dom7element2li(undefined, undefined, undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element1a(link.url, "_blank", undefined, "link-card", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, new _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4Some([{ _0: "rel", _1: new _M0DTP56mizchi4luna8platform3dom7element4Attr10AttrString("noopener noreferrer") }]), _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element3div(undefined, "link-label-row", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element1p(undefined, "link-label", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element4text(link.label)]), _M0FP56mizchi4luna8platform3dom7element1p(undefined, "link-arrow", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element4text("↗")])]), _M0FP56mizchi4luna8platform3dom7element1p(undefined, "link-note", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element9text__dyn(() => _M0MPC15array5Array2atGsE(_M0FP28internal11gaato_2dnet4i18n(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(current)).link_notes, index))])])]);
}
(() => {
  const current_lang = _M0FP46mizchi4luna4luna6signal6signalGRP28internal11gaato_2dnet4LangE(0);
  const current_interest = _M0FP46mizchi4luna4luna6signal6signalGRP28internal11gaato_2dnet8InterestE(0);
  const doc = _M0FP46mizchi2js7browser3dom8document();
  _M0FP28internal11gaato_2dnet27mount__cellular__background();
  let el;
  _L: {
    const _bind = _M0MP46mizchi2js7browser3dom8Document14getElementById(doc, "app");
    if (_bind.$tag === 1) {
      const _Some = _bind;
      const _el = _Some._0;
      el = _el;
      break _L;
    } else {
      return;
    }
  }
  const app = _M0FP56mizchi4luna8platform3dom7element3div(undefined, "page", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element3div(undefined, "topbar", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element3div(undefined, "eyebrow-block", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element1p(undefined, "eyebrow", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element9text__dyn(() => _M0FP28internal11gaato_2dnet4i18n(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(current_lang)).eyebrow)])]), _M0FP56mizchi4luna8platform3dom7element3div(undefined, "lang-switcher", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP28internal11gaato_2dnet12lang__button(0, current_lang), _M0FP28internal11gaato_2dnet12lang__button(1, current_lang), _M0FP28internal11gaato_2dnet12lang__button(2, current_lang)])]), _M0FP56mizchi4luna8platform3dom7element3div(undefined, "panel hero", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element2h1(undefined, undefined, undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element4text("がーと / gaato")]), _M0FP56mizchi4luna8platform3dom7element1p(undefined, "headline", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element9text__dyn(() => _M0FP28internal11gaato_2dnet4i18n(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(current_lang)).headline)]), _M0FP56mizchi4luna8platform3dom7element3div(undefined, "summary", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP28internal11gaato_2dnet13summary__line(0, current_lang), _M0FP28internal11gaato_2dnet13summary__line(1, current_lang)])]), _M0FP56mizchi4luna8platform3dom7element3div(undefined, "section-grid", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element3div(undefined, "panel", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element2h2(undefined, "section-title", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element9text__dyn(() => _M0FP28internal11gaato_2dnet4i18n(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(current_lang)).about_title)]), _M0FP56mizchi4luna8platform3dom7element3div(undefined, "stack", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP28internal11gaato_2dnet11about__line(0, current_lang), _M0FP28internal11gaato_2dnet11about__line(1, current_lang)])]), _M0FP56mizchi4luna8platform3dom7element3div(undefined, "panel", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element2h2(undefined, "section-title", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element9text__dyn(() => _M0FP28internal11gaato_2dnet4i18n(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(current_lang)).current_title)]), _M0FP56mizchi4luna8platform3dom7element1p(undefined, "card-title", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element9text__dyn(() => _M0FP28internal11gaato_2dnet4i18n(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(current_lang)).current_role)]), _M0FP56mizchi4luna8platform3dom7element1p(undefined, "meta-line", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element9text__dyn(() => _M0FP28internal11gaato_2dnet4i18n(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(current_lang)).current_meta)]), _M0FP56mizchi4luna8platform3dom7element2ul(undefined, "detail-list", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP28internal11gaato_2dnet14current__point(0, current_lang), _M0FP28internal11gaato_2dnet14current__point(1, current_lang), _M0FP28internal11gaato_2dnet14current__point(2, current_lang)])]), _M0FP56mizchi4luna8platform3dom7element3div(undefined, "panel panel-wide", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element2h2(undefined, "section-title", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element9text__dyn(() => _M0FP28internal11gaato_2dnet4i18n(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(current_lang)).moonbit_title)]), _M0FP56mizchi4luna8platform3dom7element1p(undefined, "meta-line", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element9text__dyn(() => _M0FP28internal11gaato_2dnet4i18n(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(current_lang)).moonbit_intro)]), _M0FP56mizchi4luna8platform3dom7element3div(undefined, "interest-switcher", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, _M0MPC15array5Array3mapGRP28internal11gaato_2dnet8InterestRP56mizchi4luna8platform3dom7element7DomNodeE(_M0FP28internal11gaato_2dnet9interests(), (interest) => _M0FP28internal11gaato_2dnet16interest__button(interest, current_interest, current_lang))), _M0FP56mizchi4luna8platform3dom7element3div(undefined, "interest-panel", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element1p(undefined, "card-title", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element9text__dyn(() => _M0FP28internal11gaato_2dnet14interest__note(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(current_lang), _M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet8InterestE(current_interest)).title)]), _M0FP28internal11gaato_2dnet14interest__line(0, current_lang, current_interest), _M0FP28internal11gaato_2dnet14interest__line(1, current_lang, current_interest)])]), _M0FP56mizchi4luna8platform3dom7element3div(undefined, "panel", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element2h2(undefined, "section-title", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element9text__dyn(() => _M0FP28internal11gaato_2dnet4i18n(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(current_lang)).focus_title)]), _M0FP56mizchi4luna8platform3dom7element2ul(undefined, "tag-list", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP28internal11gaato_2dnet11focus__area(0, current_lang), _M0FP28internal11gaato_2dnet11focus__area(1, current_lang), _M0FP28internal11gaato_2dnet11focus__area(2, current_lang), _M0FP28internal11gaato_2dnet11focus__area(3, current_lang)])]), _M0FP56mizchi4luna8platform3dom7element3div(undefined, "panel", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element2h2(undefined, "section-title", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element9text__dyn(() => _M0FP28internal11gaato_2dnet4i18n(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(current_lang)).education_title)]), _M0FP56mizchi4luna8platform3dom7element1p(undefined, "card-title", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element9text__dyn(() => _M0FP28internal11gaato_2dnet4i18n(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(current_lang)).education_school)]), _M0FP56mizchi4luna8platform3dom7element1p(undefined, "meta-line", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element9text__dyn(() => _M0FP28internal11gaato_2dnet4i18n(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(current_lang)).education_detail)])])]), _M0FP56mizchi4luna8platform3dom7element3div(undefined, "panel", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element2h2(undefined, "section-title", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element9text__dyn(() => _M0FP28internal11gaato_2dnet4i18n(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(current_lang)).signals_title)]), _M0FP56mizchi4luna8platform3dom7element3div(undefined, "metric-grid", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP28internal11gaato_2dnet12signal__card(0, current_lang), _M0FP28internal11gaato_2dnet12signal__card(1, current_lang), _M0FP28internal11gaato_2dnet12signal__card(2, current_lang)])]), _M0FP56mizchi4luna8platform3dom7element3div(undefined, "panel", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element2h2(undefined, "section-title", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP56mizchi4luna8platform3dom7element9text__dyn(() => _M0FP28internal11gaato_2dnet4i18n(_M0MP46mizchi4luna4luna6signal6Signal3getGRP28internal11gaato_2dnet4LangE(current_lang)).links_title)]), _M0FP56mizchi4luna8platform3dom7element2ul(undefined, "links", undefined, undefined, undefined, _M0DTPC16option6OptionGRP56mizchi4luna8platform3dom7element10HandlerMapE4None__, undefined, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element4AttrEEE4None__, _M0DTPC16option6OptionGRPB5ArrayGUsRP56mizchi4luna8platform3dom7element9AttrValueEEE4None__, [_M0FP28internal11gaato_2dnet10link__card(0, current_lang), _M0FP28internal11gaato_2dnet10link__card(1, current_lang), _M0FP28internal11gaato_2dnet10link__card(2, current_lang), _M0FP28internal11gaato_2dnet10link__card(3, current_lang), _M0FP28internal11gaato_2dnet10link__card(4, current_lang), _M0FP28internal11gaato_2dnet10link__card(5, current_lang), _M0FP28internal11gaato_2dnet10link__card(6, current_lang)])])]);
  _M0FP56mizchi4luna8platform3dom7element6render(_M0MP56mizchi4luna8platform3dom7element10DomElement11from__jsdom(el), app);
})();
//# sourceMappingURL=gaato-net.js.map
