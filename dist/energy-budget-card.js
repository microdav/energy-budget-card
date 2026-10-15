/*
 * Energy Budget Card for Home Assistant
 * https://github.com/microdav/energy-budget-card
 *
 * Monthly electricity budget tracking built on the Energy dashboard's long-term
 * cost statistics: no helper, template or automation needed.
 */

const CARD_VERSION = "1.2.0";
const CARD_TYPE = "energy-budget-card";
const REFRESH_MS = 10 * 60 * 1000;
const SHOW_KEYS = ["gauge", "summary", "table", "average", "settlement", "remaining"];

const STRINGS = {
  en: {
    title: "Budget tracker",
    loading: "Loading statistics…",
    no_source:
      "No cost statistic found. Set a price on your grid sources in the Energy dashboard, or list cost statistics in cost_statistics.",
    ws_error: "Unable to read statistics: {error}",
    gauge: "Month drift",
    gauge_hint: "Month-end estimate vs. month budget, subscription included",
    spent: "Spent this month",
    estimate: "Month-end estimate",
    target: "Month budget",
    usage_only: "Amounts exclude the subscription",
    month: "Month",
    budget: "Budget",
    actual: "Actual",
    diff: "Diff",
    current: "current",
    no_data: "no data",
    average: "📊 Monthly average",
    usage: "Usage",
    subscription: "Subscription",
    total: "Total",
    settlement: "🧾 Settlement {month} {year}",
    estimated: "(estimated)",
    annual: "Annual actual cost",
    per_month_x12: "{x}/month × 12",
    paid: "Paid {from} → {to}",
    balance: "Balance",
    paid_total: "{x} paid",
    to_pay: "to pay",
    refund: "refund",
    remaining: "🎯 Still spendable",
    n_months: "({n} months)",
    per_month: "Per month",
    gap: "Gap",
    planned: "Planned budget",
    in_total: "{x} in total",
    zero_cap: "Cap for a zero balance",
    tol_cap: "Cap before 👎",
    tol_detail: "balance ≤ {x} · {y} in total",
    // editor
    e_title: "Title",
    e_cycle_start_month: "Month zero (start of the consumption year)",
    e_subscription: "Monthly subscription",
    e_budget: "Monthly budget (usage only, excl. subscription)",
    e_payments: "Monthly instalments",
    e_start_month: "First instalment month",
    e_tolerance: "Accepted settlement (👎)",
    e_amount: "Instalment {i} amount",
    e_count: "Number of instalments {i}",
    e_show: "Display",
    e_show_gauge: "Drift gauge",
    e_show_summary: "Current month summary",
    e_show_table: "Monthly table",
    e_show_average: "Monthly average",
    e_show_settlement: "Settlement",
    e_show_remaining: "Still spendable",
    e_options: "Options",
    e_order: "Table order",
    e_order_rolling: "Last 12 months",
    e_order_cycle: "Consumption year",
    e_decimals: "Decimals",
    e_threshold_pct: "Colour threshold (%)",
    e_gauge_range: "Gauge range (± %)",
    e_gauge_name: "Gauge label",
    e_source: "Cost source",
    e_cost_statistics: "Cost statistics (empty = Energy dashboard)",
    e_entity_kept: "Read from {entity} — typing a value replaces it",
    e_propose: "Suggest a budget",
    e_propose_help:
      "Spreads {target} over the 12 months, in proportion to your actual usage over the last 12 closed months.",
    e_propose_target_paid: "what you pay over the cycle (minus 12 subscriptions)",
    e_propose_target_real: "last year's actual usage",
    e_propose_done: "Budget suggested from {n} month(s) of data: {total}/year. Adjust each month as you wish.",
    e_propose_none: "No closed month with cost data yet.",
  },
  fr: {
    title: "Suivi budget",
    loading: "Lecture des statistiques…",
    no_source:
      "Aucune statistique de coût trouvée. Renseigne un prix sur tes sources réseau dans le tableau de bord Énergie, ou liste des statistiques de coût dans cost_statistics.",
    ws_error: "Lecture des statistiques impossible : {error}",
    gauge: "Dérive du mois",
    gauge_hint: "Estimation de fin de mois face au budget du mois, abonnement inclus",
    spent: "Dépensé ce mois",
    estimate: "Estimé fin de mois",
    target: "Budget du mois",
    usage_only: "Montants hors abonnement",
    month: "Mois",
    budget: "Budget",
    actual: "Réel",
    diff: "Écart",
    current: "en cours",
    no_data: "pas de données",
    average: "📊 Moyenne mensuelle",
    usage: "Conso",
    subscription: "Abonnement",
    total: "Total",
    settlement: "🧾 Régularisation {month} {year}",
    estimated: "(estimée)",
    annual: "Coût réel annuel",
    per_month_x12: "{x}/mois × 12",
    paid: "Payé {from} → {to}",
    balance: "Solde",
    paid_total: "{x} payés",
    to_pay: "à payer",
    refund: "remboursé",
    remaining: "🎯 Encore dépensable",
    n_months: "({n} mois)",
    per_month: "Par mois",
    gap: "Écart",
    planned: "Budget prévu",
    in_total: "{x} au total",
    zero_cap: "Plafond « solde nul »",
    tol_cap: "Plafond avant 👎",
    tol_detail: "solde ≤ {x} · {y} au total",
    e_title: "Titre",
    e_cycle_start_month: "Mois zéro (début de l'année de consommation)",
    e_subscription: "Abonnement mensuel",
    e_budget: "Budget mensuel (conso seule, hors abonnement)",
    e_payments: "Mensualisation",
    e_start_month: "Mois de la 1ʳᵉ mensualité",
    e_tolerance: "Régul. acceptée (👎)",
    e_amount: "Montant tranche {i}",
    e_count: "Nombre de mensualités tranche {i}",
    e_show: "Affichage",
    e_show_gauge: "Jauge de dérive",
    e_show_summary: "Résumé du mois en cours",
    e_show_table: "Tableau mensuel",
    e_show_average: "Moyenne mensuelle",
    e_show_settlement: "Régularisation",
    e_show_remaining: "Encore dépensable",
    e_options: "Options",
    e_order: "Ordre du tableau",
    e_order_rolling: "12 derniers mois",
    e_order_cycle: "Année de consommation",
    e_decimals: "Décimales",
    e_threshold_pct: "Seuil de couleur (%)",
    e_gauge_range: "Amplitude de la jauge (± %)",
    e_gauge_name: "Libellé de la jauge",
    e_source: "Source des coûts",
    e_cost_statistics: "Statistiques de coût (vide = tableau de bord Énergie)",
    e_entity_kept: "Lu dans {entity} — saisir une valeur le remplace",
    e_propose: "Proposer un budget",
    e_propose_help:
      "Répartit sur les 12 mois {target}, au prorata de ta conso réelle des 12 derniers mois clos.",
    e_propose_target_paid: "ce que tu paies sur le cycle (moins 12 abonnements)",
    e_propose_target_real: "la conso réelle de l'an dernier",
    e_propose_done: "Budget proposé à partir de {n} mois de données : {total}/an. Ajuste chaque mois à ta guise.",
    e_propose_none: "Aucun mois clos avec des données de coût pour l'instant.",
  },
};

