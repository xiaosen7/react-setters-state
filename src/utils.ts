export function capitalizeFirstLetter(str: string) {
  if (typeof str === "string" && str.length > 0) {
    return `${str[0].toUpperCase()}${str.slice(1)}`;
  }

  return str;
}

export function withGetters<S extends object, TRet extends object>(
  state: S,
  getValue: <TKey extends keyof S>(key: TKey) => S[TKey],
  ret: TRet
): S & TRet {
  return Object.keys(state).reduce((ret, key) => {
    Object.defineProperty(ret, key, {
      get() {
        return getValue(key as keyof S);
      },
    });
    return ret;
  }, ret as S & TRet);
}
