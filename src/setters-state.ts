import { useCallback, useMemo, useRef, useState } from "react";
import { capitalizeFirstLetter, withGetters } from "./utils";
import { CapitalizeFirstLetter } from "./type-utils";

export type ISettersState<S, TUpdater, TPrefixKey extends string> = {
  [K in keyof S as `${TPrefixKey}${CapitalizeFirstLetter<K & string>}`]: (
    value: S[K]
  ) => void;
} & S & {
    updater: TUpdater;
  };

/**
 * Convert your state to setters.
 *
 * @param state input state
 * @param updater a higher order function like `setState` that will receive a `cb` function to update state
 * @param setterKeyPrefix the method prefix string of setters, default to `"set"`
 *
 * @example
 *
 * ### Basic Usage
 *
 * ```ts
 * import useSettersState from "react-setters-state";
 *
 * export function Example() {
 *   const stateWithSetters = useSettersState({
 *     age: 1,
 *   });
 * }
 * ```
 *
 * ### With a custom updater
 *
 * ```ts
 * import { useState } from "react";
 * import useSettersState from "react-setters-state";
 *
 * export function Example() {
 *   const [state, setState] = useState({
 *     age: 1,
 *   });
 *   const stateWithSetters = useSettersState(state, setState);
 * }
 * ```
 */
export function useSettersState<
  TState extends object,
  TUpdater extends (cb: (prev: TState) => TState) => void,
  TPrefixKey extends string = "set"
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
          if (!(`${setterKeyPrefix}${capitalizeFirstLetter(key)}` in setters)) {
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
        }) as ISettersState<TState, TUpdater, TPrefixKey>
      ),
    [setterKeyPrefix]
  );
}