// ---------------------------------------------------------------- helpers

const locale = (hass) => hass?.locale?.language || hass?.language || navigator.language || "en";
const lang = (hass) => (STRINGS[locale(hass).slice(0, 2)] ? locale(hass).slice(0, 2) : "en");

function t(hass, key, vars) {
  let s = STRINGS[lang(hass)][key] ?? STRINGS.en[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(v);
  return s;
}

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const tzOf = (hass) => hass?.config?.time_zone || Intl.DateTimeFormat().resolvedOptions().timeZone;

// Statistics are aligned on the server's time zone, so dates are read there too.
function zonedParts(date, tz) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const p = {};
  for (const x of parts) if (x.type !== "literal") p[x.type] = Number(x.value);
  return { y: p.year, m: p.month, d: p.day, h: p.hour % 24 };
}

const daysInMonth = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate();
const keyOf = (y, m) => `${y}-${m}`;

function addMonths(y, m, k) {
  const i = y * 12 + (m - 1) + k;
  return { y: Math.floor(i / 12), m: (((i % 12) + 12) % 12) + 1 };
}

function monthName(hass, m, style = "short") {
  const s = new Intl.DateTimeFormat(locale(hass), { month: style, timeZone: "UTC" }).format(
    new Date(Date.UTC(2020, m - 1, 15))
  );
  return (s.charAt(0).toUpperCase() + s.slice(1)).replace(/\.$/, "");
}

const isEntityId = (v) => typeof v === "string" && /^[a-z_]+\.[a-z0-9_]+$/.test(v.trim());

// A config value is either a number or an entity id whose state is a number.
function num(hass, v, dflt = 0) {
  if (v === undefined || v === null || v === "") return dflt;
  if (typeof v === "number") return v;
  const s = String(v).trim();
  if (/^-?\d+([.,]\d+)?$/.test(s)) return parseFloat(s.replace(",", "."));
  const f = parseFloat(hass?.states?.[s]?.state);
  return Number.isFinite(f) ? f : dflt;
}

function money(hass, cfg, x, opts = {}) {
  const d = opts.decimals ?? cfg.decimals;
  return new Intl.NumberFormat(locale(hass), {
    style: "currency",
    currency: hass?.config?.currency || "EUR",
    minimumFractionDigits: d,
    maximumFractionDigits: d,
    signDisplay: opts.sign ? "exceptZero" : "auto",
  }).format(x);
}

function currencySymbol(hass) {
  const parts = new Intl.NumberFormat(locale(hass), { style: "currency", currency: hass?.config?.currency || "EUR" }).formatToParts(0);
  return parts.find((p) => p.type === "currency")?.value || hass?.config?.currency || "EUR";
}

const pct = (hass, x, decimals = 0) =>
  new Intl.NumberFormat(locale(hass), {
    style: "percent",
    maximumFractionDigits: decimals,
    signDisplay: "exceptZero",
  }).format(x / 100);

function normalize(c) {
  const cs = Math.round(Number(c.cycle_start_month ?? 1));
  return {
    ...c,
    cycle_start_month: cs >= 1 && cs <= 12 ? cs : 1,
    budget: c.budget || {},
    order: c.order === "cycle" ? "cycle" : "rolling",
    decimals: Number.isFinite(Number(c.decimals)) ? Number(c.decimals) : 0,
    threshold_pct: Number.isFinite(Number(c.threshold_pct)) ? Number(c.threshold_pct) : 10,
    gauge_range: Number(c.gauge_range) > 0 ? Number(c.gauge_range) : 50,
    show: Object.fromEntries(SHOW_KEYS.map((k) => [k, c.show?.[k] !== false])),
  };
}

function installments(hass, cfg) {
  return (cfg.payments?.installments || [])
    .map((x) => ({ amount: num(hass, x?.amount, 0), count: Math.round(num(hass, x?.count, 0)) }))
    .filter((x) => x.amount > 0 && x.count > 0);
}

// ---------------------------------------------------------------- data

