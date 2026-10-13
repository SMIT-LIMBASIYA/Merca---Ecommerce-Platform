import { createBrowserRouter } from "react-router";
import { AdminLayout, StoreLayout } from "./components";
import { Analytics, Feedback, Logs, Overview, SessionDetail, Sessions, TaskManagement } from "./admin";
import { Cart, Checkout, Compare, Confirmation, NotFound, TaskMode } from "./pages";
import { Catalogue, Home, ProductDetails } from "./commerce-pages";
import { ForgotPassword, Login, Profile, Register, RequireRole, ResetPassword } from "./auth";

export const router = createBrowserRouter([
  { path: "/", Component: StoreLayout, children: [
    { index: true, Component: Home },
    { path: "catalogue", Component: Catalogue },
    { path: "product/:id", Component: ProductDetails },
    { path: "compare", Component: Compare },
    { path: "cart", Component: Cart },
    { path: "checkout", Component: Checkout },
    { path: "confirmation", Component: Confirmation },
    { path: "task", Component: TaskMode },
    { path: "login", Component: Login },
    { path: "register", Component: Register },
    { path: "profile", Component: Profile },
    { path: "forgot-password", Component: ForgotPassword },
    { path: "reset-password", Component: ResetPassword },
    { path: "*", Component: NotFound },
  ]},
  { Component: RequireRole, children: [
    { path: "/admin", Component: AdminLayout, children: [
      { index: true, Component: Overview },
      { path: "sessions", Component: Sessions },
      { path: "sessions/:id", Component: SessionDetail },
      { path: "tasks", Component: TaskManagement },
      { path: "logs", Component: Logs },
      { path: "analytics", Component: Analytics },
      { path: "feedback", Component: Feedback },
    ]},
  ]},
]);
