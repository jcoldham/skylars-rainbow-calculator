// Skylar's Rainbow Calculator: the calculator's brain.
// This file has no buttons, sounds or animations, just the math and the rules
// for what each key press does. index.html draws the screen around it, and
// tests.html checks it.

(function (root) {
  "use strict";

  const OPS = ["+", "−", "×", "÷"];
  const MAX_DIGITS = 12;

  function isOp(t) { return typeof t === "string"; }

  // Works out a list like [2, "+", 3, "×", 4].
  // × and ÷ go first, then + and −, so 2 + 3 × 4 = 14 like a real calculator.
  // Returns a number, or "zero" for divide-by-zero, or "big" if the answer overflows.
  function evaluate(list) {
    const stack = [list[0]];
    for (let i = 1; i < list.length; i += 2) {
      const op = list[i], n = list[i + 1];
      if (op === "×") stack.push(stack.pop() * n);
      else if (op === "÷") {
        if (n === 0) return "zero";
        stack.push(stack.pop() / n);
      } else stack.push(op, n);
    }
    let total = stack[0];
    for (let i = 1; i < stack.length; i += 2) {
      total = stack[i] === "+" ? total + stack[i + 1] : total - stack[i + 1];
    }
    if (!isFinite(total)) return "big";
    // Rounding to 12 significant digits hides tiny errors like 0.1 + 0.2 = 0.30000000000000004
    return parseFloat(total.toPrecision(12));
  }

  // Turns a number into the text shown on screen.
  function fmt(n) {
    if (Math.abs(n) >= 1e12 || (Math.abs(n) < 1e-6 && n !== 0)) return n.toExponential(4);
    return String(n);
  }

  // Makes a new calculator. press(label) handles one key and returns what happened:
  // "digit", "op", "back", "clear", "equals", "zero", "big", or null if the key was ignored.
  // display() returns the two lines of text to show.
  function createCalculator() {
    let tokens = [];   // numbers and operators entered so far, e.g. [7, "+", 3]
    let cur = "";      // the number being typed right now
    let result = null; // last answer, after pressing =
    let error = null;  // "zero" or "big" after a failed =

    function resetAll() { tokens = []; cur = ""; result = null; error = null; }

    function pressDigit(d) {
      if (result !== null || error) resetAll();
      if (d === ".") {
        if (cur.includes(".")) return null;
        cur = cur ? cur + "." : "0.";
      } else if (cur === "0") {
        cur = d;
      } else if (cur.replace(".", "").replace("-", "").length < MAX_DIGITS) {
        cur += d;
      } else {
        return null;
      }
      return "digit";
    }

    function pressOp(op) {
      error = null;
      if (result !== null) { tokens = []; cur = String(result); result = null; }
      if (cur === "" || cur === "0.") {
        if (tokens.length && isOp(tokens[tokens.length - 1])) tokens[tokens.length - 1] = op;
        else if (!tokens.length) tokens = [0, op];
        cur = "";
      } else {
        tokens.push(parseFloat(cur), op);
        cur = "";
      }
      return "op";
    }

    function pressBack() {
      if (result !== null || error) resetAll();
      else if (cur) cur = cur.slice(0, -1);
      else if (tokens.length) {
        tokens.pop();
        const n = String(tokens.pop());
        // Numbers like 1e+21 can't be edited digit by digit, so remove them whole
        cur = n.includes("e") ? "" : n;
      }
      if (cur === "-") cur = "";
      return "back";
    }

    function pressEquals() {
      if (result !== null || error) return null;
      const list = [...tokens];
      if (cur !== "") list.push(parseFloat(cur));
      else if (list.length && isOp(list[list.length - 1])) list.pop();
      if (list.length < 3) return null;
      const answer = evaluate(list);
      if (typeof answer === "string") {
        tokens = []; cur = ""; error = answer;
        return answer;
      }
      tokens = list; cur = ""; result = answer;
      return "equals";
    }

    function press(label) {
      if (/^[0-9.]$/.test(label)) return pressDigit(label);
      if (OPS.includes(label)) return pressOp(label);
      if (label === "⌫") return pressBack();
      if (label === "C") { resetAll(); return "clear"; }
      if (label === "=") return pressEquals();
      return null;
    }

    function display() {
      if (error === "zero") return { expr: "Can't divide by zero!", main: "Oops! 🙈" };
      if (error === "big") return { expr: "That number is too big!", main: "Oops! 🙈" };
      let expr = tokens.map(t => (isOp(t) ? ` ${t} ` : fmt(t))).join("") + cur;
      if (result !== null) expr += " =";
      let main;
      if (result !== null) main = fmt(result);
      else if (cur) main = cur;
      else if (tokens.length) main = fmt(tokens[tokens.length - 2]);
      else main = "0";
      return { expr, main };
    }

    return { press, display };
  }

  const api = { createCalculator, evaluate, fmt };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Calc = api;
})(this);