// Cost statistics to add (consumption) and subtract (export compensation).
async function resolveStatistics(hass, cfg) {
  const own = typeof cfg.cost_statistics === "string" ? [cfg.cost_statistics] : cfg.cost_statistics;
  if (Array.isArray(own) && own.length) return { add: [...new Set(own)], sub: [] };

  const [prefs, info] = await Promise.all([
    hass.callWS({ type: "energy/get_prefs" }),
    hass.callWS({ type: "energy/info" }),
  ]);
  const costs = info?.cost_sensors || {};
  const add = [];
  const sub = [];
  // Older Core versions nest flows in flow_from / flow_to, newer ones flatten them.
  for (const src of prefs?.energy_sources || []) {
    if (src.type !== "grid") continue;
    for (const f of src.flow_from || [src]) {
      const id = f.stat_energy_from && (f.stat_cost || costs[f.stat_energy_from]);
      if (id) add.push(id);
    }
    if (cfg.include_compensation === false) continue;
    for (const f of src.flow_to || [src]) {
      const id = f.stat_energy_to && (f.stat_compensation || costs[f.stat_energy_to]);
      if (id) sub.push(id);
    }
  }
  const excluded = new Set(cfg.exclude_statistics || []);
  return {
    add: [...new Set(add)].filter((id) => !excluded.has(id)),
    sub: [...new Set(sub)].filter((id) => !excluded.has(id)),
  };
}

// Monthly cost change keyed "YYYY-M" (server time zone), from month (y, m) onwards.
async function fetchMonthly(hass, stats, y, m) {
  const ids = [...stats.add, ...stats.sub];
  const out = new Map();
  if (!ids.length) return out;
  // Start two days early so the first wanted month is complete whatever the
  // browser time zone; the partial month before it is ignored by the callers.
  const start = new Date(Date.UTC(y, m - 1, 1) - 2 * 86400000).toISOString();
  const res = await hass.callWS({
    type: "recorder/statistics_during_period",
    start_time: start,
    statistic_ids: ids,
    period: "month",
    types: ["change"],
  });
  const tz = tzOf(hass);
  const sign = new Map([...stats.add.map((id) => [id, 1]), ...stats.sub.map((id) => [id, -1])]);
  for (const id of ids) {
    for (const row of res?.[id] || []) {
      if (row.change === null || row.change === undefined) continue;
      const st = typeof row.start === "number" ? row.start : Date.parse(row.start);
      const p = zonedParts(new Date(st + 12 * 3600000), tz);
      const k = keyOf(p.y, p.m);
      out.set(k, (out.get(k) || 0) + row.change * sign.get(id));
    }
  }
  return out;
}

// ---------------------------------------------------------------- model

function computeModel(hass, cfg, monthly) {
  const now = zonedParts(new Date(), tzOf(hass));
  const cs = cfg.cycle_start_month;
  const pos = (m) => (((m - cs) % 12) + 12) % 12;
  const currPos = pos(now.m);
  const cycleStart = addMonths(now.y, now.m, -currPos);
  const abo = num(hass, cfg.subscription, 0);
  const budgetOf = (m) => {
    const v = num(hass, cfg.budget?.[m] ?? cfg.budget?.[String(m)], NaN);
    return Number.isFinite(v) ? v : null;
  };

  const spent = monthly.get(keyOf(now.y, now.m)) ?? 0;
  // Hourly statistics lag behind: count elapsed whole hours, never less than a day.
  const elapsed = Math.max(1, now.d - 1 + now.h / 24);
  const estimate = (spent / elapsed) * daysInMonth(now.y, now.m);

  const rows = [];
  const acc = { bud: 0, actual: 0, count: 0, lived: 0, budLeft: 0, nbLeft: 0 };
  for (let i = 0; i < 12; i++) {
    const { y, m } = cfg.order === "cycle" ? addMonths(cycleStart.y, cycleStart.m, i) : addMonths(now.y, now.m, i - 11);
    const bud = budgetOf(m);
    const isCurr = y === now.y && m === now.m;
    // Months not yet lived in the consumption year are neutral: actual = budget.
    const isFuture = !isCurr && pos(m) > currPos;
    let state;
    let actual = null;
    if (isCurr) {
      state = "current";
      actual = estimate;
    } else if (isFuture) {
      state = "future";
      actual = bud ?? 0;
    } else if (monthly.has(keyOf(y, m))) {
      state = "past";
      actual = monthly.get(keyOf(y, m));
    } else {
      state = "missing";
    }
    let variance = null;
    if (state !== "missing") {
      acc.bud += bud ?? 0;
      acc.actual += actual;
      acc.count += 1;
      if (state === "future") {
        acc.budLeft += bud ?? 0;
        acc.nbLeft += 1;
      } else {
        acc.lived += actual;
      }
      if (bud > 0) variance = Math.round(((actual - bud) / bud) * 100);
    }
    rows.push({ y, m, bud, actual, state, variance });
  }

  const avgUsage = acc.count ? acc.actual / acc.count : 0;
  const avgBud = acc.count ? acc.bud / acc.count : 0;
  const totalEst = avgUsage + abo;
  const totalBud = avgBud + abo;

  const budCurr = budgetOf(now.m);
  const drift = budCurr !== null && budCurr + abo > 0 ? ((estimate - budCurr) / (budCurr + abo)) * 100 : null;

  const inst = installments(hass, cfg);
  const paid = inst.reduce((s, x) => s + x.amount * x.count, 0);
  const lastAmount = inst.length ? inst[inst.length - 1].amount : 0;
  const tolerance = cfg.payments?.tolerance !== undefined ? num(hass, cfg.payments.tolerance, lastAmount) : lastAmount;
  const payStart = Number(cfg.payments?.start_month) || (cs % 12) + 1;
  const settleMonth = Number(cfg.payments?.settlement_month) || cs;
  const cycleEnd = addMonths(cycleStart.y, cycleStart.m, 12);
  const settleYear = settleMonth >= cycleEnd.m ? cycleEnd.y : cycleEnd.y + 1;

  let cur = payStart;
  const tranches = inst.map((x) => {
    const r = { ...x, from: cur, to: ((cur - 1 + x.count - 1) % 12) + 1 };
    cur = ((cur - 1 + x.count) % 12) + 1;
    return r;
  });

  const annual = totalEst * 12;
  const settlement = annual - paid;
  const left = paid - 12 * abo - acc.lived;

  return {
    now,
    abo,
    spent,
    estimate,
    budCurr,
    drift,
    rows,
    avgUsage,
    avgBud,
    totalEst,
    totalBud,
    paid,
    tolerance,
    tranches,
    settleMonth,
    settleYear,
    annual,
    settlement,
    left,
    budLeft: acc.budLeft,
    nbLeft: acc.nbLeft,
  };
}

