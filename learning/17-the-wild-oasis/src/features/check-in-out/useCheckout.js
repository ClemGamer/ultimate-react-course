import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useCheckout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: checkout, isLoading: isCheckingout } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: "checked-out",
        isPaid: true,
      }),

    onSuccess: (data) => {
      toast.success(`checkout #${data.id} successfully`);
      queryClient.invalidateQueries({ active: true });
      navigate("/");
    },

    onError: () => toast.error("checkout failed"),
  });

  return { checkout, isCheckingout };
}
