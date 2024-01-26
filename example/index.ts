import { useState } from "react";
import useSettersState from "react-setters-state";

export function Example() {
  const [state, setState] = useState({
    age: 1,
  });
  const setters = useSettersState(state, setState);
}