// ---------------------------------------------------------------- rendering

function gaugeSvg(value, range) {
  const v = Math.max(-range, Math.min(range, value));
  const ang = (x) => Math.PI * (1 - (x + range) / (2 * range));
  const pt = (a, r) => [100 + r * Math.cos(a), 100 - r * Math.sin(a)].map((n) => n.toFixed(2));
  const arc = (a, b) => {
    const [x1, y1] = pt(ang(a), 80);
    const [x2, y2] = pt(ang(b), 80);
    return `M ${x1} ${y1} A 80 80 0 0 1 ${x2} ${y2}`;
  };
  const [nx, ny] = pt(ang(v), 92);
  return `<svg viewBox="0 0 200 108" role="img">
    <path d="${arc(-range, 0)}" class="arc good-arc"/>
    <path d="${arc(0, range)}" class="arc bad-arc"/>
    <line x1="100" y1="100" x2="${nx}" y2="${ny}" class="needle"/>
    <circle cx="100" cy="100" r="6" class="hub"/>
  </svg>`;
}

const CSS = `
  :host { display: block; }
  ha-card { height: 100%; box-sizing: border-box; }
  .card-header { padding: 16px 16px 0; font-size: var(--ha-card-header-font-size, 24px); color: var(--ha-card-header-color, var(--primary-text-color)); line-height: 1.3; }
  .content { padding: 8px 16px 16px; }
  .msg { padding: 8px 0; color: var(--secondary-text-color); }
  .msg.warn { color: var(--warning-color, #ff9800); }
  .gauge { display: flex; flex-direction: column; align-items: center; }
  .gauge svg { width: 100%; max-width: 220px; overflow: visible; }
  .gauge .arc { fill: none; stroke-width: 16; }
  .gauge .good-arc { stroke: var(--success-color, #4caf50); }
  .gauge .bad-arc { stroke: var(--error-color, #f44336); }
  .gauge .needle { stroke: var(--primary-text-color); stroke-width: 4; stroke-linecap: round; }
  .gauge .hub { fill: var(--primary-text-color); }
  .gauge .value { font-size: 28px; font-weight: 500; margin-top: 4px; font-variant-numeric: tabular-nums; }
  .gauge .label { font-size: 14px; color: var(--secondary-text-color); }
  .gauge.native ha-gauge { width: 100%; max-width: 250px; }
  .gauge.native .title { width: 100%; margin: 0; text-align: center; font-size: var(--ha-font-size-m, 14px); line-height: var(--ha-line-height-expanded, 2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  ha-card.compact { padding: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  ha-card.compact .content { padding: 0; width: 100%; }
  .rows { margin-top: 8px; }
  .row { display: flex; align-items: center; gap: 16px; min-height: 40px; }
  .row ha-icon { color: var(--state-icon-color, var(--paper-item-icon-color, #44739e)); flex: none; }
  .row .name { flex: 1; }
  .row .value { white-space: nowrap; font-variant-numeric: tabular-nums; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; font-variant-numeric: tabular-nums; }
  th, td { padding: 7px 4px; vertical-align: middle; text-align: right; white-space: nowrap; }
  th:first-child, td:first-child { text-align: left; white-space: normal; }
  th { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: var(--secondary-text-color); border-bottom: 1px solid var(--divider-color); }
  tbody tr { border-bottom: 1px solid var(--divider-color); }
  tbody tr:last-child { border-bottom: none; }
  small { font-size: 11px; color: var(--secondary-text-color); }
  h4 { margin: 22px 0 6px; font-size: 15px; font-weight: 600; }
  h4:first-child { margin-top: 4px; }
  h4 small { font-weight: 400; }
  .good { color: var(--success-color, #4caf50); }
  .bad { color: var(--error-color, #f44336); }
  .muted, .muted small { color: var(--disabled-text-color, #8a8a8a); }
  .block + .block { margin-top: 16px; }
`;

