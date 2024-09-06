'use client';
import { useState } from "react";
import Image from "next/image";
import Logo from "@/assets/images/traj_logo_blackR-removebg-preview.png"; 
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

export default function Home() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Get Started with the Fundamentals", status: "complete", due: "Due Yesterday" },
    { id: 2, title: "Backtracking", status: "not started", due: "Due Yesterday" },
    { id: 3, title: "Update your Resume", status: "not started", due: "Due Yesterday" },
    { id: 4, title: "Track Update", status: "not started", due: "Due Today" },
    { id: 5, title: "Networking Session", status: "not started", due: "Due in 2 Days" },
    { id: 6, title: "Project Proposal Submission", status: "complete", due: "Due in 3 Days" },
    { id: 7, title: "Coding Challenge", status: "not started", due: "Due in 5 Days" },
    { id: 8, title: "Team Meeting", status: "not started", due: "Due Tomorrow" },
    { id: 9, title: "Peer Review", status: "complete", due: "Due Yesterday" },
    { id: 10, title: "Final Report Draft", status: "not started", due: "Due Next Week" },
  ]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const completedTasks = tasks.filter((task) => task.status === "complete").length;
  const progress = (completedTasks / tasks.length) * 100;

  const toggleTaskStatus = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "complete" ? "not started" : "complete",
            }
          : task
      )
    );
  };

  return (
    <>
    <div className="min-h-screen bg-red-900 text-black flex flex-col overflow-hidden">
      
      <Header/>
      <header className="bg-gradient-to-br from-purple-200 to-purple-300 p-4 border-b border-black shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <Image src={Logo} alt="SaaS Logo" height={150} width={150} />
          
          <div className="md:hidden">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-black focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
  
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <div
          className={`md:w-64 bg-gradient-to-br from-purple-200 to-purple-300 border-r border-black p-4 md:block ${
            sidebarOpen ? "block" : "hidden"
          } md:relative transition-transform duration-200 ease-in-out z-20`}
        >
          <h2 className="text-2xl font-bold mb-6 group-hover:text-black transition duration-300 ease-in-out">Menu</h2>
          <nav className="space-y-2">
            <a href="#" className="block py-2 px-4 rounded-lg bg-purple-800 text-white">
              Dashboard
            </a>
            <a href="#" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-purple-700 hover:text-white transition-colors">
              Assignments
            </a>
            <a href="#" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-purple-700 hover:text-white transition-colors">
              Progress
            </a>
            <a href="#" className="block py-2 px-4 rounded-lg text-gray-600 hover:bg-purple-700 hover:text-white transition-colors">
              Settings
            </a>
          </nav>
        </div>
  
        {/* Overlay for mobile view */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-10 bg-black opacity-50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
  
        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-scroll bg-gradient-to-br from-white via-purple-50 to-purple-100 border-l border-purple-300 shadow-inner">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-800 via-purple-400 to-purple-300 bg-clip-text text-transparent">
                Welcome!
              </h1>
              <div className="text-center">
                <div className="text-sm text-purple-800">Progress</div>
                <div className="text-5xl font-bold text-purple-800">{completedTasks * 16}%</div>
                <div className="text-xs text-gray-600">+{completedTasks * 16}% INCREASE</div>
              </div>
            </div>
  
            <div className="border text-center border-purple-300 shadow-lg p-4 rounded-lg mb-8 bg-white">
              <div className="flex justify-between mb-4 text-gray-800">
                <span>JobTitle</span>
                <span>{completedTasks}/{tasks.length} Complete</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-lg overflow-hidden">
                <div
                  className="bg-purple-800 h-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
  
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center border border-gray-300 group hover:bg-purple-200 transition duration-300 ease-in-out p-4 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={task.status === "complete"}
                      onChange={() => toggleTaskStatus(task.id)}
                      className="h-6 w-6 text-purple-800 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <div>
                      <h2 className="text-xl text-gray-800 group-hover:text-black transition duration-300 ease-in-out">
                        {task.title}
                      </h2>
                      <p className="text-gray-500 text-sm group-hover:text-black transition duration-300 ease-in-out">
                        {task.due}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`${
                      task.status === "complete"
                        ? "text-green-500"
                        : "text-red-500"
                    } font-bold`}
                  >
                    {task.status === "complete" ? "COMPLETE" : "NOT STARTED"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
