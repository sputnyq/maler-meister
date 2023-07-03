import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../store";
import { loadActiveConstructions } from "../store/constructionReducer";

export function useLoadActiveConstructions() {
  const activeConstructions = useSelector<AppState, Construction[]>(
    (s) => s.construction.activeConstructions
  );

  const length = activeConstructions.length;

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (length === 0) {
      console.log("will do");
      dispatch(loadActiveConstructions());
    }
  }, [dispatch]);
}
