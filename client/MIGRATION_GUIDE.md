# Migration Guide: Angular to React

The project has been successfully migrated to a MERN stack structure.

## Structure
- **client/**: The new React application (Vite + TailwindCSS + React Router).
- **client-angular/**: The original Angular application (kept as backup/reference).
- **server/**: The existing Node/Express backend (unchanged).

## Completed Modules
The following components have been fully ported to React:
1. **Authentication**:
   - `Login.jsx` matches the original design and logic.
   - `AuthContext.jsx` handles user state and session persistence.
2. **Layout**:
   - `Layout.jsx`, `Sidebar.jsx`, `Header.jsx` replicate the dashboard shell.
   - Sidebar filters items based on user role (Admin vs Employee).
   - Header includes real-time notifications via Socket.io.
3. **User Management**:
   - `ManageUsers.jsx` implements full CRUD operations (Create, Read, Update, Delete).
   - Includes image upload, age validation, and role selection.
   - Uses `ConfirmModal` for safe deletions.

## Pending Modules
The following pages are created as placeholders and need detailed implementation logic ported from `client-angular`:
- `AdminDashboard.jsx`
- `EmployeeDashboard.jsx`
- `ManageProjects.jsx`
- `ManageTasks.jsx`
- `DailyLogs.jsx`
- `ProjectDetails.jsx`

## How to Run
1. Start the Server:
   ```bash
   cd server
   npm start
   # Runs on port 5000
   ```

2. Start the Client:
   ```bash
   cd client
   npm install
   npm run dev
   # Runs on port 5173
   ```
   The client is configured to proxy API requests to `http://localhost:5000`.

## Notes
- Tailwind CSS v4 is configured using `@tailwindcss/vite`.
- Icons use `lucide-react`.
- Notifications use `socket.io-client`.
