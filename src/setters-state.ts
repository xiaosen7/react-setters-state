import { useCallback, useMemo, useRef, useState } from "react";
import { capitalizeFirstLetter, withGetters } from "./utils";
import { CapitalizeFirstLetter, FilterKeys, WithPrefix } from "./type-utils";

export type ISettersState<S, TUpdater, TPrefixKey extends string> = {
  [K in FilterKeys<keyof S & string, TPrefixKey> as WithPrefix<
    K,
    TPrefixKey
  >]: WithPrefix<K, TPrefixKey> extends keyof S
    ? S[WithPrefix<K, TPrefixKey>]
    : (value: S[K]) => void;
} & S & {
    updater: TUpdater;
  };

/**
 * Convert your state to setters.
 *
 * @example
 *   import useSettersState from "react-setters-state";
 *
 *   export function Example() {
 *     const stateWithSetters = useSettersState({
 *       age: 1,
 *     });
 *   }
 *
 * @example
 *   import { useState } from "react";
 *   import useSettersState from "react-setters-state";
 *
 *   export function Example() {
 *     const [state, setState] = useState({
 *       age: 1,
 *     });
 *     const stateWithSetters = useSettersState(state, setState);
 *   }
 *
 * @param state Input state
 * @param updater A higher order function like `setState` that will receive a
 *   `cb` function to update state
 * @param setterKeyPrefix The method prefix string of setters, default to
 *   `"set"`
 */
export function useSettersState<
  TState extends object,
  TUpdater extends (cb: (prev: TState) => TState) => void,
  TPrefixKey extends string = "set",
  // @ts-expect-error it's ok
>(state: TState, updater?: TUpdater, setterKeyPrefix: TPrefixKey = "set") {
  const ref = useRef({
    state,
    updater,
  });

  const [defaultState, defaultUpdater] = useState(state);

  ref.current.state = updater ? state : defaultState;
  ref.current.updater = updater || (defaultUpdater as TUpdater);

  return useMemo(
    () =>
      Object.keys(ref.current!.state).reduce(
        (setters, key) => {
          if (
            !key.startsWith(setterKeyPrefix) &&
            !(`${setterKeyPrefix}${capitalizeFirstLetter(key)}` in setters)
          ) {
            (setters as any)[
              `${setterKeyPrefix}${capitalizeFirstLetter(key)}` as string
            ] = (newValue: any) => {
              ref.current?.updater?.((prev) => ({ ...prev, [key]: newValue }));
            };
          }

          return setters;
        },
        withGetters(ref.current!.state, (key) => ref.current!.state[key], {
          updater: ref.current!.updater,
        }) as ISettersState<TState, TUpdater, TPrefixKey>,
      ),
    [setterKeyPrefix],
  );
}
