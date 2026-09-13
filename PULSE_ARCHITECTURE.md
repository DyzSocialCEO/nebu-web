# NEBU Pulse — integration contract

## Locked voice

`lib/pulse-bank.ts` is the runtime representation of `PULSE_BANK.md`.

Rules:

- first person
- never wrong
- never broke
- always generational
- annoyance/pettiness/tiredness are allowed; doubt is not
- short one-breath reactions
- never explain the joke
- avoid repeating the same sentence shape back-to-back

## Runtime categories

- dust_buy: amount < 0.1
- normal_buy: 0.1 <= amount < 1
- big_buy: amount >= 1
- dust_sell: amount < 0.1
- normal_sell: 0.1 <= amount < 1
- big_sell: amount >= 1
- buyback: buy from a wallet known to have sold before
- silence: emitted only after a caller-defined no-trade interval
- price_up
- price_down

The `amount` unit is deliberately provider-neutral until the actual launch pair/quote asset is locked. The chain adapter must normalize trades into the unit used by these thresholds; do not silently assume USD or SOL.

## No fake-live rule

The public component stays in `FEED STANDBY` until a real adapter is connected.

Do not manufacture demo trades on the production page. Design previews may use mocked events only when visibly labeled preview/demo.

## Future chain adapter input

A provider adapter should emit normalized signals into the Pulse engine:

```ts
{ type: "trade", trade: { side: "buy" | "sell", amount: number, wallet?: string, hasSoldBefore?: boolean } }
{ type: "price", price: { direction: "up" | "down" } }
{ type: "silence" }
```

The provider layer, wallet history, polling/subscription cadence, price-change trigger and silence interval remain intentionally unimplemented until the token's actual chain/pair/source are confirmed.

## Presentation

`components/NebuPulse.tsx` is intentionally simple. Claude Design may restyle/reposition it, but must preserve:

- live vs standby truthfulness
- the exact selected NEBU line
- category/meta can be visually secondary
- no sentence rewriting in the UI
- mobile readability
- do not cover NEBU's face or core music controls
