import { Redirect } from "expo-router";

// Order tracking lives inside the order detail screen (status timeline).
// This route just redirects to the orders list for any legacy links.
export default function OrderTrackingRedirect() {
  return <Redirect href="/orders" />;
}
