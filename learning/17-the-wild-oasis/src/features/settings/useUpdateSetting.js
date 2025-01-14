import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { updateSetting as updateSettingApi } from "../../services/apiSettings";

export function useUpdateSetting() {
  const { isLoading: isUpdating, mutate: updateSetting } = useMutation({
    mutationKey: ["settings"],
    mutationFn: updateSettingApi,
    onSuccess: () => {
      toast.success("Setting successfully updated.");
    },
    onError: (err) => toast.error(err.message),
  });

  return { isUpdating, updateSetting };
}
