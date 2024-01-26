import { useMemo, useRef } from "react";
import { capitalizeFirstLetter, toGetters } from "./utils";
import { CapitalizeFirstLetter } from "./type-utils";

export type ISettersState<S, TUpdater, TPrefixKey extends string> = {
  [K in keyof S as `${TPrefixKey}${CapitalizeFirstLetter<K & string>}`]: (
    value: S[K]
  ) => void;
} & S & {
    updater: TUpdater;
  };
export function useSettersState<
  TState extends object,
  TUpdater extends (cb: (prev: TState) => TState) => void,
  TPrefixKey extends string
>(
  state: TState,
  updater: TUpdater,
  setPrefixKey: TPrefixKey = "set" as TPrefixKey
) {
  const ref = useRef({
    state,
    updater,
  });

  ref.current.state = state;
  ref.current.updater = updater;

  return useMemo(
    () =>
      Object.keys(ref.current.state).reduce(
        (setters, key) => {
          if (!(`${setPrefixKey}${capitalizeFirstLetter(key)}` in setters)) {
            (setters as any)[
              `${setPrefixKey}${capitalizeFirstLetter(key)}` as string
            ] = (newValue: any) => {
              ref.current.updater((prev) => ({ ...prev, [key]: newValue }));
            };
          }

          return setters;
        },
        toGetters(ref.current.state, (key) => ref.current.state[key], {
          updater: ref.current.updater,
        }) as ISettersState<TState, TUpdater, TPrefixKey>
      ),
    [setPrefixKey]
  );
}
