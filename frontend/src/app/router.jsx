import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import LoginAuthLayout from "../layouts/LoginAuthLayout";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import InterviewSetupPage from "../features/interviews/pages/InterviewSetupPage";
import InterviewRoomPage from "../features/interviews/pages/InterviewRoomPage";
import InterviewResultPage from "../features/interviews/pages/InterviewResultPage";
import InterviewDetailPage from "../features/history/pages/InterviewDetailPage";
import InterviewHistoryPage from "../features/history/pages/InterviewHistoryPage";
import { ROUTES } from "../shared/constants/routes";
import { useAuth } from "../features/auth/hooks/useAuth";

function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.interviewSetup} replace />;
  }

  return children;
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return children;
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.login} replace />} />

      <Route element={<LoginAuthLayout />}>
        <Route
          path={ROUTES.login}
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
      </Route>

      <Route element={<AuthLayout />}>
        <Route
          path={ROUTES.register}
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.dashboard} element={<DashboardPage />} />
        <Route path={ROUTES.interviewSetup} element={<InterviewSetupPage />} />
        <Route path={ROUTES.interviewRoom} element={<InterviewRoomPage />} />
        <Route path={ROUTES.interviewRoomWithId} element={<InterviewRoomPage />} />
        <Route path={ROUTES.interviewResult} element={<InterviewResultPage />} />
        <Route path={ROUTES.history} element={<InterviewHistoryPage />} />
        <Route path={ROUTES.historyResult} element={<InterviewResultPage />} />
        <Route path={ROUTES.historyDetail} element={<InterviewDetailPage />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
    </Routes>
  );
}

export default AppRouter;
