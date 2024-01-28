export type CapitalizeFirstLetter<TStr extends string> =
  TStr extends `${infer First}${infer Rest}`
    ? `${Uppercase<First>}${Rest}`
    : TStr;

export type WithPrefix<TStr, TPrefix extends string> = TStr extends string
  ? `${TPrefix}${CapitalizeFirstLetter<TStr & string>}`
  : TStr;

export type FilterKeys<
  TKeys extends string,
  TPrefix extends string,
> = TKeys extends `${TPrefix}${string}` ? never : TKeys;