function render(hass, cfg, md) {
  const $ = (x, o) => money(hass, cfg, x, o);
  const thr = cfg.threshold_pct;
  const cls = (variance) => (variance === null ? "" : variance <= -thr ? "good" : variance >= thr ? "bad" : "");
  const out = [];

  if (cfg.show.gauge && md.drift !== null) {
    // gauge_name: "" hides the label, e.g. in a narrow column.
    const label = cfg.gauge_name ?? t(hass, "gauge");
    const hint = esc(t(hass, "gauge_hint"));
    if (customElements.get("ha-gauge")) {
      // Home Assistant's own gauge (configured in _render): same look and size as the built-in gauge card.
      out.push(`<div class="block gauge native" title="${hint}"><ha-gauge></ha-gauge>${
        label ? `<p class="title">${esc(label)}</p>` : ""
      }</div>`);
    } else {
      out.push(`<div class="block gauge" title="${hint}">${gaugeSvg(md.drift, cfg.gauge_range)}
        <div class="value ${md.drift > 0 ? "bad" : "good"}">${pct(hass, md.drift, 1)}</div>
        ${label ? `<div class="label">${esc(label)}</div>` : ""}</div>`);
    }
  }

  if (cfg.show.summary) {
    const row = (icon, name, value) =>
      `<div class="row"><ha-icon icon="${icon}"></ha-icon><span class="name">${esc(name)}</span><span class="value">${value}</span></div>`;
    out.push(`<div class="block rows">
      ${row("mdi:cash-multiple", t(hass, "spent"), $(md.spent, { decimals: 2 }))}
      ${row("mdi:chart-line-variant", t(hass, "estimate"), $(md.estimate, { decimals: 2 }))}
      ${md.budCurr !== null ? row("mdi:target", t(hass, "target"), $(md.budCurr, { decimals: 2 })) : ""}
      <small>${esc(t(hass, "usage_only"))}</small></div>`);
  }

  if (cfg.show.table) {
    const body = md.rows
      .map((r) => {
        const name = esc(monthName(hass, r.m));
        const bud = r.bud === null ? "–" : $(r.bud);
        if (r.state === "future" || r.state === "missing") {
          const title = r.state === "missing" ? ` title="${esc(t(hass, "no_data"))}"` : "";
          return `<tr class="muted"${title}><td>${name}</td><td>${bud}</td><td>–</td><td>–</td></tr>`;
        }
        const c = cls(r.variance);
        const curr = r.state === "current";
        const label = curr ? `<b>${name}</b> <small>${esc(t(hass, "current"))}</small>` : name;
        let actual = `<span class="${c}">${curr ? "≈" : ""}${$(r.actual)}</span>`;
        if (curr) actual = `<b>${actual}</b>`;
        const v = r.variance === null ? "–" : `<span class="${c}">${pct(hass, r.variance)}</span>`;
        return `<tr><td>${label}</td><td>${bud}</td><td>${actual}</td><td>${v}</td></tr>`;
      })
      .join("");
    out.push(`<div class="block"><table><thead><tr><th>${esc(t(hass, "month"))}</th><th>${esc(
      t(hass, "budget")
    )}</th><th>${esc(t(hass, "actual"))}</th><th>${esc(t(hass, "diff"))}</th></tr></thead><tbody>${body}</tbody></table></div>`);
  }

  if (cfg.show.average) {
    const under = md.totalEst <= md.totalBud;
    const d1 = { decimals: Math.max(1, cfg.decimals) };
    out.push(`<div class="block"><h4>${esc(t(hass, "average"))}</h4><table><thead><tr><th></th><th>${esc(
      t(hass, "budget")
    )}</th><th>${esc(t(hass, "actual"))}</th></tr></thead><tbody>
      <tr><td>${esc(t(hass, "usage"))}</td><td>${$(md.avgBud, d1)}</td><td>${$(md.avgUsage, d1)}</td></tr>
      ${md.abo ? `<tr><td>${esc(t(hass, "subscription"))}</td><td>${$(md.abo, d1)}</td><td>${$(md.abo, d1)}</td></tr>` : ""}
      <tr><td><b>${esc(t(hass, "total"))}</b></td><td><b>${$(md.totalBud, d1)}</b></td><td><b class="${
      under ? "good" : "bad"
    }">${$(md.totalEst, d1)}</b> ${under ? "👍" : "👎"}</td></tr>
      </tbody></table></div>`);
  }

  if (cfg.show.settlement && md.tranches.length) {
    const s = md.settlement;
    const icon = s > md.tolerance ? "👎 " : s < 0 ? "👍 " : "";
    const paidRows = md.tranches
      .map(
        (x) => `<tr><td>${esc(t(hass, "paid", { from: monthName(hass, x.from), to: monthName(hass, x.to) }))}<br><small>${
          x.count
        } × ${$(x.amount, { decimals: 2 })}</small></td><td>${$(-x.amount * x.count)}</td></tr>`
      )
      .join("");
    out.push(`<div class="block"><h4>${esc(
      t(hass, "settlement", { month: monthName(hass, md.settleMonth, "long").toLowerCase(), year: md.settleYear })
    )} <small>${esc(t(hass, "estimated"))}</small></h4><table><tbody>
      <tr><td>${esc(t(hass, "annual"))}<br><small>${esc(t(hass, "per_month_x12", { x: $(md.totalEst) }))}</small></td><td>${$(
      md.annual
    )}</td></tr>
      ${paidRows}
      <tr><td><b>${esc(t(hass, "balance"))}</b><br><small>${esc(t(hass, "paid_total", { x: $(md.paid) }))}</small></td>
      <td><b class="${s > 0 ? "bad" : "good"}">${$(s, { sign: true })}</b><br><small>${icon}${esc(
      t(hass, s > 0 ? "to_pay" : "refund")
    )}</small></td></tr>
      </tbody></table></div>`);
  }

  if (cfg.show.remaining && md.tranches.length && md.nbLeft > 0) {
    const n = md.nbLeft;
    const budAvg = md.budLeft / n;
    const leftAvg = md.left / n;
    const effort = leftAvg - budAvg;
    const leftTol = md.left + md.tolerance;
    const margin = leftTol / n - budAvg;
    out.push(`<div class="block"><h4>${esc(t(hass, "remaining"))} <small>${esc(
      t(hass, "n_months", { n })
    )}</small></h4><table><thead><tr><th></th><th>${esc(t(hass, "per_month"))}</th><th>${esc(
      t(hass, "gap")
    )}</th></tr></thead><tbody>
      <tr><td>${esc(t(hass, "planned"))}<br><small>${esc(t(hass, "in_total", { x: $(md.budLeft) }))}</small></td><td>${$(
      budAvg
    )}</td><td class="muted">–</td></tr>
      <tr><td>${esc(t(hass, "zero_cap"))}<br><small>${esc(t(hass, "in_total", { x: $(md.left) }))}</small></td><td>${$(
      leftAvg
    )}</td><td class="${effort >= 0 ? "good" : "bad"}">${$(effort, { sign: true })}</td></tr>
      <tr><td>${esc(t(hass, "tol_cap"))}<br><small>${esc(
      t(hass, "tol_detail", { x: $(md.tolerance), y: $(leftTol) })
    )}</small></td><td>${$(leftTol / n)}</td><td class="${margin >= 0 ? "good" : "bad"}">${$(margin, {
      sign: true,
    })}</td></tr>
      </tbody></table></div>`);
  }

  return out.join("");
}

