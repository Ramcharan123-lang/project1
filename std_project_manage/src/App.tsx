import { useState } from "react";
import { Login } from "./components/Login";
import { Registration } from "./components/Registration";
import { AdminDashboard } from "./components/AdminDashboard";
import { StudentDashboard } from "./components/StudentDashboard";
import { Profile } from "./components/Profile";
import { ProfileSetup } from "./components/ProfileSetup";
import { Toaster } from "./components/ui/sonner";

type UserType = "admin" | "student";
type View =
  | "login"
  | "registration"
  | "profileSetup"
  | "dashboard"
  | "profile";

export default function App() {
  // Pre-populated student account with complete profile
  const preloadedStudent = {
    email: "2400030525@kluniversity.in",
    password: "Ram",
    userType: "student",
    profileComplete: true,
    name: "Ram Char",
    studentId: "2498765",
    phone: "9856774325",
    academicYear: "2",
    branch: "CSE",
    groupNumber: "1",
    id: 1,
  };

  // Pre-populated admin account with complete profile
  const preloadedAdmin = {
    email: "ramcharang1777@gmail.com",
    password: "Ram123",
    userType: "admin",
    profileComplete: true,
    name: "Rc",
    phone: "9876543210",
    department: "Faculty",
    id: 2,
  };

  const [currentView, setCurrentView] = useState<View>("login");
  const [userType, setUserType] = useState<UserType | null>(
    null,
  );
  const [user, setUser] = useState<any>(null);
  // Store all registered accounts - pre-populate with both accounts
  const [accounts, setAccounts] = useState<any[]>([
    preloadedStudent,
    preloadedAdmin,
  ]);
  // Shared projects state - visible to both admin and students
  const [projects, setProjects] = useState<any[]>([]);
  // Shared submissions state - students submit, admins review
  const [submissions, setSubmissions] = useState<any[]>([]);
  // Shared tasks state - students create and manage tasks
  const [tasks, setTasks] = useState<any[]>([]);

  const handleRegister = (type: UserType, userData: any) => {
    const newAccount = {
      ...userData,
      id: accounts.length + 1,
      userType: type,
      profileComplete: false,
    };

    // Store the new account
    setAccounts([...accounts, newAccount]);
    setUserType(type);
    setUser(newAccount);
    setCurrentView("profileSetup");
  };

  const handleLogin = (type: UserType, userData: any) => {
    setUserType(type);
    setUser(userData);
    // Check if user has completed profile setup
    if (!userData.profileComplete) {
      setCurrentView("profileSetup");
    } else {
      setCurrentView("dashboard");
    }
  };

  const handleShowRegistration = () => {
    setCurrentView("registration");
  };

  const handleBackToLogin = () => {
    setCurrentView("login");
  };

  const handleProfileSetupComplete = (profileData: any) => {
    const updatedUser = {
      ...user,
      ...profileData,
      profileComplete: true,
      // Initialize average grade as null - only admins can set this
      averageGrade: null,
    };

    // Update user state
    setUser(updatedUser);

    // Update the account in the accounts array
    setAccounts(
      accounts.map((acc) =>
        acc.email === user.email ? updatedUser : acc,
      ),
    );

    setCurrentView("dashboard");
  };

  const handleShowProfile = () => {
    setCurrentView("profile");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
  };

  const handleProfileUpdate = (updatedUser: any) => {
    setUser(updatedUser);
    // Update the account in the accounts array
    setAccounts(
      accounts.map((acc) =>
        acc.email === updatedUser.email ? updatedUser : acc,
      ),
    );
  };

  const handleLogout = () => {
    setUserType(null);
    setUser(null);
    setCurrentView("login");
  };

  const handleUpdateProjects = (updatedProjects: any[]) => {
    setProjects(updatedProjects);
  };

  const handleUpdateSubmissions = (
    updatedSubmissions: any[],
  ) => {
    setSubmissions(updatedSubmissions);
  };

  const handleUpdateTasks = (updatedTasks: any[]) => {
    setTasks(updatedTasks);
  };

  const handleCreateStudentAccount = (studentData: any) => {
    const newAccount = {
      ...studentData,
      id: Math.max(...accounts.map((a) => a.id), 0) + 1,
      userType: "student",
      profileComplete: true,
    };

    setAccounts([...accounts, newAccount]);
    return newAccount;
  };

  return (
    <>
      {currentView === "login" && (
        <Login
          onLogin={handleLogin}
          onShowRegistration={handleShowRegistration}
          accounts={accounts}
        />
      )}

      {currentView === "registration" && (
        <Registration
          onRegister={handleRegister}
          onBackToLogin={handleBackToLogin}
          existingAccounts={accounts}
        />
      )}

      {currentView === "profileSetup" && userType && (
        <ProfileSetup
          userType={userType}
          initialData={user}
          onComplete={handleProfileSetupComplete}
        />
      )}

      {currentView === "profile" && user && userType && (
        <Profile
          user={user}
          userType={userType}
          onBack={handleBackToDashboard}
          onUpdate={handleProfileUpdate}
        />
      )}

      {currentView === "dashboard" && user && userType && (
        <>
          {userType === "admin" ? (
            <AdminDashboard
              user={user}
              onShowProfile={handleShowProfile}
              onLogout={handleLogout}
              projects={projects}
              onUpdateProjects={handleUpdateProjects}
              submissions={submissions}
              onUpdateSubmissions={handleUpdateSubmissions}
              tasks={tasks}
              onCreateStudentAccount={
                handleCreateStudentAccount
              }
              allAccounts={accounts}
            />
          ) : (
            <StudentDashboard
              user={user}
              onShowProfile={handleShowProfile}
              onLogout={handleLogout}
              projects={projects}
              onUpdateSubmissions={handleUpdateSubmissions}
              submissions={submissions}
              tasks={tasks}
              onUpdateTasks={handleUpdateTasks}
            />
          )}
        </>
      )}

      {!currentView && (
        <Login
          onLogin={handleLogin}
          onShowRegistration={handleShowRegistration}
          accounts={accounts}
        />
      )}

      <Toaster />
    </>
  );
}