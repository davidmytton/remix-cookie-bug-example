# Remix cookie bug

```sh
npm install
npm run dev
```

## Reproduce

1. Visit `/bug`
2. Submit the form twice.
3. The second time, the context token is not passed correctly and the values
   don't match, so it errors.

## Proof

1. Visit `/nobug` where the headers are not set by the call to `json()`
2. Submit the form as many times as you like.