// ---------------------------------------------------------------- card

class EnergyBudgetCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement(`${CARD_TYPE}-editor`);
  }

  static getStubConfig() {
    return { cycle_start_month: 1, subscription: 0 };
  }

  setConfig(config) {
    if (!config || typeof config !== "object") throw new Error("Invalid configuration");
    this._config = normalize(config);
    this._monthly = null;
    this._error = null;
    this._lastFetch = 0;
    this._sig = null;
    this._render();
    if (this._hass) this._fetch();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    const month = zonedParts(new Date(), tzOf(hass)).m;
    if (!this._loading && (Date.now() - this._lastFetch > REFRESH_MS || month !== this._month)) this._fetch();
    const sig = this._signature();
    if (sig !== this._sig) {
      this._sig = sig;
      this._render();
    }
  }

  connectedCallback() {
    this._timer = setInterval(() => this._hass && this._fetch(), REFRESH_MS);
  }

  disconnectedCallback() {
    clearInterval(this._timer);
  }

  getCardSize() {
    return 12;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  // Only re-render when something the card displays may have changed.
  _signature() {
    const c = this._config;
    const refs = [c.subscription, c.payments?.tolerance, ...Object.values(c.budget || {})];
    for (const x of c.payments?.installments || []) refs.push(x?.amount, x?.count);
    const states = refs.filter(isEntityId).map((id) => this._hass?.states?.[id]?.state);
    const now = zonedParts(new Date(), tzOf(this._hass));
    return JSON.stringify([lang(this._hass), now.d, now.h, this._version, this._error, states]);
  }

  async _fetch() {
    if (!this._hass || this._loading) return;
    this._loading = true;
    this._lastFetch = Date.now();
    try {
      const now = zonedParts(new Date(), tzOf(this._hass));
      this._month = now.m;
      const stats = await resolveStatistics(this._hass, this._config);
      if (!stats.add.length) {
        this._error = t(this._hass, "no_source");
      } else {
        const from = addMonths(now.y, now.m, -11);
        this._monthly = await fetchMonthly(this._hass, stats, from.y, from.m);
        this._error = null;
      }
    } catch (e) {
      this._error = t(this._hass, "ws_error", { error: e?.message || e?.code || String(e) });
    } finally {
      this._loading = false;
      this._version = (this._version || 0) + 1;
      this._sig = this._signature();
      this._render();
    }
  }

  _render() {
    if (!this._config) return;
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    const hass = this._hass;
    const cfg = this._config;
    const title = cfg.title ?? t(hass, "title");
    // Gauge alone without a title: laid out like the built-in gauge card so both line up side by side.
    const compact = !title && cfg.show.gauge && SHOW_KEYS.every((k) => k === "gauge" || !cfg.show[k]);
    let body;
    let md = null;
    if (this._error) body = `<div class="msg warn">${esc(this._error)}</div>`;
    else if (!hass || !this._monthly) body = `<div class="msg">${esc(t(hass, "loading"))}</div>`;
    else {
      md = computeModel(hass, cfg, this._monthly);
      body = render(hass, cfg, md);
    }
    this.shadowRoot.innerHTML = `<style>${CSS}</style><ha-card class="${compact ? "compact" : ""}">${
      title ? `<div class="card-header">${esc(title)}</div>` : ""
    }<div class="content">${body}</div></ha-card>`;

    const gauge = this.shadowRoot.querySelector("ha-gauge");
    if (gauge && md) {
      const r = cfg.gauge_range;
      Object.assign(gauge, {
        min: -r,
        max: r,
        value: Math.round(md.drift * 10) / 10,
        label: "%",
        needle: true,
        levels: [
          { level: -r, stroke: "var(--success-color)" },
          { level: 0, stroke: "var(--error-color)" },
        ],
        locale: hass.locale,
        formatOptions: { maximumFractionDigits: 1 },
      });
    } else if (cfg.show.gauge && !customElements.get("ha-gauge") && !EnergyBudgetCard._gaugeRequested) {
      // ha-gauge is lazy-loaded with the built-in gauge card: build one once to load it, then re-render.
      EnergyBudgetCard._gaugeRequested = true;
      window
        .loadCardHelpers?.()
        .then((h) => h.createCardElement({ type: "gauge", entity: "sun.sun" }))
        .catch(() => {});
    }
    if (cfg.show.gauge && !customElements.get("ha-gauge")) {
      customElements.whenDefined("ha-gauge").then(() => this._render());
    }
  }
}

// ---------------------------------------------------------------- editor

const MAX_TRANCHES = 3;

// Keep an entity reference set in YAML unless the user types a number over it.
const keep = (orig, value) => (value !== undefined && value !== null && value !== "" ? value : isEntityId(orig) ? orig : undefined);

