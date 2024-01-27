import { act, renderHook } from "@testing-library/react";
import { useSettersState } from "../src/setters-state";
import { useState } from "react";

const initialName = "initialName";
const nextName = "nextName";

describe("useSettersState", () => {
  describe("with the updater parameter", () => {
    it("it should return setters object", async () => {
      const { result } = renderHook(() => {
        const [state, setState] = useState({ name: initialName });
        return useSettersState(state, setState);
      });

      const setters = result.current;
      expect(setters).toBeTypeOf("object");
      expect(setters.name).toBe(initialName);
      expect(setters.setName).toBeTypeOf("function");
    });

    it("it should set correctly", async () => {
      const { result } = renderHook(() => {
        const [state, setState] = useState({ name: initialName });
        return useSettersState(state, setState);
      });

      const hookRet = result.current;

      act(() => {
        hookRet.setName(nextName);
      });

      expect(result.current.name).toBe(nextName);
      expect(hookRet.name).toBe(nextName);
    });

    it("call updater correctly", async () => {
      const { result } = renderHook(() => {
        const [state, setState] = useState({ name: initialName });
        return useSettersState(state, setState);
      });

      const hookRet = result.current;

      act(() => {
        hookRet.updater((prev) => ({ ...prev, name: nextName }));
      });

      expect(result.current.name).toBe(nextName);
      expect(hookRet.name).toBe(nextName);

      act(() => {
        hookRet.updater({
          name: initialName,
        });
      });

      expect(result.current.name).toBe(initialName);
      expect(hookRet.name).toBe(initialName);
    });

    it("setters should be immutable", async () => {
      const { result } = renderHook(() => {
        const [state, setState] = useState({ name: initialName });
        return useSettersState(state, setState);
      });

      const setters = result.current;
      act(() => {
        setters.setName(nextName);
      });

      expect(setters).toBe(result.current);
      expect(setters.setName).toBe(result.current.setName);
    });

    it("supports custom setter prefix", async () => {
      const { result } = renderHook(() => {
        const [state, setState] = useState({ name: initialName });
        return useSettersState(state, setState, "update");
      });

      const setters = result.current;
      expect(setters.updateName).toBeTypeOf("function");
    });
  });

  describe("without updater parameter", () => {
    it("it should return setters object", async () => {
      const { result } = renderHook(() => {
        return useSettersState({ name: initialName });
      });

      const setters = result.current;
      expect(setters).toBeTypeOf("object");
      expect(setters.name).toBe(initialName);
      expect(setters.setName).toBeTypeOf("function");
    });

    it("it should set correctly", async () => {
      const { result } = renderHook(() => {
        return useSettersState({ name: initialName });
      });

      const hookRet = result.current;

      act(() => {
        hookRet.setName(nextName);
      });

      expect(result.current.name).toBe(nextName);
      expect(hookRet.name).toBe(nextName);
    });

    it("call updater correctly", async () => {
      const { result } = renderHook(() => {
        return useSettersState({ name: initialName });
      });

      const hookRet = result.current;

      act(() => {
        hookRet.updater((prev) => ({ ...prev, name: nextName }));
      });

      expect(result.current.name).toBe(nextName);
      expect(hookRet.name).toBe(nextName);
    });

    it("setters should be immutable", async () => {
      const { result } = renderHook(() => {
        return useSettersState({ name: initialName });
      });

      const setters = result.current;
      act(() => {
        setters.setName(nextName);
      });

      expect(setters).toBe(result.current);
      expect(setters.setName).toBe(result.current.setName);
    });

    it("supports custom setter prefix", async () => {
      const { result } = renderHook(() => {
        return useSettersState({ name: initialName }, undefined, "update");
      });

      const setters = result.current;
      expect(setters.updateName).toBeTypeOf("function");
    });
  });
});
