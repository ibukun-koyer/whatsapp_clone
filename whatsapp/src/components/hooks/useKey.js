import { useEffect } from "react";

function useKey(key, callback) {
  return useEffect(() => {
    function onKeyDown(e) {
      if (e.code === key) {
        callback();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });
}
export default useKey;
