import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Student from "./components/Student";
import Teacher from "./components/Teacher";

export default function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/student' element={<Student />} />
          <Route path='/teacher' element={<Teacher />} />
        </Routes>
      </Router>
    </div>
  )
}