function toForm(c) {
  const n = (v) => (typeof v === "number" ? v : undefined);
  const inst = c.payments?.installments || [];
  const payments = {
    start_month: c.payments?.start_month ? String(c.payments.start_month) : undefined,
    tolerance: n(c.payments?.tolerance),
  };
  for (let i = 1; i <= MAX_TRANCHES; i++) {
    payments[`amount_${i}`] = n(inst[i - 1]?.amount);
    payments[`count_${i}`] = n(inst[i - 1]?.count);
  }
  const budget = {};
  for (let m = 1; m <= 12; m++) budget[m] = n(c.budget?.[m] ?? c.budget?.[String(m)]);
  return {
    title: c.title,
    cycle_start_month: String(c.cycle_start_month ?? 1),
    subscription: n(c.subscription),
    budget,
    payments,
    show: normalize(c).show,
    order: c.order || "rolling",
    decimals: c.decimals ?? 0,
    threshold_pct: c.threshold_pct ?? 10,
    gauge_range: c.gauge_range ?? 50,
    gauge_name: c.gauge_name,
    cost_statistics: c.cost_statistics || [],
  };
}

function fromForm(f, orig) {
  const out = { type: orig.type };
  if (f.title !== undefined && f.title !== "") out.title = f.title;
  out.cycle_start_month = Number(f.cycle_start_month || 1);
  const sub = keep(orig.subscription, f.subscription);
  if (sub !== undefined) out.subscription = sub;

  const budget = {};
  for (let m = 1; m <= 12; m++) {
    const v = keep(orig.budget?.[m] ?? orig.budget?.[String(m)], f.budget?.[m]);
    if (v !== undefined) budget[m] = v;
  }
  if (Object.keys(budget).length) out.budget = budget;

  const oi = orig.payments?.installments || [];
  const installments = [];
  for (let i = 1; i <= MAX_TRANCHES; i++) {
    const amount = keep(oi[i - 1]?.amount, f.payments?.[`amount_${i}`]);
    const count = keep(oi[i - 1]?.count, f.payments?.[`count_${i}`]);
    if (amount !== undefined && count !== undefined) installments.push({ amount, count });
  }
  installments.push(...oi.slice(MAX_TRANCHES));
  const payments = {};
  if (f.payments?.start_month) payments.start_month = Number(f.payments.start_month);
  if (orig.payments?.settlement_month) payments.settlement_month = orig.payments.settlement_month;
  const tol = keep(orig.payments?.tolerance, f.payments?.tolerance);
  if (tol !== undefined) payments.tolerance = tol;
  if (installments.length) payments.installments = installments;
  if (Object.keys(payments).length) out.payments = payments;

  const show = {};
  for (const k of SHOW_KEYS) if (f.show?.[k] === false) show[k] = false;
  if (Object.keys(show).length) out.show = show;
  if (f.order && f.order !== "rolling") out.order = f.order;
  if (f.decimals !== undefined && f.decimals !== 0) out.decimals = f.decimals;
  if (f.threshold_pct !== undefined && f.threshold_pct !== 10) out.threshold_pct = f.threshold_pct;
  if (f.gauge_range !== undefined && f.gauge_range !== 50) out.gauge_range = f.gauge_range;
  // An empty field cannot be told apart from "unset" in the form: "" (hidden label) is kept from YAML.
  if (f.gauge_name) out.gauge_name = f.gauge_name;
  else if (orig.gauge_name === "") out.gauge_name = "";
  if (f.cost_statistics?.length) out.cost_statistics = f.cost_statistics;

  // Options only reachable from YAML are carried over untouched.
  for (const k of ["exclude_statistics", "include_compensation"]) if (orig[k] !== undefined) out[k] = orig[k];
  return out;
}

class EnergyBudgetCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _schema() {
    const hass = this._hass;
    const cur = currencySymbol(hass);
    const months = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: monthName(hass, i + 1, "long") }));
    const money = { number: { min: 0, step: 0.01, mode: "box", unit_of_measurement: cur } };
    const grid = (schema, extra = {}) => ({ type: "grid", name: "", schema, ...extra });
    const tranches = [];
    for (let i = 1; i <= MAX_TRANCHES; i++) {
      tranches.push({ name: `amount_${i}`, selector: money }, { name: `count_${i}`, selector: { number: { min: 0, max: 12, mode: "box" } } });
    }
    return [
      { name: "title", selector: { text: {} } },
      grid([
        { name: "cycle_start_month", selector: { select: { mode: "dropdown", options: months } } },
        { name: "subscription", selector: money },
      ]),
      {
        type: "expandable",
        name: "budget",
        title: t(hass, "e_budget"),
        icon: "mdi:target",
        schema: [
          grid(
            Array.from({ length: 12 }, (_, i) => ({ name: String(i + 1), selector: { number: { min: 0, step: 1, mode: "box", unit_of_measurement: cur } } })),
            { column_min_width: "110px" }
          ),
        ],
      },
      {
        type: "expandable",
        name: "payments",
        title: t(hass, "e_payments"),
        icon: "mdi:calendar-sync",
        schema: [
          grid([
            { name: "start_month", selector: { select: { mode: "dropdown", options: months } } },
            { name: "tolerance", selector: money },
          ]),
          grid(tranches),
        ],
      },
      {
        type: "expandable",
        name: "show",
        title: t(hass, "e_show"),
        icon: "mdi:eye",
        schema: [grid(SHOW_KEYS.map((k) => ({ name: k, selector: { boolean: {} } })))],
      },
      {
        type: "expandable",
        name: "",
        flatten: true,
        title: t(hass, "e_options"),
        icon: "mdi:tune",
        schema: [
          grid([
            {
              name: "order",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "rolling", label: t(hass, "e_order_rolling") },
                    { value: "cycle", label: t(hass, "e_order_cycle") },
                  ],
                },
              },
            },
            { name: "decimals", selector: { number: { min: 0, max: 2, mode: "box" } } },
            { name: "threshold_pct", selector: { number: { min: 0, max: 100, mode: "box", unit_of_measurement: "%" } } },
            { name: "gauge_range", selector: { number: { min: 5, max: 200, mode: "box", unit_of_measurement: "%" } } },
            { name: "gauge_name", selector: { text: {} } },
          ]),
        ],
      },
      {
        type: "expandable",
        name: "",
        flatten: true,
        title: t(hass, "e_source"),
        icon: "mdi:database",
        schema: [{ name: "cost_statistics", selector: { statistic: { multiple: true } } }],
      },
    ];
  }

  _label(schema) {
    const hass = this._hass;
    const n = schema.name;
    if (/^\d+$/.test(n)) return monthName(hass, Number(n), "long");
    const m = /^(amount|count)_(\d)$/.exec(n);
    if (m) return t(hass, `e_${m[1]}`, { i: m[2] });
    if (SHOW_KEYS.includes(n)) return t(hass, `e_show_${n}`);
    return t(hass, `e_${n}`);
  }

  _helper(schema) {
    const n = schema.name;
    const c = this._config;
    let orig;
    if (n === "subscription") orig = c.subscription;
    else if (n === "tolerance") orig = c.payments?.tolerance;
    else if (/^\d+$/.test(n)) orig = c.budget?.[n];
    else {
      const m = /^(amount|count)_(\d)$/.exec(n);
      if (m) orig = c.payments?.installments?.[Number(m[2]) - 1]?.[m[1]];
    }
    // Zero-width spaces let long entity ids wrap inside the narrow form columns.
    return isEntityId(orig) ? t(this._hass, "e_entity_kept", { entity: orig.replace(/([._])/g, "$1​") }) : undefined;
  }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        this._config = fromForm(ev.detail.value, this._config);
        this._form.data = toForm(this._config);
        this._fire();
      });
      this._form.computeLabel = (s) => this._label(s);
      this._form.computeHelper = (s) => this._helper(s);

      const box = document.createElement("div");
      box.style.cssText = "margin-top:16px;display:flex;flex-direction:column;gap:8px";
      this._btn = document.createElement("button");
      this._btn.style.cssText =
        "align-self:flex-start;padding:8px 16px;border-radius:18px;border:1px solid var(--primary-color);background:none;color:var(--primary-color);font:inherit;cursor:pointer";
      this._btn.addEventListener("click", () => this._propose());
      this._msg = document.createElement("div");
      this._msg.style.cssText = "font-size:13px;color:var(--secondary-text-color)";
      box.append(this._btn, this._msg);
      this.append(this._form, box);
    }
    this._form.hass = this._hass;
    this._form.schema = this._schema();
    this._form.data = toForm(this._config);
    this._btn.textContent = t(this._hass, "e_propose");
    if (!this._msgSet) {
      const paid = installments(this._hass, this._config).length;
      this._msg.textContent = t(this._hass, "e_propose_help", {
        target: t(this._hass, paid ? "e_propose_target_paid" : "e_propose_target_real"),
      });
    }
  }

  _fire() {
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
  }

  // Suggested budget: the usage profile of the last 12 closed months, scaled
  // so that the year sums to what is paid (instalments minus subscriptions).
  async _propose() {
    const hass = this._hass;
    const cfg = normalize(this._config);
    this._msgSet = true;
    this._btn.disabled = true;
    try {
      const now = zonedParts(new Date(), tzOf(hass));
      const from = addMonths(now.y, now.m, -12);
      const monthly = await fetchMonthly(hass, await resolveStatistics(hass, cfg), from.y, from.m);
      const real = {};
      for (let k = 1; k <= 12; k++) {
        const d = addMonths(now.y, now.m, -k);
        if (monthly.has(keyOf(d.y, d.m))) real[d.m] = Math.max(0, monthly.get(keyOf(d.y, d.m)));
      }
      const known = Object.values(real);
      if (!known.length) {
        this._msg.textContent = t(hass, "e_propose_none");
        return;
      }
      const avg = known.reduce((s, x) => s + x, 0) / known.length;
      for (let m = 1; m <= 12; m++) if (real[m] === undefined) real[m] = avg;
      const lastYear = Object.values(real).reduce((s, x) => s + x, 0);
      const paid = installments(hass, cfg).reduce((s, x) => s + x.amount * x.count, 0);
      const target = paid > 0 ? paid - 12 * num(hass, cfg.subscription, 0) : lastYear;
      const scale = lastYear > 0 ? target / lastYear : 0;
      const budget = {};
      for (let m = 1; m <= 12; m++) budget[m] = Math.max(0, Math.round(lastYear > 0 ? real[m] * scale : target / 12));
      this._config = { ...this._config, budget };
      this._form.data = toForm(this._config);
      this._fire();
      const total = Object.values(budget).reduce((s, x) => s + x, 0);
      this._msg.textContent = t(hass, "e_propose_done", { n: known.length, total: money(hass, cfg, total) });
    } catch (e) {
      this._msg.textContent = t(hass, "ws_error", { error: e?.message || String(e) });
    } finally {
      this._btn.disabled = false;
    }
  }
}

if (!customElements.get(CARD_TYPE)) customElements.define(CARD_TYPE, EnergyBudgetCard);
if (!customElements.get(`${CARD_TYPE}-editor`)) customElements.define(`${CARD_TYPE}-editor`, EnergyBudgetCardEditor);

window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === CARD_TYPE)) {
  window.customCards.push({
    type: CARD_TYPE,
    name: "Energy Budget Card",
    description: "Monthly electricity budget, year-end settlement and spending headroom from Energy dashboard statistics.",
    preview: true,
    documentationURL: "https://github.com/microdav/energy-budget-card",
  });
}

console.info(`%c ENERGY-BUDGET-CARD %c ${CARD_VERSION} `, "color:#fff;background:#00897b;font-weight:700", "color:#00897b;background:#fff");
