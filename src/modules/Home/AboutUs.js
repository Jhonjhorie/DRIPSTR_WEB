import React from "react";

const members = [
  { name: "Salan, Jolina F. ", role: "Project Manager", isLead: true },
  {
    name: "Abuso, Andrea Lauren M.  ",
    role: "Programmer",
    specificRole: "Front-end UI/UX",
  },
  {
    name: "Alayon, Catherine M. ",
    role: "Programmer",
    specificRole: "Back-end Developer",
  },
  {
    name: "Aragon, Andrei Niño B. ",
    role: "Programmer",
    specificRole: "Database Administrator",
  },
  {
    name: "Calma, Justine Dwayne F. ",
    role: "Programmer",
    specificRole: "Full-stack Developer",
  },
  {
    name: "Corporal, Paolo A. ",
    role: "Programmer",
    specificRole: "Mobile Developer",
  },
  {
    name: "Garcia, Jayson P. ",
    role: "Programmer",
    specificRole: "Game Developer",
  },
  {
    name: "Masa, Karl Allican B. ",
    role: "Programmer",
    specificRole: "DevOps Engineer",
  },
  {
    name: "Mendoza, Angel Mae",
    role: "Programmer",
    specificRole: "Security Engineer",
  },
  {
    name: "Nevado, Jeyson N. ",
    role: "Documents",
    specificRole: "Technical Writer",
  },
  {
    name: "Orallo, Mark Danielle P. ",
    role: "Documents",
    specificRole: "Researcher",
  },
  { name: "Osorio, Timothy C. ", role: "Documents", specificRole: "Editor" },
  {
    name: "Quiling, Jhon Jhorie A. ",
    role: "Documents",
    specificRole: "Content Designer",
  },
  { name: "Rodriguez, Peter", role: "Documents", specificRole: "QA Analyst" },
  {
    name: "Sancha, Samantha Nicole B",
    role: "Documents",
    specificRole: "Compliance Specialist",
  },
  {
    name: "Sarmiento, Reymark Paul V.",
    role: "Documents",
    specificRole: "UX Researcher",
  },
  {
    name: "Sevilla, Jenifer R.",
    role: "Documents",
    specificRole: "Data Analyst",
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 drop-shadow-lg">
          About Us
        </h1>
        <p className="mt-4 text-gray-600 text-center drop-shadow-md">
          We are 4th-year IT students from Quezon City University (QCU) with a
          passion for technology. Our mission is to create innovative and
          practical IT solutions that make a difference.
        </p>
        <div className="m-6">
          <div className="text-center">
            <h2 className="text-2xl mb-4 font-semibold text-gray-700 text-center drop-shadow-lg">
              Our Team
            </h2>
            <div className="w-full bg-gray-800 text-center p-4 rounded-lg">
              {members
                .filter((m) => m.isLead)
                .map((lead, index) => (
                  <div key={index} className="group">
                    <div className="w-40 h-40 bg-gray-300 rounded-full mx-auto mb-2 duration-500 group-hover:scale-125"></div>
                    <p className="mt-2 font-bold text-white duration-500 group-hover:scale-125 drop-shadow-lg">
                      {lead.name}
                    </p>
                    <p className="text-sm text-gray-300 duration-500 group-hover:scale-125 drop-shadow-md">
                      {lead.role}
                    </p>
                  </div>
                ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div>
              <p className="mb-4 text-gray-800 drop-shadow-lg font-bold text-center">
                Programmers
              </p>
              <div className="grid grid-cols-2 gap-4">
                {members
                  .filter((m) => m.role === "Programmer")
                  .map((member, index) => (
                    <div key={index} className="text-center group">
                      <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto duration-500 group-hover:scale-125"></div>
                      <p className="mt-2 font-medium text-gray-800 duration-500 group-hover:scale-125 drop-shadow-lg">
                        {member.name}
                      </p>
                      <p className="text-sm text-gray-500 duration-500 group-hover:scale-125 drop-shadow-md">
                        {member.specificRole}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <p className="mb-4 text-gray-800 drop-shadow-lg font-bold text-center">
                Documents
              </p>
              <div className="grid grid-cols-2 gap-4">
                {members
                  .filter((m) => m.role === "Documents")
                  .map((member, index) => (
                    <div key={index} className="text-center group">
                      <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto duration-500 group-hover:scale-125"></div>
                      <p className="mt-2 font-medium text-gray-800 duration-500 group-hover:scale-125 drop-shadow-lg">
                        {member.name}
                      </p>
                      <p className="text-sm text-gray-500 duration-500 group-hover:scale-125 drop-shadow-md">
                        {member.specificRole}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
