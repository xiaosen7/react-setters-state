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
  TPrefixKey extends string = "set"
  // @ts-expect-error
>(state: TState, updater: TUpdater, setterKeyPrefix: TPrefixKey = "set") {
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
          if (!(`${setterKeyPrefix}${capitalizeFirstLetter(key)}` in setters)) {
            (setters as any)[
              `${setterKeyPrefix}${capitalizeFirstLetter(key)}` as string
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
    [setterKeyPrefix]
  );
}
