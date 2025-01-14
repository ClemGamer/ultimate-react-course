import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../services/apiSettings";

export function useSettings() {
  const {
    isLoading,
    error,
    data: settings,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  if (error) {
    console.log(error.message);
    throw new Error("Could not load settings");
  }

  return { isLoading, settings };
}
