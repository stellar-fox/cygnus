# Payments (draft)

## Transactions
Transactions consist of a set of commands aka _operations_ that modify
ledger state. Transactions are always signed by the _source account_.

### Transaction Attributes

* `Source account`
* `Fee`
* `Sequence number`
* `List of operations` (up to 100)
* `List of signatures` (up to 20)
* `Memo` (optional)
* `Time bounds` (optional)

<br /><br />

## Operations
All _operations_ are execuded in order as one ACID transaction,
meaning they either all complete successfully or none of them will.

### Operation Types

* **`Create Account`**
* **`Payment`**
* **`Path Payment`**
* **`Account Merge`**
* `Manage Offer`
* `Create Passive Offer`
* `Set Options`
* `Change Trust`
* `Allow Trust`
* `Inflation`
* `Manage Data`
* `Bump Sequence`

We will consider the first four (in bold font) for **_Payments_** view.
Each call to _Transactions for Account_ should be filtered for operations that pertain to the current account, that is, the operation
should have either destination account as current account (in case of
credit payment) or source account as current account (in case of debit
payment)

#### Getting transactions for the account

The table will display (as default) first 5 transactions in descending
order.



<br /><br />

## Native (XLM)

Native payments are presented in default/preferred base currency
(i.e. EUR, USD, AUD, PLN ...) according to the user preference.
The exchange rate is cached for 30 seconds. The
[Coinmarketcap API](http://fewa.com) (soon to be replaced by
[Coinranking API](http://fewa.com)) is throttled via `Deneb` backend.

### Helper functions used on native currency:

* `getGlyph(currencyCode: string)` - returns UTF-8 `string` (symbol)
representation (i.e. $, €, ¥)

* `convert(nativeAmount: BigNum)` - returns `BigNum` with fixed decimal
scale.

## Custom Assets
